import { IBranchesActivatedPayload } from '@/interfaces';
import events from '@/subscribers/events';
import { Inject, Service } from 'typedi';
import { InventoryTransactionsWarehouses } from './AccountsTransactionsWarehouses';

@Service()
export class AccountsTransactionsWarehousesSubscribe {
  @Inject()
  accountsTransactionsWarehouses: InventoryTransactionsWarehouses;

  /**
   * Attaches events with handlers.
   */
  public attach = (bus) => {
    bus.subscribe(events.branch.onActivated, this.updateGLTransactionsToPrimaryBranchOnActivated);
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
    await this.accountsTransactionsWarehouses.updateTransactionsWithWarehouse(tenantId, primaryBranch.id, trx);
  };
}
