import moment from 'moment';
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

@Injectable()
export class PurchasesByItemsService {
  constructor(
    private readonly purchasesByItemsMeta: PurchasesByItemsMeta,
    private readonly eventPublisher: EventEmitter2,
    private readonly tenancyContext: TenancyContext,

    @Inject(InventoryTransaction.name)
    private readonly inventoryTransactionModel: typeof InventoryTransaction,

    @Inject(Item.name)
    private readonly itemModel: typeof Item,
  ) {}

  /**
   * Defaults purchases by items filter query.
   * @return {IPurchasesByItemsReportQuery}
   */
  private get defaultQuery(): IPurchasesByItemsReportQuery {
    return {
      fromDate: moment().startOf('month').format('YYYY-MM-DD'),
      toDate: moment().format('YYYY-MM-DD'),
      itemsIds: [],
      numberFormat: {
        precision: 2,
        divideOn1000: false,
        showZero: false,
        formatMoney: 'always',
        negativeFormat: 'mines',
      },
      noneTransactions: true,
      onlyActive: false,
    };
  }

  /**
   * Retrieve balance sheet statement.
   * -------------
   * @param {number} tenantId
   * @param {IPurchasesByItemsReportQuery} query
   * @return {Promise<IPurchasesByItemsSheet>}
   */
  public async purchasesByItems(
    query: IPurchasesByItemsReportQuery,
  ): Promise<IPurchasesByItemsSheet> {
    const tenant = await this.tenancyContext.getTenant();
    const filter = {
      ...this.defaultQuery,
      ...query,
    };
    const inventoryItems = await this.itemModel.query().onBuild((q) => {
      q.where('type', 'inventory');

      if (filter.itemsIds.length > 0) {
        q.whereIn('id', filter.itemsIds);
      }
    });
    const inventoryItemsIds = inventoryItems.map((item) => item.id);

    // Calculates the total inventory total quantity and rate `IN` transactions.
    const inventoryTransactions = await this.inventoryTransactionModel
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
      tenant.metadata.baseCurrency,
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
