import { InventoryTransaction } from '../models/InventoryTransaction';
import { transformInventoryTransactionToCostLot } from '../utils';

/**
 * Quantity tolerance used when comparing decimal quantities.
 */
const QUANTITY_EPSILON = 1e-9;

/**
 * Inventory cost lot.
 */
export interface IInventoryCostLot {
  quantity: number;
  rate: number;
  invTransactionId: number;
  date: Date | string;
  createdAt?: Date | string;
}

/**
 * The result of processing a set of inventory transactions.
 */
export interface IInventoryLotCostMethodResult {
  costTransactions: any[];
  remainingLots: IInventoryCostLot[];
}

/**
 * The abstract inventory lot cost method (FIFO / LIFO).
 */
export abstract class InventoryLotCostMethod {
  /**
   * Determines whether the newest lots should be consumed first.
   */
  protected abstract get isLifo(): boolean;

  /**
   * Normalizes the given value to a number.
   * @param {unknown} value - The given value.
   * @returns {number}
   */
  private toNumber(value: unknown): number {
    const parsedValue = Number(value);

    return Number.isFinite(parsedValue) ? parsedValue : 0;
  }

  /**
   * Rounds the given cost to the storage precision.
   * @param {number} value - The given value.
   * @returns {number}
   */
  private roundCost(value: number): number {
    return Math.round((value + Number.EPSILON) * 1000) / 1000;
  }

  /**
   * Consumes the given quantity from the lots.
   * @param {IInventoryCostLot[]} lots - The available lots.
   * @param {number} headIndex - The first available lot index.
   * @param {number} quantity - The requested quantity.
   * @returns {{ cost: number, consumed: number, headIndex: number }}
   */
  private consumeLots(
    lots: IInventoryCostLot[],
    headIndex: number,
    quantity: number,
  ): { cost: number; consumed: number; headIndex: number } {
    let remainingQuantity = quantity;
    let consumedQuantity = 0;
    let cost = 0;
    let nextHeadIndex = headIndex;

    while (
      remainingQuantity > QUANTITY_EPSILON &&
      nextHeadIndex < lots.length
    ) {
      const lotIndex = this.isLifo ? lots.length - 1 : nextHeadIndex;
      const lot = lots[lotIndex];

      if (!lot) {
        break;
      }
      const consumedFromLot = Math.min(lot.quantity, remainingQuantity);

      if (consumedFromLot > QUANTITY_EPSILON) {
        cost += consumedFromLot * lot.rate;
        lot.quantity -= consumedFromLot;
        remainingQuantity -= consumedFromLot;
        consumedQuantity += consumedFromLot;
      }
      if (lot.quantity <= QUANTITY_EPSILON) {
        if (this.isLifo) {
          lots.pop();
        } else {
          nextHeadIndex += 1;
        }
      }
    }
    return {
      cost: this.roundCost(cost),
      consumed: this.roundCost(consumedQuantity),
      headIndex: nextHeadIndex,
    };
  }

  /**
   * Processes the inventory transactions and produces cost transactions and
   * the remaining lots.
   * @param {InventoryTransaction[]} invTransactions - Inventory transactions.
   * @param {IInventoryCostLot[]} openingLots - Opening lots.
   * @param {boolean} emitCostTransactions - Whether to emit cost transactions.
   * @returns {IInventoryLotCostMethodResult}
   */
  private process(
    invTransactions: InventoryTransaction[],
    openingLots: IInventoryCostLot[] = [],
    emitCostTransactions: boolean = true,
  ): IInventoryLotCostMethodResult {
    const lots: IInventoryCostLot[] = openingLots.map((lot) => ({ ...lot }));
    const costTransactions: any[] = [];

    let headIndex = 0;

    invTransactions.forEach((invTransaction: InventoryTransaction) => {
      const commonEntry =
        transformInventoryTransactionToCostLot(invTransaction);
      const quantity = this.toNumber(invTransaction.quantity);
      const rate = this.toNumber(invTransaction.rate);

      if (invTransaction.direction === 'IN') {
        lots.push({
          quantity,
          rate,
          invTransactionId: invTransaction.id,
          date: invTransaction.date,
          createdAt: invTransaction.createdAt,
        });

        if (emitCostTransactions) {
          costTransactions.push({
            ...commonEntry,
            cost: this.roundCost(quantity * rate),
          });
        }
        return;
      }
      const {
        cost,
        consumed,
        headIndex: nextHeadIndex,
      } = this.consumeLots(lots, headIndex, quantity);
      // The head index can only move forward for FIFO.
      if (!this.isLifo) {
        headIndex = nextHeadIndex;
      }
      if (emitCostTransactions) {
        if (consumed > QUANTITY_EPSILON) {
          costTransactions.push({
            ...commonEntry,
            quantity: consumed,
            cost,
          });
        }
        const shortageQuantity = this.roundCost(quantity - consumed);

        if (shortageQuantity > QUANTITY_EPSILON) {
          costTransactions.push({
            ...commonEntry,
            quantity: shortageQuantity,
            cost: 0,
          });
        }
      }
    });

    return {
      costTransactions,
      remainingLots: this.isLifo ? lots : lots.slice(headIndex),
    };
  }

  /**
   * Computes the cost transactions from the given inventory transactions.
   * @param {InventoryTransaction[]} invTransactions - Inventory transactions.
   * @param {IInventoryCostLot[]} openingLots - Opening lots.
   * @returns {any[]}
   */
  public trackingCostTransactions(
    invTransactions: InventoryTransaction[],
    openingLots: IInventoryCostLot[] = [],
  ): any[] {
    return this.process(invTransactions, openingLots).costTransactions;
  }

  /**
   * Retrieves the remaining lots after processing the given transactions.
   * @param {InventoryTransaction[]} invTransactions - Inventory transactions.
   * @param {IInventoryCostLot[]} openingLots - Opening lots.
   * @returns {IInventoryCostLot[]}
   */
  public getRemainingLots(
    invTransactions: InventoryTransaction[],
    openingLots: IInventoryCostLot[] = [],
  ): IInventoryCostLot[] {
    return this.process(invTransactions, openingLots, false).remainingLots;
  }
}

/**
 * First-in, first-out cost method.
 */
export class InventoryFIFOCostMethod extends InventoryLotCostMethod {
  protected get isLifo(): boolean {
    return false;
  }
}

/**
 * Last-in, first-out cost method.
 */
export class InventoryLIFOCostMethod extends InventoryLotCostMethod {
  protected get isLifo(): boolean {
    return true;
  }
}
