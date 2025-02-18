import { ModelObject, raw } from 'objection';
import { isEmpty } from 'lodash';
import * as moment from 'moment';
import { IInventoryDetailsQuery } from './InventoryItemDetails.types';
import { Item } from '@/modules/Items/models/Item';
import { InventoryTransaction } from '@/modules/InventoryCost/models/InventoryTransaction';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { transformToMapKeyValue } from '@/utils/transform-to-map-key-value';
import { transformToMapBy } from '@/utils/transform-to-map-by';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable({ scope: Scope.TRANSIENT })
export class InventoryItemDetailsRepository {
  @Inject(Item.name)
  readonly itemModel: TenantModelProxy<typeof Item>;

  @Inject(InventoryTransaction.name)
  readonly inventoryTransactionModel: TenantModelProxy<
    typeof InventoryTransaction
  >;

  @Inject(TenancyContext)
  readonly tenancyContext: TenancyContext;

  /**
   * The items.
   * @param {ModelObject<Item>[]} items - The items.
   */
  items: ModelObject<Item>[];

  /**
   * The opening balance transactions.
   * @param {ModelObject<InventoryTransaction>[]} openingBalanceTransactions - The opening balance transactions.
   */
  openingBalanceTransactions: ModelObject<InventoryTransaction>[];

  /**
   * The opening balance transactions by item id.
   * @param {Map<number, ModelObject<InventoryTransaction>>} openingBalanceTransactionsByItemId - The opening balance transactions by item id.
   */
  openingBalanceTransactionsByItemId: Map<
    number,
    ModelObject<InventoryTransaction>
  >;

  /**
   * The inventory transactions.
   * @param {ModelObject<InventoryTransaction>[]} inventoryTransactions - The inventory transactions.
   */
  inventoryTransactions: ModelObject<InventoryTransaction>[];

  /**
   * The inventory transactions by item id.
   * @param {Map<string, ModelObject<InventoryTransaction>>} inventoryTransactionsByItemId - The inventory transactions by item id.
   */
  inventoryTransactionsByItemId: Map<
    string,
    ModelObject<InventoryTransaction>[]
  >;

  /**
   * The filter.
   * @param {IInventoryDetailsQuery} filter - The filter.
   */
  filter: IInventoryDetailsQuery;

  /**
   * The base currency.
   * @param {string} baseCurrency - The base currency.
   */
  baseCurrency: string;

  /**
   * Set the filter.
   * @param {IInventoryDetailsQuery} filter - The filter.
   */
  setFilter(filter: IInventoryDetailsQuery) {
    this.filter = filter;
  }

  /**
   * Initialize the repository.
   */
  async asyncInit() {
    await this.initItems();
    await this.initOpeningBalanceTransactions();
    await this.initInventoryTransactions();
    await this.initBaseCurrency();
  }

  /**
   * Initialize the items.
   */
  async initItems() {
    // Retrieves the items.
    const items = await this.getInventoryItems(this.filter.itemsIds);
    this.items = items;
  }

  /**
   * Initialize the opening balance transactions.
   */
  async initOpeningBalanceTransactions() {
    // Retrieves the opening balance transactions.
    const openingBalanceTransactions = await this.getOpeningBalanceTransactions(
      this.filter,
    );
    this.openingBalanceTransactions = openingBalanceTransactions;
    this.openingBalanceTransactionsByItemId = transformToMapKeyValue(
      openingBalanceTransactions,
      'itemId',
    );
  }

  /**
   * Initialize the inventory transactions.
   */
  async initInventoryTransactions() {
    // Retrieves the inventory transactions.
    const inventoryTransactions = await this.getItemInventoryTransactions(
      this.filter,
    );
    this.inventoryTransactions = inventoryTransactions;
    this.inventoryTransactionsByItemId = transformToMapBy(
      inventoryTransactions,
      'itemId',
    );
  }

