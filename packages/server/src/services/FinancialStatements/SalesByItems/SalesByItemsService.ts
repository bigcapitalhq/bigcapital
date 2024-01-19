import { Service, Inject } from 'typedi';
import moment from 'moment';
import {
  ISalesByItemsReportQuery,
  ISalesByItemsSheetMeta,
  ISalesByItemsSheet,
} from '@/interfaces';
import TenancyService from '@/services/Tenancy/TenancyService';
import SalesByItems from './SalesByItems';
import { Tenant } from '@/system/models';

@Service()
export class SalesByItemsReportService {
  @Inject()
  tenancy: TenancyService;

  @Inject('logger')
  logger: any;

  /**
   * Defaults balance sheet filter query.
   * @return {IBalanceSheetQuery}
   */
  get defaultQuery(): ISalesByItemsReportQuery {
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
   * Retrieve the balance sheet meta.
   * @param {number} tenantId -
   * @returns {IBalanceSheetMeta}
   */
  reportMetadata(tenantId: number): ISalesByItemsSheetMeta {
    const settings = this.tenancy.settings(tenantId);

    const organizationName = settings.get({
      group: 'organization',
      key: 'name',
    });
    const baseCurrency = settings.get({
      group: 'organization',
      key: 'base_currency',
    });

    return {
      organizationName,
      baseCurrency,
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

    return {
      data: salesByItemsData,
      query: filter,
      meta: this.reportMetadata(tenantId),
    };
  }
}
