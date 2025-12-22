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
@Injectable()
@ImportableService({ name: UncategorizedBankTransaction.name })
export class UncategorizedTransactionsImportable extends Importable {
  constructor(
    private readonly createUncategorizedTransaction: CreateUncategorizedTransactionService,

    @Inject(Account.name)
    private readonly accountModel: TenantModelProxy<typeof Account>,
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
