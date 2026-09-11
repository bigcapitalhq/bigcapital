import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Knex } from 'knex';
import {
  BillLandedCostsBridge,
  IBillItemAllocatedCost,
  IBillLandedCostEntryDTO,
  IBillLandedCostEntryLike,
  IBillLandedCostLedgerEntry,
  IBillLandedCostsProvider,
} from '@/modules/Bills/integrations/BillLandedCostsBridge';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { Item } from '@/modules/Items/models/Item';
import { ServiceError } from '@/modules/Items/ServiceError';
import { transformToMap } from '@/utils/transform-to-key';
import { BillLandedCost } from './models/BillLandedCost';
import { TransactionLandedCostEntriesService } from './TransactionLandedCostEntries.service';
import { ERRORS } from './utils';

@Injectable()
export class LandedCostsBridgeProvider
  implements IBillLandedCostsProvider, OnModuleInit
{
  constructor(
    private readonly bridge: BillLandedCostsBridge,
    private readonly transactionLandedCostEntries: TransactionLandedCostEntriesService,

    @Inject(BillLandedCost.name)
    private readonly billLandedCostModel: TenantModelProxy<
      typeof BillLandedCost
    >,

    @Inject(Item.name)
    private readonly itemModel: TenantModelProxy<typeof Item>,
  ) {}

  /**
   * Registers the landed cost provider on the bills bridge.
   */
  onModuleInit() {
    this.bridge.register(this);
  }

  /**
   * Validates the given bill has no associated allocated landed costs.
   * @param {number} billId - Bill id.
   * @param {Knex.Transaction} trx - Knex transaction.
   */
  public async validateBillHasNoLandedCosts(
    billId: number,
    trx?: Knex.Transaction,
  ): Promise<void> {
    const billLandedCosts = await this.billLandedCostModel()
      .query(trx)
      .where('billId', billId);

    if (billLandedCosts.length > 0) {
      throw new ServiceError(ERRORS.BILL_HAS_ASSOCIATED_LANDED_COSTS);
    }
  }

  /**
   * Validates the bill entries that have landed cost flag should be
   * inventory items.
   * @param {IBillLandedCostEntryDTO[]} entries - Bill entries.
   */
  public async validateBillEntries(
    entries: IBillLandedCostEntryDTO[],
  ): Promise<void> {
    const entriesItemsIds = entries.map((e) => e.itemId);
    const entriesItems = await this.itemModel()
      .query()
      .whereIn('id', entriesItemsIds);

    const entriesItemsById = transformToMap(entriesItems, 'id');

    const nonInventoryHasCost = entries.filter((entry) => {
      const item = entriesItemsById.get(entry.itemId);

      return entry.landedCost && item.type !== 'inventory';
    });
    if (nonInventoryHasCost.length > 0) {
      throw new ServiceError(
        ERRORS.LANDED_COST_ENTRIES_SHOULD_BE_INVENTORY_ITEMS,
      );
    }
  }

  /**
   * Validates the bill edit operation against associated landed costs.
   * @param {IBillLandedCostEntryLike[]} oldEntries - Old bill entries.
   * @param {IBillLandedCostEntryLike[]} newEntries - New bill entries.
   */
  public validateBillEditEntries(
    oldEntries: IBillLandedCostEntryLike[],
    newEntries: IBillLandedCostEntryLike[],
  ): void {
    this.transactionLandedCostEntries.validateLandedCostEntriesNotDeleted(
      oldEntries,
      newEntries,
    );
    this.transactionLandedCostEntries.validateLocatedCostEntriesSmallerThanNewEntries(
      oldEntries,
      newEntries,
    );
  }

  /**
   * Retrieves the item entries allocated landed costs of the given bill.
   * @param {number} billId - Bill id.
   * @param {Knex.Transaction} trx - Knex transaction.
   */
  public async getItemAllocatedCosts(
    billId: number,
    trx?: Knex.Transaction,
  ): Promise<IBillItemAllocatedCost[]> {
    const landedCosts = await this.billLandedCostModel()
      .query(trx)
      .where('billId', billId)
      .withGraphFetched('allocateEntries');

    const allocatedCostsMap = new Map<number, number>();
    landedCosts.forEach((landedCost) => {
      landedCost.allocateEntries.forEach((entry) => {
        const allocatedCost = allocatedCostsMap.get(entry.entryId) ?? 0;
        allocatedCostsMap.set(entry.entryId, allocatedCost + entry.cost);
      });
    });

    return [...allocatedCostsMap.entries()].map(([entryId, amount]) => ({
      entryId,
      amount,
    }));
  }

  /**
   * Retrieves the landed costs ledger contribution of the given bill.
   * @param {number} billId - Bill id.
   * @param {Knex.Transaction} trx - Knex transaction.
   */
  public async getLandedCostLedgerEntries(
    billId: number,
    trx?: Knex.Transaction,
  ): Promise<IBillLandedCostLedgerEntry[]> {
    const landedCosts = await this.billLandedCostModel()
      .query(trx)
      .where('billId', billId);

    return landedCosts.map((landedCost) => ({
      amount: landedCost.amount,
      costAccountId: landedCost.costAccountId,
    }));
  }
}
