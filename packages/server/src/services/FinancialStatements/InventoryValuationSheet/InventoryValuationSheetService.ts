import { Service, Inject } from 'typedi';
import moment from 'moment';
import { isEmpty } from 'lodash';
import {
  IInventoryValuationReportQuery,
  IInventoryValuationSheet,
  IInventoryValuationSheetMeta,
} from '@/interfaces';
import TenancyService from '@/services/Tenancy/TenancyService';
import { InventoryValuationSheet } from './InventoryValuationSheet';
import InventoryService from '@/services/Inventory/Inventory';
import { Tenant } from '@/system/models';

@Service()
export class InventoryValuationSheetService {
  @Inject()
  tenancy: TenancyService;

  @Inject('logger')
  logger: any;

  @Inject()
  inventoryService: InventoryService;

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
   * Retrieve the balance sheet meta.
   * @param {number} tenantId -
   * @returns {IBalanceSheetMeta}
   */
  reportMetadata(tenantId: number): IInventoryValuationSheetMeta {
    const settings = this.tenancy.settings(tenantId);

    const isCostComputeRunning =
      this.inventoryService.isItemsCostComputeRunning(tenantId);

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
      isCostComputeRunning,
    };
  }

  /**
   * Inventory valuation sheet.
   * @param {number} tenantId - Tenant id.
   * @param {IInventoryValuationReportQuery} query - Valuation query.
   */
  public async inventoryValuationSheet(
    tenantId: number,
    query: IInventoryValuationReportQuery
  ): Promise<IInventoryValuationSheet> {
    const { Item, InventoryCostLotTracker } = this.tenancy.models(tenantId);

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
      tenant.metadata.baseCurrency
    );
    // Retrieve the inventory valuation report data.
    const inventoryValuationData = inventoryValuationInstance.reportData();

    return {
      data: inventoryValuationData,
      query: filter,
      meta: this.reportMetadata(tenantId),
    };
  }
}
