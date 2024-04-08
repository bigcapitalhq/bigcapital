import { IInventoryValuationReportQuery, IInventoryValuationSheet } from '@/interfaces';
import InventoryService from '@/services/Inventory/Inventory';
import TenancyService from '@/services/Tenancy/TenancyService';
import { Tenant } from '@/system/models';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { Inject, Service } from 'typedi';
import { InventoryValuationSheet } from './InventoryValuationSheet';
import { InventoryValuationMetaInjectable } from './InventoryValuationSheetMeta';

@Service()
export class InventoryValuationSheetService {
  @Inject()
  tenancy: TenancyService;

  @Inject('logger')
  logger: any;

  @Inject()
  inventoryService: InventoryService;

  @Inject()
  private inventoryValuationMeta: InventoryValuationMetaInjectable;

  /**
   * Defaults balance sheet filter query.
   * @return {IBalanceSheetQuery}
   */
  get defaultQuery(): IInventoryValuationReportQuery {
    return {
      asDate: moment().format('YYYY-MM-DD'),
      itemsIds: [],
      numberFormat: {
        precision: 2,
        divideOn1000: false,
        showZero: false,
        formatMoney: 'always',
        negativeFormat: 'mines',
      },
      noneTransactions: true,
      noneZero: false,
      onlyActive: false,

      warehousesIds: [],
      branchesIds: [],
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
  ): Promise<IInventoryValuationSheet> {
    const { Item, InventoryCostLotTracker } = this.tenancy.models(tenantId);

    const tenant = await Tenant.query().findById(tenantId).withGraphFetched('metadata');

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

    const commonQuery = (builder) => {
      builder.whereIn('item_id', inventoryItemsIds);
      builder.sum('rate as rate');
      builder.sum('quantity as quantity');
      builder.sum('cost as cost');
      builder.select('itemId');
      builder.groupBy('itemId');

      if (!isEmpty(query.branchesIds)) {
        builder.modify('filterByBranches', query.branchesIds);
      }
      if (!isEmpty(query.warehousesIds)) {
        builder.modify('filterByWarehouses', query.warehousesIds);
      }
    };
    // Retrieve the inventory cost `IN` transactions.
    const INTransactions = await InventoryCostLotTracker.query().onBuild(commonQuery).where('direction', 'IN');

    // Retrieve the inventory cost `OUT` transactions.
    const OUTTransactions = await InventoryCostLotTracker.query().onBuild(commonQuery).where('direction', 'OUT');

    const inventoryValuationInstance = new InventoryValuationSheet(
      filter,
      inventoryItems,
      INTransactions,
      OUTTransactions,
      tenant.metadata.baseCurrency,
    );
    // Retrieve the inventory valuation report data.
    const inventoryValuationData = inventoryValuationInstance.reportData();

    // Retrieves the inventorty valuation meta.
    const meta = await this.inventoryValuationMeta.meta(tenantId, filter);

    return {
      data: inventoryValuationData,
      query: filter,
      meta,
    };
  }
}
