import { Knex } from 'knex';
import { Inject, Service } from 'typedi';
import HasTenancyService from '../Tenancy/TenancyService';
import UnitOfWork from '../UnitOfWork';
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
    createDTO: CreateUncategorizedTransactionDTO,
    trx?: Knex.Transaction
  ) {
    const { UncategorizedCashflowTransaction } = this.tenancy.models(tenantId);

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
      trx
    );
  }
}
