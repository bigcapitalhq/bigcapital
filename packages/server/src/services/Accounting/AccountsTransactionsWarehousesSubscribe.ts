import { Service, Inject } from 'typedi';
import events from '@/subscribers/events';
import { InventoryTransactionsWarehouses } from './AccountsTransactionsWarehouses';
import { IBranchesActivatedPayload } from '@/interfaces';

@Service()
export class AccountsTransactionsWarehousesSubscribe {
  @Inject()
  accountsTransactionsWarehouses: InventoryTransactionsWarehouses;

  /**
   * Attaches events with handlers.
   */
  public attach = (bus) => {
    bus.subscribe(
      events.branch.onActivated,
      this.updateGLTransactionsToPrimaryBranchOnActivated
    );
    return bus;
  };

  /**
   * Updates all GL transactions to primary branch once
   * the multi-branches activated.
   * @param {IBranchesActivatedPayload}
   */
  private updateGLTransactionsToPrimaryBranchOnActivated = async ({
    tenantId,
    primaryBranch,
    trx,
  }: IBranchesActivatedPayload) => {
    await this.accountsTransactionsWarehouses.updateTransactionsWithWarehouse(
      tenantId,
      primaryBranch.id,
      trx
    );
  };
}
