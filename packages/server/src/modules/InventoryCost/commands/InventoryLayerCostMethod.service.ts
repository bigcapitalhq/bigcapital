import { Knex } from 'knex';
import { Inject, Injectable } from '@nestjs/common';
import { InventoryTransaction } from '../models/InventoryTransaction';
import { StoreInventoryLotsCostService } from './StoreInventortyLotsCost.service';
import { TenantModelProxy } from '../../System/models/TenantBaseModel';
import {
  InventoryFifoCostMethod,
  InventoryLifoCostMethod,
  InventoryLayerCostMethod,
  InventoryCostLayer,
} from './InventoryLayerCostMethod';
import { applyCostTransactionOrder } from '../InventoryCostTransactionOrder';
import { TCostMethod } from '../types/InventoryCost.types';

@Injectable()
export class InventoryLayerCostMethodService {
  constructor(
    private readonly storeInventoryLotsCostService: StoreInventoryLotsCostService,

    @Inject(InventoryTransaction.name)
    private readonly inventoryTransactionModel: TenantModelProxy<
      typeof InventoryTransaction
    >,
  ) {}

  private getTracker(method: 'FIFO' | 'LIFO'): InventoryLayerCostMethod {
    return method === 'FIFO'
      ? new InventoryFifoCostMethod()
      : new InventoryLifoCostMethod();
  }

  private async getTransactionsBefore(
    startingDate: Date,
    itemId: number,
  ): Promise<InventoryTransaction[]> {
    return applyCostTransactionOrder(
      this.inventoryTransactionModel()
        .query()
        .where('item_id', itemId)
        .where('date', '<', startingDate),
    );
  }

  private async getTransactionsFrom(
    startingDate: Date,
    itemId: number,
  ): Promise<InventoryTransaction[]> {
    return applyCostTransactionOrder(
      this.inventoryTransactionModel()
        .query()
        .modify('filterDateRange', startingDate)
        .where('item_id', itemId)
        .withGraphFetched('item'),
    );
  }

  public async getOpeningLayers(
    startingDate: Date,
    itemId: number,
    method: 'FIFO' | 'LIFO',
  ): Promise<InventoryCostLayer[]> {
    const beforeTxs = await this.getTransactionsBefore(startingDate, itemId);
    return this.getTracker(method).buildOpeningLayers(beforeTxs);
  }

  public async computeItemCost(
    startingDate: Date,
    itemId: number,
    method: Exclude<TCostMethod, 'AVG'>,
    trx?: Knex.Transaction,
  ) {
    const tracker = this.getTracker(method);
    const openingLayers = await this.getOpeningLayers(
      startingDate,
      itemId,
      method,
    );
    const afterInvTransactions = await this.getTransactionsFrom(
      startingDate,
      itemId,
    );
    const inventoryCostLots = tracker.trackingCostTransactions(
      afterInvTransactions,
      openingLayers,
    );

    await this.storeInventoryLotsCostService.revertInventoryCostLotTransactions(
      startingDate,
      itemId,
      trx,
    );
    await this.storeInventoryLotsCostService.storeInventoryLotsCost(
      inventoryCostLots as any,
      trx,
    );
  }
}
