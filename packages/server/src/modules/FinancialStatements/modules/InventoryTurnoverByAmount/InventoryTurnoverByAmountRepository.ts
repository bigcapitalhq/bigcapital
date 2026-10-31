import { Inject, Injectable, Scope } from '@nestjs/common';
import { ModelObject } from 'objection';
import { isEmpty } from 'lodash';
import * as moment from 'moment';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { Item } from '@/modules/Items/models/Item';
import { InventoryCostLotTracker } from '@/modules/InventoryCost/models/InventoryCostLotTracker';
import { InventoryTransaction } from '@/modules/InventoryCost/models/InventoryTransaction';
import {
  IInventoryTurnoverByAmountQuery,
  IInventoryTurnoverCostLotAggregate,
  IInventoryTurnoverCostLots,
  IInventoryTurnoverLastSellDateAggregate,
  IInventoryTurnoverQuantityAggregate,
} from './InventoryTurnoverByAmount.types';

const SALE_TRANSACTION_TYPES = ['SaleInvoice', 'SaleReceipt'];
const COST_OF_GOODS_SOLD_TRANSACTION_TYPES = [
  ...SALE_TRANSACTION_TYPES,
  'CreditNote',
];

@Injectable({ scope: Scope.TRANSIENT })
export class InventoryTurnoverByAmountRepository {
  @Inject(TenancyContext)
  private readonly tenancyContext: TenancyContext;

  @Inject(Item.name)
  private readonly itemModel: TenantModelProxy<typeof Item>;

  @Inject(InventoryCostLotTracker.name)
  private readonly inventoryCostLotTracker: TenantModelProxy<
    typeof InventoryCostLotTracker
  >;

  @Inject(InventoryTransaction.name)
  private readonly inventoryTransactionModel: TenantModelProxy<
    typeof InventoryTransaction
  >;

  filter: IInventoryTurnoverByAmountQuery;

  inventoryItems: ModelObject<Item>[] = [];

  openingCostLotsByItemId = new Map<number, IInventoryTurnoverCostLots>();

  periodCostLotsByItemId = new Map<number, IInventoryTurnoverCostLots>();

  periodSalesCostLotsByItemId = new Map<number, IInventoryTurnoverCostLots>();

  closingQuantitiesByItemId = new Map<number, number>();

  lastSellDatesByItemId = new Map<number, Date | string>();

  baseCurrency: string;

  /**
   * Set the report filter.
   * @param {IInventoryTurnoverByAmountQuery} filter
   */
  setFilter(filter: IInventoryTurnoverByAmountQuery) {
    this.filter = filter;
  }

  /**
   * Initialize the report repository.
   */
  async asyncInit() {
    await this.asyncItems();
    await this.asyncBaseCurrency();

    if (isEmpty(this.inventoryItems)) {
      return;
    }

    await this.asyncOpeningCostLots();
    await this.asyncPeriodCostLots();
    await this.asyncPeriodSalesCostLots();
    await this.asyncClosingQuantities();
    await this.asyncLastSellDates();
  }

  /**
   * Retrieve the inventory items.
   */
  async asyncItems() {
    this.inventoryItems = await this.itemModel()
      .query()
      .onBuild((query) => {
        query.where('type', 'inventory');

        if (!isEmpty(this.filter.itemsIds)) {
          query.whereIn('id', this.filter.itemsIds);
        }
      });
  }

  /**
   * Retrieve the base currency.
   */
  async asyncBaseCurrency() {
    const tenantMetadata = await this.tenancyContext.getTenantMetadata();
    this.baseCurrency = tenantMetadata.baseCurrency;
  }

  /**
   * Retrieve the inventory cost lots before the report start date.
   */
  async asyncOpeningCostLots() {
    const openingDate = moment(this.filter.fromDate)
      .startOf('day')
      .format('YYYY-MM-DD');

    const costLots = await this.getCostLots((builder) => {
      builder.where('date', '<', openingDate);
    });
    this.openingCostLotsByItemId = this.buildCostLotsMap(costLots);
  }

  /**
   * Retrieve the inventory cost lots inside the report date range.
   */
  async asyncPeriodCostLots() {
    const costLots = await this.getCostLots((builder) => {
      builder.modify(
        'filterDateRange',
        this.filter.fromDate,
        this.filter.toDate,
      );
    });
    this.periodCostLotsByItemId = this.buildCostLotsMap(costLots);
  }

