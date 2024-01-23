import moment from 'moment';
import { Service, Inject } from 'typedi';
import TenancyService from '@/services/Tenancy/TenancyService';
import { PurchasesByItems } from './PurchasesByItems';
import { Tenant } from '@/system/models';
import {
  IPurchasesByItemsReportQuery,
  IPurchasesByItemsSheet,
  IPurchasesByItemsSheetMeta,
} from '@/interfaces/PurchasesByItemsSheet';

@Service()
export class PurchasesByItemsService {
  @Inject()
  private tenancy: TenancyService;

  /**
   * Defaults purchases by items filter query.
   * @return {IPurchasesByItemsReportQuery}
   */
  get defaultQuery(): IPurchasesByItemsReportQuery {
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
  reportMetadata(tenantId: number): IPurchasesByItemsSheetMeta {
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
   * @param {IPurchasesByItemsReportQuery} query
   * @return {Promise<IPurchasesByItemsSheet>}
   */
  public async purchasesByItems(
    tenantId: number,
    query: IPurchasesByItemsReportQuery
  ): Promise<IPurchasesByItemsSheet> {
    const { Item, InventoryTransaction } = this.tenancy.models(tenantId);

    const tenant = await Tenant.query()
      .findById(tenantId)
      .withGraphFetched('metadata');

    const filter = {
      ...this.defaultQuery,
      ...query,
    };
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
        builder.modify('INDirection');

        // Filter the inventory items only.
        builder.whereIn('itemId', inventoryItemsIds);

        // Filter the date range of the sheet.
        builder.modify('filterDateRange', filter.fromDate, filter.toDate);
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
