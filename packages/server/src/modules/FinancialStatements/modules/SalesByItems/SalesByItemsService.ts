import { SalesByItemsMeta } from './SalesByItemsMeta';
import { getSalesByItemsDefaultQuery } from './utils';
import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  ISalesByItemsReportQuery,
  ISalesByItemsSheet,
} from './SalesByItems.types';
import { Item } from '@/modules/Items/models/Item';
import { InventoryTransaction } from '@/modules/InventoryCost/models/InventoryTransaction';
import { events } from '@/common/events/events';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { SalesByItemsReport } from './SalesByItems';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class SalesByItemsReportService {
  constructor(
    private readonly salesByItemsMeta: SalesByItemsMeta,
    private readonly eventPublisher: EventEmitter2,
    private readonly tenancyContext: TenancyContext,

    @Inject(Item.name)
    private readonly itemModel: TenantModelProxy<typeof Item>,

    @Inject(InventoryTransaction.name)
    private readonly inventoryTransactionModel: TenantModelProxy<
      typeof InventoryTransaction
    >,
  ) {}

  /**
   * Retrieve balance sheet statement.
   * @param {ISalesByItemsReportQuery} query - The sales by items report query.
   * @return {Promise<ISalesByItemsSheet>}
   */
  public async salesByItems(
    query: ISalesByItemsReportQuery,
  ): Promise<ISalesByItemsSheet> {
    const filter = {
      ...getSalesByItemsDefaultQuery(),
      ...query,
    };
    const tenantMetadata = await this.tenancyContext.getTenantMetadata();

    // Inventory items for sales report.
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
        builder.modify('OUTDirection');

        // Filter the inventory items only.
        builder.whereIn('itemId', inventoryItemsIds);

        // Filter the date range of the sheet.
        builder.modify('filterDateRange', filter.fromDate, filter.toDate);
      });
    const sheet = new SalesByItemsReport(
      filter,
      inventoryItems,
      inventoryTransactions,
      tenantMetadata.baseCurrency,
    );
    const salesByItemsData = sheet.reportData();

    // Retrieve the sales by items meta.
    const meta = await this.salesByItemsMeta.meta(query);

    // Triggers `onSalesByItemViewed` event.
    await this.eventPublisher.emitAsync(events.reports.onSalesByItemViewed, {
      query,
    });

    return {
      data: salesByItemsData,
      query: filter,
      meta,
    };
  }
}
