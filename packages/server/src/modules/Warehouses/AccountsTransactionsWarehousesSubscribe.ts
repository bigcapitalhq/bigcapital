import { Injectable } from '@nestjs/common';
import { InventoryTransactionsWarehouses } from './AccountsTransactionsWarehouses';
import { OnEvent } from '@nestjs/event-emitter';
import { IBranchesActivatedPayload } from '../Branches/Branches.types';
import { events } from '@/common/events/events';

@Injectable()
export class AccountsTransactionsWarehousesSubscribe {
  constructor(
    private readonly accountsTransactionsWarehouses: InventoryTransactionsWarehouses,
  ) {}

  /**
   * Updates all GL transactions to primary branch once
   * the multi-branches activated.
   * @param {IBranchesActivatedPayload}
   */
  @OnEvent(events.branch.onActivated)
  async updateGLTransactionsToPrimaryBranchOnActivated({
    primaryBranch,
    trx,
  }: IBranchesActivatedPayload) {
    await this.accountsTransactionsWarehouses.updateTransactionsWithWarehouse(
      primaryBranch.id,
      trx,
    );
  }
}