  /**
   * Retrieve the sales and sales-return cost lots inside the report date range.
   */
  async asyncPeriodSalesCostLots() {
    const costLots = await this.getCostLots((builder) => {
      builder.modify(
        'filterDateRange',
        this.filter.fromDate,
        this.filter.toDate,
      );
      builder.whereIn('transactionType', COST_OF_GOODS_SOLD_TRANSACTION_TYPES);
    });
    this.periodSalesCostLotsByItemId = this.buildCostLotsMap(costLots);
  }

  /**
   * Retrieve the inventory quantities through the report end date.
   */
  async asyncClosingQuantities() {
    const toDate = moment(this.filter.toDate).endOf('day').format('YYYY-MM-DD');

    const quantities = (await this.inventoryTransactionModel()
      .query()
      .onBuild((builder: any) => {
        builder.whereIn('itemId', this.getItemIds());
        builder.where('date', '<=', toDate);
        builder.select('itemId', 'direction');
        builder.sum('quantity as quantity');
        builder.groupBy('itemId');
        builder.groupBy('direction');
        this.applyDimensionsFilters(builder);
      })) as unknown as IInventoryTurnoverQuantityAggregate[];

    const quantitiesMap = new Map<number, number>();

    quantities.forEach((transaction) => {
      const itemId = Number(transaction.itemId);
      const quantity = Number(transaction.quantity) || 0;
      const current = quantitiesMap.get(itemId) || 0;
      const movement = transaction.direction === 'OUT' ? -quantity : quantity;

      quantitiesMap.set(itemId, current + movement);
    });

    this.closingQuantitiesByItemId = quantitiesMap;
  }

  /**
   * Retrieve the latest sale date per item through the report end date.
   */
  async asyncLastSellDates() {
    const toDate = moment(this.filter.toDate).endOf('day').format('YYYY-MM-DD');

    const lastSellDates = (await this.inventoryTransactionModel()
      .query()
      .onBuild((builder: any) => {
        builder.whereIn('itemId', this.getItemIds());
        builder.where('direction', 'OUT');
        builder.whereIn('transactionType', SALE_TRANSACTION_TYPES);
        builder.where('date', '<=', toDate);
        builder.select('itemId');
        builder.max('date as lastSellDate');
        builder.groupBy('itemId');
        this.applyDimensionsFilters(builder);
      })) as unknown as IInventoryTurnoverLastSellDateAggregate[];

    this.lastSellDatesByItemId = new Map(
      lastSellDates.map((transaction) => [
        Number(transaction.itemId),
        transaction.lastSellDate,
      ]),
    );
  }

  /**
   * Retrieve the aggregated cost lots of the report.
   */
  private async getCostLots(
    dateFilter: (builder: any) => void,
  ): Promise<IInventoryTurnoverCostLotAggregate[]> {
    return (await this.inventoryCostLotTracker()
      .query()
      .onBuild((builder: any) => {
        builder.whereIn('itemId', this.getItemIds());
        builder.select('itemId', 'direction');
        builder.sum('cost as cost');
        builder.groupBy('itemId');
        builder.groupBy('direction');
        this.applyDimensionsFilters(builder);
        dateFilter(builder);
      })) as unknown as IInventoryTurnoverCostLotAggregate[];
  }

  /**
   * Apply the report dimensions filters on the given query builder.
   */
  private applyDimensionsFilters(builder: any) {
    if (!isEmpty(this.filter.branchesIds)) {
      builder.modify('filterByBranches', this.filter.branchesIds);
    }
    if (!isEmpty(this.filter.warehousesIds)) {
      builder.modify('filterByWarehouses', this.filter.warehousesIds);
    }
  }

  /**
   * Retrieve the inventory items ids.
   */
  private getItemIds(): number[] {
    return this.inventoryItems.map((item) => item.id);
  }

  /**
   * Build a cost lots map keyed by item id.
   */
  private buildCostLotsMap(
    costLots: IInventoryTurnoverCostLotAggregate[],
  ): Map<number, IInventoryTurnoverCostLots> {
    const costLotsMap = new Map<number, IInventoryTurnoverCostLots>();

    costLots.forEach((costLot) => {
      const itemId = Number(costLot.itemId);
      const cost = Number(costLot.cost) || 0;
      const itemCostLots = costLotsMap.get(itemId) || {
        costIn: 0,
        costOut: 0,
      };

      if (costLot.direction === 'IN') {
        itemCostLots.costIn += cost;
      } else {
        itemCostLots.costOut += cost;
      }
      costLotsMap.set(itemId, itemCostLots);
    });

    return costLotsMap;
  }
}
