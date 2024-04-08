import { CreateUncategorizedTransactionDTO } from '@/interfaces';
import { Knex } from 'knex';
import { Inject, Service } from 'typedi';
import * as yup from 'yup';
import { Importable } from '../Import/Importable';
import { ImportableContext } from '../Import/interfaces';
import HasTenancyService from '../Tenancy/TenancyService';
import { CreateUncategorizedTransaction } from './CreateUncategorizedTransaction';
import { BankTransactionsSampleData } from './constants';

@Service()
export class UncategorizedTransactionsImportable extends Importable {
  @Inject()
  private createUncategorizedTransaction: CreateUncategorizedTransaction;

  @Inject()
  private tenancy: HasTenancyService;
  /**
   * Passing the sheet DTO to create uncategorized transaction.
   * @param {number} tenantId
   * @param {number} tenantId
   * @param {any} createDTO
   * @param {Knex.Transaction} trx
   */
  public async importable(tenantId: number, createDTO: CreateUncategorizedTransactionDTO, trx?: Knex.Transaction) {
    return this.createUncategorizedTransaction.create(tenantId, createDTO, trx);
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
    };
  }

  /**
   * Sample data used to download sample sheet.
   * @returns {Record<string, any>[]}
   */
  public sampleData(): Record<string, any>[] {
    return BankTransactionsSampleData;
  }

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
  public async validateParams(tenantId: number, params: Record<string, any>): Promise<void> {
    const { Account } = this.tenancy.models(tenantId);

    if (params.accountId) {
      await Account.query().findById(params.accountId).throwIfNotFound({});
    }
  }
}
