import { isEmpty } from 'lodash';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { IInventoryValuationReportQuery } from './InventoryValuationSheet.types';
import { InventoryCostLotTracker } from '@/modules/InventoryCost/models/InventoryCostLotTracker';
import { ModelObject } from 'objection';
import { Item } from '@/modules/Items/models/Item';
import { transformToMap } from '@/utils/transform-to-key';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable({ scope: Scope.TRANSIENT })
export class InventoryValuationSheetRepository {
  @Inject(TenancyContext)
  private readonly tenancyContext: TenancyContext;

  @Inject(InventoryCostLotTracker.name)
  private readonly inventoryCostLotTracker: TenantModelProxy<
    typeof InventoryCostLotTracker
  >;

  @Inject(Item.name)
  private readonly itemModel: TenantModelProxy<typeof Item>;

  /**
   * The filter.
   * @param {IInventoryValuationReportQuery} value
   */
  filter: IInventoryValuationReportQuery;

  /**
   * The inventory items.
   * @param {ModelObject<Item>[]} value
   */
  inventoryItems: ModelObject<Item>[];

  /**
   * The inventory cost `IN` transactions.
   * @param {ModelObject<InventoryCostLotTracker>[]} value
   */
  INTransactions: ModelObject<InventoryCostLotTracker>[];

  /**
   * The inventory cost `IN` transactions map.
   * @param {Map<number, InventoryCostLotTracker[]>} value
   */
  INInventoryCostLots: Map<number, InventoryCostLotTracker[]>;

  /**
   * The inventory cost `OUT` transactions.
   * @param {ModelObject<InventoryCostLotTracker>[]} value
   */
  OUTTransactions: ModelObject<InventoryCostLotTracker>[];

  /**
   * The inventory cost `OUT` transactions map.
   * @param {Map<number, InventoryCostLotTracker[]>} value
   */
  OUTInventoryCostLots: Map<number, InventoryCostLotTracker[]>;

  /**
   * The base currency.
   * @param {string} value
   */
  baseCurrency: string;

  /**
   * Set the filter.
   * @param {IInventoryValuationReportQuery} filter
   */
  setFilter(filter: IInventoryValuationReportQuery) {
    this.filter = filter;
  }

  /**
   * Initialize the repository.
   */
  async asyncInit() {
    await this.asyncItems();
    await this.asyncCostLotsTransactions();
    await this.asyncBaseCurrency();
  }

  /**
   * Retrieve the base currency.
   */
  async asyncBaseCurrency() {
    const tenantMetadata = await this.tenancyContext.getTenantMetadata();
    this.baseCurrency = tenantMetadata.baseCurrency;
  }

  /**
   * Retrieve the inventory items.
   */
  async asyncItems() {
    const inventoryItems = await this.itemModel()
      .query()
      .onBuild((q) => {
        q.where('type', 'inventory');

      if (this.filter.itemsIds.length > 0) {
        q.whereIn('id', this.filter.itemsIds);
      }
    });
    this.inventoryItems = inventoryItems;
  }

  /**
   * Retrieve the inventory cost `IN` and `OUT` transactions.
   */
  async asyncCostLotsTransactions() {
    const inventoryItemsIds = this.inventoryItems.map((item) => item.id);

    const commonQuery = (builder) => {
      builder.whereIn('item_id', inventoryItemsIds);
      builder.sum('rate as rate');
      builder.sum('quantity as quantity');
      builder.sum('cost as cost');
      builder.select('itemId');
      builder.groupBy('itemId');

      if (!isEmpty(this.filter.branchesIds)) {
        builder.modify('filterByBranches', this.filter.branchesIds);
      }
      if (!isEmpty(this.filter.warehousesIds)) {
        builder.modify('filterByWarehouses', this.filter.warehousesIds);
      }
    };
    // Retrieve the inventory cost `IN` transactions.
    const INTransactions = await this.inventoryCostLotTracker()
      .query()
      .onBuild(commonQuery)
      .where('direction', 'IN');

    // Retrieve the inventory cost `OUT` transactions.
    const OUTTransactions = await this.inventoryCostLotTracker()
      .query()
      .onBuild(commonQuery)
      .where('direction', 'OUT');

    this.INTransactions = INTransactions;
    this.OUTTransactions = OUTTransactions;

    this.INInventoryCostLots = transformToMap(INTransactions, 'itemId');
    this.OUTInventoryCostLots = transformToMap(OUTTransactions, 'itemId');
  }
}
