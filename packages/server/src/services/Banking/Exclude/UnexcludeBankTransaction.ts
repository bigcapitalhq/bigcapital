import HasTenancyService from '@/services/Tenancy/TenancyService';
import UnitOfWork from '@/services/UnitOfWork';
import { Inject, Service } from 'typedi';
import { validateTransactionNotCategorized } from './utils';

@Service()
export class UnexcludeBankTransaction {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private uow: UnitOfWork;

  /**
   * Marks the given bank transaction as excluded.
   * @param {number} tenantId
   * @param {number} bankTransactionId
   * @returns {Promise<void>}
   */
  public async unexcludeBankTransaction(
    tenantId: number,
    uncategorizedTransactionId: number
  ) {
    const { UncategorizedCashflowTransaction } = this.tenancy.models(tenantId);

    const oldUncategorizedTransaction =
      await UncategorizedCashflowTransaction.query()
        .findById(uncategorizedTransactionId)
        .throwIfNotFound();

    validateTransactionNotCategorized(oldUncategorizedTransaction);

    return this.uow.withTransaction(tenantId, async (trx) => {
      await UncategorizedCashflowTransaction.query(trx)
        .findById(uncategorizedTransactionId)
        .patch({
          excludedAt: null,
        });
    });
  }
}
