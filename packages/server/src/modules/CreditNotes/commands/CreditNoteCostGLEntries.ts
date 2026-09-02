import { Knex } from 'knex';
import { Inject, Injectable } from '@nestjs/common';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { InventoryCostLotTracker } from '@/modules/InventoryCost/models/InventoryCostLotTracker';
import { LedgerStorageService } from '@/modules/Ledger/LedgerStorage.service';
import { groupInventoryTransactionsByTypeId } from '@/modules/InventoryCost/utils';
import { Ledger } from '@/modules/Ledger/Ledger';
import { AccountNormal } from '@/interfaces/Account';
import { ILedgerEntry } from '@/modules/Ledger/types/Ledger.types';
import { increment } from '@/utils/increment';

/**
 * Reverse COGS for CreditNote inventory IN lots (linked returns).
 * Debit Inventory / Credit COGS at lot cost.
 */
@Injectable()
export class CreditNoteCostGLEntries {
  constructor(
    private readonly ledgerStorage: LedgerStorageService,

    @Inject(InventoryCostLotTracker.name)
    private readonly inventoryCostLotTracker: TenantModelProxy<
      typeof InventoryCostLotTracker
    >,
  ) {}

  public writeInventoryCostJournalEntries = async (
    startingDate: Date,
    trx?: Knex.Transaction,
  ): Promise<void> => {
    const inventoryCostLotTrans = await this.inventoryCostLotTracker()
      .query()
      .where('direction', 'IN')
      .where('transaction_type', 'CreditNote')
      .where('cost', '>', 0)
      .modify('filterDateRange', startingDate)
      .orderBy('date', 'ASC')
      .withGraphFetched('item')
      .withGraphFetched('itemEntry');

    const ledger = this.getInventoryCostLotsLedger(inventoryCostLotTrans);
    await this.ledgerStorage.commit(ledger, trx);
  };

  private getInventoryCostLotsLedger = (
    inventoryCostLots: InventoryCostLotTracker[],
  ) => {
    const inventoryTransactions = groupInventoryTransactionsByTypeId(
      inventoryCostLots,
    ) as InventoryCostLotTracker[][];

    const entries = inventoryTransactions
      .map(this.getCreditNoteCostGLEntries)
      .flat();

    return new Ledger(entries);
  };

  private getCreditNoteCostGLEntries = (
    inventoryCostLots: InventoryCostLotTracker[],
  ): ILedgerEntry[] => {
    const commonEntry = {
      currencyCode: 'USD',
      exchangeRate: 1,
      transactionNumber: '',
      referenceNumber: '',
      indexGroup: 20,
      costable: true,
      createdAt: inventoryCostLots[0]?.createdAt,
      date: inventoryCostLots[0]?.date,
      transactionType: 'CreditNote',
      transactionId: inventoryCostLots[0]?.transactionId,
      branchId: (inventoryCostLots[0] as any)?.branchId,
      note: '',
    };

    const getIndex = increment(0);

    return inventoryCostLots
      .filter((lot) => Number(lot.cost) > 0)
      .flatMap((lot) => {
        const cost = Number(lot.cost);
        const inventoryAccountId = lot.item?.inventoryAccountId;
        const cogsAccountId = lot.costAccountId || lot.item?.costAccountId;

        if (!inventoryAccountId || !cogsAccountId) {
          return [];
        }

        const index = getIndex();

        // Reverse sale COGS: Dr Inventory / Cr COGS
        const inventoryEntry: ILedgerEntry = {
          ...commonEntry,
          index,
          accountId: inventoryAccountId,
          credit: 0,
          debit: cost,
          accountNormal: AccountNormal.DEBIT,
          itemId: lot.itemId,
        };

        const cogsEntry: ILedgerEntry = {
          ...commonEntry,
          index,
          accountId: cogsAccountId,
          credit: cost,
          debit: 0,
          accountNormal: AccountNormal.DEBIT,
          itemId: lot.itemId,
        };

        return [inventoryEntry, cogsEntry];
      });
  };
}
