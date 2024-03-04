import { Inject, Service } from 'typedi';
import HasTenancyService from '../Tenancy/TenancyService';
import UnitOfWork, { IsolationLevel } from '../UnitOfWork';
import { Knex } from 'knex';
import { CreateUncategorizedTransactionDTO } from '@/interfaces';

@Service()
export class CreateUncategorizedTransaction {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private uow: UnitOfWork;

  /**
   * Creates an uncategorized cashflow transaction.
   * @param {number} tenantId
   * @param {CreateUncategorizedTransactionDTO} createDTO
   */
  public create(
    tenantId: number,
    createDTO: CreateUncategorizedTransactionDTO
  ) {
    const { UncategorizedCashflowTransaction, Account } =
      this.tenancy.models(tenantId);

    return this.uow.withTransaction(
      tenantId,
      async (trx: Knex.Transaction) => {
        const transaction = await UncategorizedCashflowTransaction.query(
          trx
        ).insertAndFetch({
          ...createDTO,
        });
        
        return transaction;
      },
    );
  }
}
