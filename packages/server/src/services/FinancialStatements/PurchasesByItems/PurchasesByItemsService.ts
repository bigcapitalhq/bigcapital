import { Service, Inject } from 'typedi';
import moment from 'moment';
import {
  IInventoryValuationReportQuery,
  IInventoryValuationStatement,
  IInventoryValuationSheetMeta,
} from '@/interfaces';
import TenancyService from '@/services/Tenancy/TenancyService';
import PurchasesByItems from './PurchasesByItems';
import { Tenant } from '@/system/models';

@Service()
export default class InventoryValuationReportService {
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
      fromDate: moment().startOf('year').format('YYYY-MM-DD'),
      toDate: moment().endOf('year').format('YYYY-MM-DD'),
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
   * Retrieve balance sheet statement.
   * -------------
   * @param {number} tenantId
   * @param {IBalanceSheetQuery} query
   *
   * @return {IBalanceSheetStatement}
   */
  public async purchasesByItems(
    tenantId: number,
    query: IInventoryValuationReportQuery
  ): Promise<{
    data: IInventoryValuationStatement,
    query: IInventoryValuationReportQuery,
    meta: IInventoryValuationSheetMeta,
  }> {
    const { Item, InventoryTransaction } = this.tenancy.models(tenantId);

    const tenant = await Tenant.query()
      .findById(tenantId)
      .withGraphFetched('metadata');

    const filter = {
      ...this.defaultQuery,
      ...query,
    };
    const inventoryItems = await Item.query().onBuild(q => {
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
        builder.modify('INDirection');

        // Filter the inventory items only.
        builder.whereIn('itemId', inventoryItemsIds);

        // Filter the date range of the sheet.
        builder.modify('filterDateRange', filter.fromDate, filter.toDate)
      }
    );

    const purchasesByItemsInstance = new PurchasesByItems(
      filter,
      inventoryItems,
      inventoryTransactions,
      tenant.metadata.baseCurrency
    );
    const purchasesByItemsData = purchasesByItemsInstance.reportData();

    return {
      data: purchasesByItemsData,
      query: filter,
      meta: this.reportMetadata(tenantId),
    };
  }
}
