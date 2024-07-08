import { Inject, Service } from 'typedi';
import { Knex } from 'knex';
import * as yup from 'yup';
import uniqid from 'uniqid';
import { Importable } from '../Import/Importable';
import { CreateUncategorizedTransaction } from './CreateUncategorizedTransaction';
import { CreateUncategorizedTransactionDTO } from '@/interfaces';
import { ImportableContext } from '../Import/interfaces';
import HasTenancyService from '../Tenancy/TenancyService';
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
  public async importable(
    tenantId: number,
    createDTO: CreateUncategorizedTransactionDTO,
    trx?: Knex.Transaction
  ) {
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
    context?: ImportableContext
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
  public async validateParams(
    tenantId: number,
    params: Record<string, any>
  ): Promise<void> {
    const { Account } = this.tenancy.models(tenantId);

    if (params.accountId) {
      await Account.query().findById(params.accountId).throwIfNotFound({});
    }
  }

  /**
   * Transformes the import params before storing them.
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
