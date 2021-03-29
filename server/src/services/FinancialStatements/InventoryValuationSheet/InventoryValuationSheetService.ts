import { Service, Inject } from 'typedi';
import moment from 'moment';
import {
  IInventoryValuationReportQuery,
  IInventoryValuationSheetMeta,
} from 'interfaces';
import TenancyService from 'services/Tenancy/TenancyService';
import InventoryValuationSheet from './InventoryValuationSheet';

@Service()
export default class InventoryValuationSheetService {
  @Inject()
  tenancy: TenancyService;

  @Inject('logger')
  logger: any;

  /**
   * Defaults balance sheet filter query.
   * @return {IBalanceSheetQuery}
   */
  get defaultQuery(): IInventoryValuationReportQuery {
    return {
      asDate: moment().endOf('year').format('YYYY-MM-DD'),
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
  reportMetadata(tenantId: number): IInventoryValuationSheetMeta {
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
   * Inventory valuation sheet.
   * @param {number} tenantId - Tenant id.
   * @param {IInventoryValuationReportQuery} query - Valuation query.
   */
  public async inventoryValuationSheet(
    tenantId: number,
    query: IInventoryValuationReportQuery,
  ) {
    const { Item, InventoryCostLotTracker } = this.tenancy.models(tenantId);

    const inventoryItems = await Item.query().where('type', 'inventory');
    const inventoryItemsIds = inventoryItems.map((item) => item.id);

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
    const commonQuery = (builder) => {
      builder.whereIn('item_id', inventoryItemsIds);
      builder.sum('rate as rate');
      builder.sum('quantity as quantity');
      builder.sum('cost as cost');
      builder.select('itemId');
      builder.groupBy('itemId');
    };
    // Retrieve the inventory cost `IN` transactions.
    const INTransactions = await InventoryCostLotTracker.query()
      .onBuild(commonQuery)
      .where('direction', 'IN');

    // Retrieve the inventory cost `OUT` transactions.
    const OUTTransactions = await InventoryCostLotTracker.query()
      .onBuild(commonQuery)
      .where('direction', 'OUT');

    const inventoryValuationInstance = new InventoryValuationSheet(
      filter,
      inventoryItems,
      INTransactions,
      OUTTransactions,
      baseCurrency,
    );
    // Retrieve the inventory valuation report data.
    const inventoryValuationData = inventoryValuationInstance.reportData();

    return {
      data: inventoryValuationData,
      query: filter,
      meta: this.reportMetadata(tenantId),
    }
  }
}