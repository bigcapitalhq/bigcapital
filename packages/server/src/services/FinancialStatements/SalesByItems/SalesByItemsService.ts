import { Service, Inject } from 'typedi';
import moment from 'moment';
import { ISalesByItemsReportQuery, ISalesByItemsSheet } from '@/interfaces';
import TenancyService from '@/services/Tenancy/TenancyService';
import SalesByItems from './SalesByItems';
import { Tenant } from '@/system/models';
import { SalesByItemsMeta } from './SalesByItemsMeta';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import events from '@/subscribers/events';

@Service()
export class SalesByItemsReportService {
  @Inject()
  private tenancy: TenancyService;

  @Inject()
  private salesByItemsMeta: SalesByItemsMeta;

  @Inject()
  private eventPublisher: EventPublisher;

  /**
   * Defaults balance sheet filter query.
   * @return {IBalanceSheetQuery}
   */
  private get defaultQuery(): ISalesByItemsReportQuery {
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
   * @param {number} tenantId
   * @param {IBalanceSheetQuery} query
   * @return {Promise<ISalesByItemsSheet>}
   */
  public async salesByItems(
    tenantId: number,
    query: ISalesByItemsReportQuery
  ): Promise<ISalesByItemsSheet> {
    const { Item, InventoryTransaction } = this.tenancy.models(tenantId);

    const tenant = await Tenant.query()
      .findById(tenantId)
      .withGraphFetched('metadata');

    const filter = {
      ...this.defaultQuery,
      ...query,
    };
    // Inventory items for sales report.
    const inventoryItems = await Item.query().onBuild((q) => {
      q.where('type', 'inventory');

      if (filter.itemsIds.length > 0) {
        q.whereIn('id', filter.itemsIds);
      }
    });
    const inventoryItemsIds = inventoryItems.map((item) => item.id);

    // Calculates the total inventory total quantity and rate `IN` transactions.
    const inventoryTransactions = await InventoryTransaction.query().onBuild(
      (builder: any) => {
        builder.modify('itemsTotals');
        builder.modify('OUTDirection');

        // Filter the inventory items only.
        builder.whereIn('itemId', inventoryItemsIds);

        // Filter the date range of the sheet.
        builder.modify('filterDateRange', filter.fromDate, filter.toDate);
      }
    );
    const sheet = new SalesByItems(
      filter,
      inventoryItems,
      inventoryTransactions,
      tenant.metadata.baseCurrency
    );
    const salesByItemsData = sheet.reportData();

    // Retrieve the sales by items meta.
    const meta = await this.salesByItemsMeta.meta(tenantId, query);

    // Triggers `onSalesByItemViewed` event.
    await this.eventPublisher.emitAsync(events.reports.onSalesByItemViewed, {
      tenantId,
      query,
    });

    return {
      data: salesByItemsData,
      query: filter,
      meta,
    };
  }
}
