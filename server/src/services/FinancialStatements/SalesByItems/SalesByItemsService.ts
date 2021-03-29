import { Service, Inject } from 'typedi';
import moment from 'moment';
import {
  ISalesByItemsReportQuery,
  ISalesByItemsSheetStatement,
  ISalesByItemsSheetMeta
} from 'interfaces';
import TenancyService from 'services/Tenancy/TenancyService';
import SalesByItems from './SalesByItems';

@Service()
export default class SalesByItemsReportService {
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
      fromDate: moment().startOf('year').format('YYYY-MM-DD'),
      toDate: moment().endOf('year').format('YYYY-MM-DD'),
      numberFormat: {
        precision: 2,
        divideOn1000: false,
        showZero: false,
        formatMoney: 'always',
        negativeFormat: 'mines',
      },
      noneTransactions: false,
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
   * -------------
   * @param {number} tenantId
   * @param {IBalanceSheetQuery} query
   *
   * @return {IBalanceSheetStatement}
   */
  public async salesByItems(
    tenantId: number,
    query: ISalesByItemsReportQuery
  ): Promise<{
    data: ISalesByItemsSheetStatement,
    query: ISalesByItemsReportQuery,
    meta: ISalesByItemsSheetMeta,
  }> {
    const { Item, InventoryTransaction } = this.tenancy.models(tenantId);

    // Settings tenant service.
    const settings = this.tenancy.settings(tenantId);
    const baseCurrency = settings.get({
      group: 'organization',
      key: 'base_currency',
    });

    const filter = {
      ...this.defaultQuery,
      ...query,
    };
    this.logger.info('[sales_by_items] trying to calculate the report.', {
      filter,
      tenantId,
    });
    const inventoryItems = await Item.query().where('type', 'inventory');
    const inventoryItemsIds = inventoryItems.map((item) => item.id);

    // Calculates the total inventory total quantity and rate `IN` transactions.
    const inventoryTransactions = await InventoryTransaction.query().onBuild(
      (builder: any) => {
        builder.modify('itemsTotals');
        builder.modify('OUTDirection');

        // Filter the inventory items only.
        builder.whereIn('itemId', inventoryItemsIds);

        // Filter the date range of the sheet.
        builder.modify('filterDateRange', filter.fromDate, filter.toDate)
      }
    );

    const purchasesByItemsInstance = new SalesByItems(
      filter,
      inventoryItems,
      inventoryTransactions,
      baseCurrency
    );
    const purchasesByItemsData = purchasesByItemsInstance.reportData();

    return {
      data: purchasesByItemsData,
      query: filter,
      meta: this.reportMetadata(tenantId),
    };
  }
}
