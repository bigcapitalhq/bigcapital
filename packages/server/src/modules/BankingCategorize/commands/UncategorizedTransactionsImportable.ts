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
import { ImportRowSkip } from '../../Import/interfaces';
import { ImportModelShape } from '../../Import/models/Import';
import {
  BANK_IMPORT_DUPLICATE_ERROR_CODE,
  findDuplicateRowIndexes,
  formatDuplicateRowMessage,
  parseBankRowDate,
} from '../utils/bankImportDuplicates';

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
    return this.createUncategorizedTransaction.create(createDTO, trx);
  }

  /**
   * Skips the file rows already in the bank account, counting occurrences so
   * identical rows in one file still import.
   * @param {Record<string, any>[]} parsedData - Parsed rows, in file order.
   * @param {ImportModelShape} importFile
   * @returns {Promise<ImportRowSkip[]>}
   */
  public async getSkippedRows(
    parsedData: Record<string, any>[],
    importFile: ImportModelShape,
  ): Promise<ImportRowSkip[]> {
    const dates = parsedData
      .map((row) => parseBankRowDate(row.date))
      .filter(Boolean)
      .sort();

    if (dates.length === 0) return [];

    // Read committed rows only, outside the import's read-uncommitted
    // transaction, so rows a concurrent preview inserts then rolls back
    // never count as already imported.
    const existingRows = await this.uncategorizedBankTransactionModel()
      .query()
      .where('accountId', importFile.paramsParsed.accountId)
      .whereBetween('date', [dates[0], dates[dates.length - 1]])
      .select('date', 'amount', 'payee', 'description', 'referenceNo');

    return findDuplicateRowIndexes(parsedData, existingRows).map((index) => ({
      index,
      errorCode: BANK_IMPORT_DUPLICATE_ERROR_CODE,
      errorMessage: formatDuplicateRowMessage(parsedData[index]),
    }));
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
    return {
      ...createDTO,
      accountId: context.import.paramsParsed.accountId,
      batch: context.import.paramsParsed.batch,
    };
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
