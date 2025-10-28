import { Inject, Injectable } from '@nestjs/common';
import { PurchasesByItems } from './PurchasesByItems';
import {
  IPurchasesByItemsReportQuery,
  IPurchasesByItemsSheet,
} from './types/PurchasesByItems.types';
import { PurchasesByItemsMeta } from './PurchasesByItemsMeta';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InventoryTransaction } from '@/modules/InventoryCost/models/InventoryTransaction';
import { Item } from '@/modules/Items/models/Item';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { events } from '@/common/events/events';
import { getPurchasesByItemsDefaultQuery } from './utils';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class PurchasesByItemsService {
  /**
   * @param {PurchasesByItemsMeta} purchasesByItemsMeta - The purchases by items meta.
   * @param {EventEmitter2} eventPublisher - The event emitter.
   * @param {TenancyContext} tenancyContext - The tenancy context.
   * @param {typeof InventoryTransaction} inventoryTransactionModel - The inventory transaction model.
   * @param {typeof Item} itemModel - The item model.
   */
  constructor(
    private readonly purchasesByItemsMeta: PurchasesByItemsMeta,
    private readonly eventPublisher: EventEmitter2,
    private readonly tenancyContext: TenancyContext,

    @Inject(InventoryTransaction.name)
    private readonly inventoryTransactionModel: TenantModelProxy<
      typeof InventoryTransaction
    >,

    @Inject(Item.name)
    private readonly itemModel: TenantModelProxy<typeof Item>,
  ) {}

  /**
   * Retrieve purchases by items statement.
   * @param {IPurchasesByItemsReportQuery} query - Purchases by items report query.
   * @return {Promise<IPurchasesByItemsSheet>} - Purchases by items sheet.
   */
  public async purchasesByItems(
    query: IPurchasesByItemsReportQuery,
  ): Promise<IPurchasesByItemsSheet> {
    const tenantMetadata = await this.tenancyContext.getTenantMetadata();
    const filter = {
      ...getPurchasesByItemsDefaultQuery(),
      ...query,
    };
    const inventoryItems = await this.itemModel()
      .query()
      .onBuild((q) => {
        q.where('type', 'inventory');

        if (filter.itemsIds.length > 0) {
          q.whereIn('id', filter.itemsIds);
        }
      });
    const inventoryItemsIds = inventoryItems.map((item) => item.id);

    // Calculates the total inventory total quantity and rate `IN` transactions.
    const inventoryTransactions = await this.inventoryTransactionModel()
      .query()
      .onBuild((builder: any) => {
        builder.modify('itemsTotals');
        builder.modify('INDirection');

        // Filter the inventory items only.
        builder.whereIn('itemId', inventoryItemsIds);

        // Filter the date range of the sheet.
        builder.modify('filterDateRange', filter.fromDate, filter.toDate);
      });
    const purchasesByItemsInstance = new PurchasesByItems(
      filter,
      inventoryItems,
      inventoryTransactions,
      tenantMetadata.baseCurrency,
    );
    const purchasesByItemsData = purchasesByItemsInstance.reportData();

    // Retrieve the purchases by items meta.
    const meta = await this.purchasesByItemsMeta.meta(query);

    // Triggers `onPurchasesByItemViewed` event.
    await this.eventPublisher.emitAsync(
      events.reports.onPurchasesByItemViewed,
      {
        query,
      },
    );

    return {
      data: purchasesByItemsData,
      query: filter,
      meta,
    };
  }
}
