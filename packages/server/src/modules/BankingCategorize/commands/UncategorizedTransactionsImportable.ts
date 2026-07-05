import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import * as yup from 'yup';
import * as uniqid from 'uniqid';
import { Importable } from '../../Import/Importable';
import { CreateUncategorizedTransactionService } from './CreateUncategorizedTransaction.service';
import { ImportableContext } from '../../Import/interfaces';
import { BankTransactionsSampleData } from '../../BankingTransactions/constants';
import { Account } from '@/modules/Accounts/models/Account.model';
import { CreateUncategorizedTransactionDTO } from '../types/BankingCategorize.types';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { ImportableService } from '../../Import/decorators/Import.decorator';
import { UncategorizedBankTransaction } from '../../BankingTransactions/models/UncategorizedBankTransaction';
import { ServiceError } from '../../Items/ServiceError';
import {
  ANZ_BANK_FORMAT,
  buildBankTransactionUniqueId,
  isAnzBankStatementSheet,
  transformAnzStatementRows,
} from './AnzBankStatementFormat';

@Injectable()
@ImportableService({ name: UncategorizedBankTransaction.name })
export class UncategorizedTransactionsImportable extends Importable {
  constructor(
    private readonly createUncategorizedTransaction: CreateUncategorizedTransactionService,

    @Inject(Account.name)
    private readonly accountModel: TenantModelProxy<typeof Account>,

    @Inject(UncategorizedBankTransaction.name)
    private readonly uncategorizedBankTransactionModel: TenantModelProxy<
      typeof UncategorizedBankTransaction
    >,
  ) {
    super();
  }

  /**
   * Passing the sheet DTO to create uncategorized transaction.
   * @param {CreateUncategorizedTransactionDTO,} createDTO
   * @param {Knex.Transaction} trx
   */
  public async importable(
    createDTO: CreateUncategorizedTransactionDTO,
    trx?: Knex.Transaction,
  ) {
    // Skip rows that were already imported (deterministic unique id set
    // by the bank-format pre-transform).
    if (createDTO.plaidTransactionId) {
      const existing = await this.uncategorizedBankTransactionModel()
        .query(trx)
        .findOne({ plaidTransactionId: createDTO.plaidTransactionId });

      if (existing) {
        throw new ServiceError(
          'DUPLICATE_BANK_TRANSACTION',
          'The bank transaction has already been imported.',
        );
      }
    }
    return this.createUncategorizedTransaction.create(createDTO, trx);
  }

  /**
   * Pre-transforms the raw sheet rows: detects ANZ (NZ) statement exports
   * and normalizes them (type-conditional payee column, dd/MM/yyyy dates,
   * FX descriptions, occurrence-suffixed references) so the standard
   * column mapping applies.
   */
  public preParseSheet(
    sheetData: Record<string, unknown>[],
    importFile?: any,
  ): Record<string, unknown>[] {
    const params = importFile?.paramsParsed || {};
    // Explicit opt-out.
    if (params.bankFormat === 'none') return sheetData;

    const isAnz =
      params.bankFormat === ANZ_BANK_FORMAT ||
      isAnzBankStatementSheet(sheetData, importFile?.columnsParsed);

    if (!isAnz) return sheetData;

    // Annotate the import params (in-memory) so transform() computes the
    // dedup unique id for the normalized rows.
    if (importFile) {
      importFile.params = JSON.stringify({
        ...params,
        detectedBankFormat: ANZ_BANK_FORMAT,
      });
    }
    return transformAnzStatementRows(sheetData);
  }

  /**
   * Transformes the DTO before validating and importing.
   * @param {CreateUncategorizedTransactionDTO} createDTO
   * @param {ImportableContext} context
   * @returns {CreateUncategorizedTransactionDTO}
   */
  public transform(
    createDTO: CreateUncategorizedTransactionDTO,
    context?: ImportableContext,
  ): CreateUncategorizedTransactionDTO {
    const params = context.import.paramsParsed;
    const transformed = {
      ...createDTO,
      accountId: params.accountId,
      batch: params.batch,
    };
    // Deterministic unique id so overlapping exports dedupe on re-import.
    if (params.detectedBankFormat === ANZ_BANK_FORMAT) {
      transformed.plaidTransactionId = buildBankTransactionUniqueId(
        params.accountId,
        transformed,
      );
    }
    return transformed;
  }

  /**
   * Sample data used to download sample sheet.
   * @returns {Record<string, any>[]}
   */
  public sampleData(): Record<string, any>[] {
    return BankTransactionsSampleData;
  }

  // ------------------
  // # Params
  // ------------------
  /**
   * Params validation schema.
   * @returns {ValidationSchema[]}
   */
  public paramsValidationSchema() {
    return yup.object().shape({
      accountId: yup.number().required(),
      // Bank export format: auto-detected when omitted; 'none' opts out.
      bankFormat: yup
        .string()
        .oneOf([ANZ_BANK_FORMAT, 'none'])
        .nullable()
        .notRequired(),
    });
  }

  /**
   * Validates the params existance asyncly.
   * @param {number} tenantId -
   * @param {Record<string, any>} params -
   */
  public async validateParams(params: Record<string, any>): Promise<void> {
    if (params.accountId) {
      await this.accountModel()
        .query()
        .findById(params.accountId)
        .throwIfNotFound({});
    }
  }

  /**
   * Transforms the import params before storing them.
   * @param {Record<string, any>} parmas
   */
  public transformParams(parmas: Record<string, any>) {
    const batch = uniqid();

    return {
      ...parmas,
      batch,
    };
  }
}