  /**
   * Initialize the base currency.
   */
  async initBaseCurrency() {
    const tenantMetadata = await this.tenancyContext.getTenantMetadata();

    this.baseCurrency = tenantMetadata.baseCurrency;
  }

  /**
   * Retrieve inventory items.
   * @returns {Promise<ModelObject<Item>>}
   */
  public async getInventoryItems(
    itemsIds?: number[],
  ): Promise<ModelObject<Item>[]> {
    return this.itemModel().query().onBuild((q) => {
      q.where('type', 'inventory');

      if (!isEmpty(itemsIds)) {
        q.whereIn('id', itemsIds);
      }
    });
  }

  /**
   * Retrieve the items opening balance transactions.
   * @param {IInventoryDetailsQuery}
   * @return {Promise<ModelObject<InventoryTransaction>>}
   */
  public async getOpeningBalanceTransactions(
    filter: IInventoryDetailsQuery,
  ): Promise<ModelObject<InventoryTransaction>[]> {
    const openingBalanceDate = moment(filter.fromDate)
      .subtract(1, 'days')
      .toDate();

    // Opening inventory transactions.
    const openingTransactions = this.inventoryTransactionModel()
      .query()
      .select('*')
      .select(raw("IF(`DIRECTION` = 'IN', `QUANTITY`, 0) as 'QUANTITY_IN'"))
      .select(raw("IF(`DIRECTION` = 'OUT', `QUANTITY`, 0) as 'QUANTITY_OUT'"))
      .select(
        raw(
          "IF(`DIRECTION` = 'IN', IF(`QUANTITY` IS NULL, `RATE`, `QUANTITY` * `RATE`), 0) as 'VALUE_IN'",
        ),
      )
      .select(
        raw(
          "IF(`DIRECTION` = 'OUT', IF(`QUANTITY` IS NULL, `RATE`, `QUANTITY` * `RATE`), 0) as 'VALUE_OUT'",
        ),
      )
      .modify('filterDateRange', null, openingBalanceDate)
      .orderBy('date', 'ASC')
      .as('inventory_transactions');

    if (!isEmpty(filter.warehousesIds)) {
      openingTransactions.modify('filterByWarehouses', filter.warehousesIds);
    }
    if (!isEmpty(filter.branchesIds)) {
      openingTransactions.modify('filterByBranches', filter.branchesIds);
    }
    const openingBalanceTransactions = await this.inventoryTransactionModel()
      .query()
      .from(openingTransactions)
      .select('itemId')
      .select(raw('SUM(`QUANTITY_IN` - `QUANTITY_OUT`) AS `QUANTITY`'))
      .select(raw('SUM(`VALUE_IN` - `VALUE_OUT`) AS `VALUE`'))
      .groupBy('itemId')
      .sum('rate as rate')
      .sum('quantityIn as quantityIn')
      .sum('quantityOut as quantityOut')
      .sum('valueIn as valueIn')
      .sum('valueOut as valueOut')
      .withGraphFetched('itemCostAggregated');

    return openingBalanceTransactions;
  }

  /**
   * Retrieve the items inventory tranasactions.
   * @param {IInventoryDetailsQuery}
   * @return {Promise<IInventoryTransaction>}
   */
  public async getItemInventoryTransactions(
    filter: IInventoryDetailsQuery,
  ): Promise<ModelObject<InventoryTransaction>[]> {
    const inventoryTransactions = this.inventoryTransactionModel()
      .query()
      .modify('filterDateRange', filter.fromDate, filter.toDate)
      .orderBy('date', 'ASC')
      .withGraphFetched('meta')
      .withGraphFetched('costLotAggregated');

    if (!isEmpty(filter.branchesIds)) {
      inventoryTransactions.modify('filterByBranches', filter.branchesIds);
    }
    if (!isEmpty(filter.warehousesIds)) {
      inventoryTransactions.modify('filterByWarehouses', filter.warehousesIds);
    }
    return inventoryTransactions;
  }
}
