import { ModelObject, raw } from 'objection';
import { isEmpty } from 'lodash';
import * as moment from 'moment';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { IInventorySummaryQuery } from './InventorySummary.types';
import { Item } from '@/modules/Items/models/Item';
import { InventoryTransaction } from '@/modules/InventoryCost/models/InventoryTransaction';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

interface IInventoryPeriodTotals {
  quantityIn: number;
  quantityOut: number;
}

@Injectable({ scope: Scope.TRANSIENT })
export class InventorySummaryRepository {
  @Inject(Item.name)
  readonly itemModel: TenantModelProxy<typeof Item>;

  @Inject(InventoryTransaction.name)
  readonly inventoryTransactionModel: TenantModelProxy<
    typeof InventoryTransaction
  >;

  filter: IInventorySummaryQuery;

  items: ModelObject<Item>[];

  /**
   * Opening stock quantity keyed by item id.
   */
  openingStockByItemId: Map<number, number> = new Map();

  /**
   * Quantity in/out totals keyed by item id.
   */
  periodTotalsByItemId: Map<number, IInventoryPeriodTotals> = new Map();

  /**
   * Set the report filter.
   * @param {IInventorySummaryQuery} filter
   */
  public setFilter(filter: IInventorySummaryQuery) {
    this.filter = filter;
  }

  /**
   * Initialize the repository data.
   */
  public async asyncInit() {
    await this.initItems();
    await this.initOpeningStock();
    await this.initPeriodTotals();
  }

  /**
   * Initialize inventory items.
   */
  private async initItems() {
    this.items = await this.getInventoryItems(this.filter.itemsIds);
  }

  /**
   * Initialize opening stock quantities.
   */
  private async initOpeningStock() {
    const rows = await this.getOpeningStock(this.filter);

    this.openingStockByItemId = new Map(
      rows.map((row) => [row.itemId, this.toNumber(row.quantity)]),
    );
  }

  /**
   * Initialize quantity in/out totals for the report date range.
   */
  private async initPeriodTotals() {
    const rows = await this.getPeriodTotals(this.filter);

    this.periodTotalsByItemId = new Map(
      rows.map((row) => [
        row.itemId,
        {
          quantityIn: this.toNumber(row.quantityIn),
          quantityOut: this.toNumber(row.quantityOut),
        },
      ]),
    );
  }

  /**
   * Coerces a database aggregate value to a number.
   * @param {unknown} value
   * @returns {number}
   */
  private toNumber(value: unknown): number {
    const number = Number(value);
    return Number.isFinite(number) ? number : 0;
  }

  /**
   * Retrieve inventory items.
   * @param {number[]} itemsIds
   * @returns {Promise<ModelObject<Item>[]>}
   */
  private async getInventoryItems(
    itemsIds?: number[],
  ): Promise<ModelObject<Item>[]> {
    return this.itemModel()
      .query()
      .onBuild((query) => {
        query.where('type', 'inventory');

        if (!isEmpty(itemsIds)) {
          query.whereIn('id', itemsIds);
        }
        query.orderBy('name', 'asc');
      });
  }

  /**
   * Retrieve the opening stock quantity by item as of the day before the
   * report start date.
   * @param {IInventorySummaryQuery} filter
   * @returns {Promise<Array<{ itemId: number; quantity: number }>>}
   */
  private async getOpeningStock(
    filter: IInventorySummaryQuery,
  ): Promise<Array<{ itemId: number; quantity: number }>> {
    const openingDate = moment(filter.fromDate).subtract(1, 'days').toDate();

    const query = this.inventoryTransactionModel()
      .query()
      .select('itemId')
      .select(
        raw(
          "SUM(IF(`direction` = 'IN', COALESCE(`quantity`, 0), 0) - IF(`direction` = 'OUT', COALESCE(`quantity`, 0), 0)) AS `quantity`",
        ),
      )
      .modify('filterDateRange', null, openingDate)
      .groupBy('itemId');

    this.applyDimensionsFilter(query, filter);

    return query;
  }

  /**
   * Retrieve the quantity in/out totals by item for the report date range.
   * @param {IInventorySummaryQuery} filter
   * @returns {Promise<Array<{ itemId: number; quantityIn: number; quantityOut: number }>>}
   */
  private async getPeriodTotals(
    filter: IInventorySummaryQuery,
  ): Promise<
    Array<{ itemId: number; quantityIn: number; quantityOut: number }>
  > {
    const query = this.inventoryTransactionModel()
      .query()
      .select('itemId')
      .select(
        raw(
          "SUM(IF(`direction` = 'IN', COALESCE(`quantity`, 0), 0)) AS `quantityIn`",
        ),
      )
      .select(
        raw(
          "SUM(IF(`direction` = 'OUT', COALESCE(`quantity`, 0), 0)) AS `quantityOut`",
        ),
      )
      .modify('filterDateRange', filter.fromDate, filter.toDate)
      .groupBy('itemId');

    this.applyDimensionsFilter(query, filter);

    return query as unknown as Array<{
      itemId: number;
      quantityIn: number;
      quantityOut: number;
    }>;
  }

  /**
   * Apply branches and warehouses filters to the given query.
   * @param {any} query
   * @param {IInventorySummaryQuery} filter
   */
  private applyDimensionsFilter(query: any, filter: IInventorySummaryQuery) {
    if (!isEmpty(filter.warehousesIds)) {
      query.modify('filterByWarehouses', filter.warehousesIds);
    }
    if (!isEmpty(filter.branchesIds)) {
      query.modify('filterByBranches', filter.branchesIds);
    }
  }
}
