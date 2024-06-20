import HasTenancyService from '@/services/Tenancy/TenancyService';
import UnitOfWork from '@/services/UnitOfWork';
import { Inject, Service } from 'typedi';
import { validateTransactionNotCategorized } from './utils';

@Service()
export class ExcludeBankTransaction {
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
  public async excludeBankTransaction(
    tenantId: number,
    bankTransactionId: number
  ) {
    const { UncategorizeCashflowTransaction } = this.tenancy.models(tenantId);

    const oldUncategorizedTransaction =
      await UncategorizeCashflowTransaction.query()
        .findById(bankTransactionId)
        .throwIfNotFound();

    validateTransactionNotCategorized(oldUncategorizedTransaction);

    return this.uow.withTransaction(tenantId, async (trx) => {
      await UncategorizeCashflowTransaction.query(trx)
        .findById(bankTransactionId)
        .patch({
          excluded: true,
        });
    });
  }
}
