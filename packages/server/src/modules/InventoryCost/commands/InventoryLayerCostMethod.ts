import { pick } from 'lodash';
import { InventoryTransaction } from '../models/InventoryTransaction';
import { TCostMethod } from '../types/InventoryCost.types';

export interface InventoryCostLayer {
  rate: number;
  remaining: number;
}

export interface InventoryCostLotOutput {
  invTransId: number;
  inventoryTransactionId: number;
  date: Date | string;
  direction: string;
  itemId: number;
  quantity: number;
  rate: number;
  cost: number;
  remaining?: number;
  entryId?: number;
  transactionId?: number;
  transactionType?: string;
  createdAt?: Date | string;
  costAccountId?: number;
  branchId?: number;
  warehouseId?: number;
}

const isLandedCostTransaction = (invTransaction: InventoryTransaction) =>
  invTransaction.direction === 'IN' &&
  (!invTransaction.quantity || Number(invTransaction.quantity) === 0) &&
  invTransaction.rate;

/**
 * Shared FIFO/LIFO layer tracker. FIFO consumes from the front; LIFO from the end.
 */
export class InventoryLayerCostMethod {
  constructor(private readonly method: Exclude<TCostMethod, 'AVG'>) {}

  private getCost(rate: number, quantity: number) {
    return quantity ? rate * quantity : rate;
  }

  private consumeFromLayers(
    layers: InventoryCostLayer[],
    quantity: number,
  ): { cost: number; quantityCosted: number } {
    let remainingToConsume = quantity;
    let cost = 0;

    while (remainingToConsume > 0 && layers.length > 0) {
      const index = this.method === 'FIFO' ? 0 : layers.length - 1;
      const layer = layers[index];
      const take = Math.min(layer.remaining, remainingToConsume);

      cost += this.getCost(layer.rate, take);
      layer.remaining -= take;
      remainingToConsume -= take;

      if (layer.remaining <= 0) {
        layers.splice(index, 1);
      }
    }

    return { cost, quantityCosted: quantity - remainingToConsume };
  }

  /**
   * Allocates a null-quantity landed-cost amount across open layers by remaining qty.
   */
  public allocateLandedCost(
    layers: InventoryCostLayer[],
    landedCost: number,
  ): InventoryCostLayer[] {
    const totalRemaining = layers.reduce((sum, l) => sum + l.remaining, 0);
    if (!totalRemaining || !landedCost) {
      return layers;
    }

    return layers.map((layer) => {
      const share = (layer.remaining / totalRemaining) * landedCost;
      const newCost = this.getCost(layer.rate, layer.remaining) + share;
      return {
        ...layer,
        rate: layer.remaining ? newCost / layer.remaining : layer.rate,
      };
    });
  }

  /**
   * Replays transactions and returns cost lot rows.
   */
  public trackingCostTransactions(
    invTransactions: InventoryTransaction[],
    openingLayers: InventoryCostLayer[] = [],
  ): InventoryCostLotOutput[] {
    const costTransactions: InventoryCostLotOutput[] = [];
    const layers: InventoryCostLayer[] = openingLayers.map((l) => ({
      ...l,
    }));

    invTransactions.forEach((invTransaction: InventoryTransaction) => {
      const commonEntry = {
        invTransId: invTransaction.id,
        inventoryTransactionId: invTransaction.id,
        ...pick(invTransaction, [
          'date',
          'direction',
          'itemId',
          'quantity',
          'rate',
          'entryId',
          'transactionId',
          'transactionType',
          'createdAt',
          'costAccountId',
          'branchId',
          'warehouseId',
        ]),
      };

      // Landed cost: null/zero quantity IN with a cost amount on rate.
      if (isLandedCostTransaction(invTransaction)) {
        const landedAmount = Number(invTransaction.rate);
        const updated = this.allocateLandedCost(layers, landedAmount);
        layers.splice(0, layers.length, ...updated);

        costTransactions.push({
          ...commonEntry,
          quantity: 0,
          rate: landedAmount,
          cost: landedAmount,
          remaining: 0,
        });
        return;
      }

      switch (invTransaction.direction) {
        case 'IN': {
          const inCost = this.getCost(
            invTransaction.rate,
            invTransaction.quantity,
          );
          layers.push({
            rate: invTransaction.rate,
            remaining: invTransaction.quantity,
          });
          costTransactions.push({
            ...commonEntry,
            cost: inCost,
            remaining: invTransaction.quantity,
          });
          break;
        }
        case 'OUT': {
          const { cost, quantityCosted } = this.consumeFromLayers(
            layers,
            invTransaction.quantity,
          );

          if (quantityCosted > 0) {
            const unitRate = cost / quantityCosted;
            costTransactions.push({
              ...commonEntry,
              quantity: quantityCosted,
              rate: unitRate,
              cost,
            });
          }

          const remainingQuantity = Math.max(
            invTransaction.quantity - quantityCosted,
            0,
          );
          if (remainingQuantity > 0) {
            costTransactions.push({
              ...commonEntry,
              quantity: remainingQuantity,
              cost: 0,
            });
          }
          break;
        }
      }
    });

    return costTransactions;
  }

  /**
   * Builds remaining opening layers by replaying transactions (no lot output needed).
   */
  public buildOpeningLayers(
    invTransactions: InventoryTransaction[],
  ): InventoryCostLayer[] {
    const layers: InventoryCostLayer[] = [];

    invTransactions.forEach((invTransaction: InventoryTransaction) => {
      if (isLandedCostTransaction(invTransaction)) {
        const updated = this.allocateLandedCost(
          layers,
          Number(invTransaction.rate),
        );
        layers.splice(0, layers.length, ...updated);
        return;
      }

      if (invTransaction.direction === 'IN') {
        layers.push({
          rate: invTransaction.rate,
          remaining: invTransaction.quantity,
        });
      } else if (invTransaction.direction === 'OUT') {
        this.consumeFromLayers(layers, invTransaction.quantity);
      }
    });

    return layers;
  }
}

export class InventoryFifoCostMethod extends InventoryLayerCostMethod {
  constructor() {
    super('FIFO');
  }
}

export class InventoryLifoCostMethod extends InventoryLayerCostMethod {
  constructor() {
    super('LIFO');
  }
}
