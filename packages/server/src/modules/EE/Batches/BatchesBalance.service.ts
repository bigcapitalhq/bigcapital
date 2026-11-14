import { Inject, Injectable } from '@nestjs/common';
import { raw } from 'objection';
import { InventoryTransaction } from '@/modules/InventoryCost/models/InventoryTransaction';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { Batch } from './models/Batch';
import {
  calcBatchBalance,
  getBatchStatus,
  toBatchQuantity,
} from './Batches.utils';
import type { IBatchBalance, IBatchWithBalance } from './types/Batches.types';

interface IBatchTransactionsTotals {
  quantityIn: number;
  quantityOut: number;
}

interface IExcludeTransaction {
  transactionType: string;
  transactionId: number;
}

@Injectable()
export class BatchesBalanceService {
  /**
   * @param {TenantModelProxy<typeof InventoryTransaction>} inventoryTransactionModel
   */
  constructor(
    @Inject(InventoryTransaction.name)
    private readonly inventoryTransactionModel: TenantModelProxy<
      typeof InventoryTransaction
    >,
  ) {}

  /**
   * Sums the quantity in/out of the given batches from the inventory
   * transactions. This is only used by the batch details report.
   */
  public async getTransactionsTotals(
    batchesIds: number[],
  ): Promise<Map<number, IBatchTransactionsTotals>> {
    return this.sumTransactionsTotals(batchesIds);
  }

  /**
   * Sums the quantity in/out of the given batches for a specific transaction.
   * Used to exclude the current transaction when validating an edit.
   */
  private async getTransactionTotalsForReference(
    transactionType: string,
    transactionId: number,
    batchesIds: number[],
  ): Promise<Map<number, IBatchTransactionsTotals>> {
    return this.sumTransactionsTotals(batchesIds, {
      transactionType,
      transactionId,
    });
  }

  /**
   * Aggregates the inventory transactions quantity in/out by batch id.
   */
  private async sumTransactionsTotals(
    batchesIds: number[],
    filter?: { transactionType: string; transactionId: number },
  ): Promise<Map<number, IBatchTransactionsTotals>> {
    if (batchesIds.length === 0) {
      return new Map();
    }
    const query = this.inventoryTransactionModel()
      .query()
      .select('batchId')
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
      .whereIn('batchId', batchesIds)
      .groupBy('batchId');

    if (filter) {
      query.where({
        transactionType: filter.transactionType,
        transactionId: filter.transactionId,
      });
    }
    const totals = await query;

    return totals.reduce((map, total: any) => {
      map.set(Number(total.batchId), {
        quantityIn: Number(total.quantityIn) || 0,
        quantityOut: Number(total.quantityOut) || 0,
      });
      return map;
    }, new Map<number, IBatchTransactionsTotals>());
  }

  /**
   * Attaches the stored quantity on hand and status to the given batches.
   */
  public async attachBalance<
    T extends {
      id: number;
      quantityOnHand: number;
      expiryDate?: Date | string | null;
    },
  >(batches: T[]): Promise<Array<T & IBatchWithBalance>> {
    return batches.map((batch) => {
      const quantityOnHand = toBatchQuantity(batch.quantityOnHand);

      return {
        ...batch,
        quantityOnHand,
        status: getBatchStatus(batch.expiryDate, quantityOnHand),
      } as T & IBatchWithBalance;
    });
  }

  /**
   * Attaches the transaction quantity in/out to the given batches. Only used
   * by the batch details report.
   */
  public async attachTransactionTotals<T extends IBatchWithBalance>(
    batches: T[],
  ): Promise<Array<T & IBatchBalance>> {
    const totals = await this.getTransactionsTotals(
      batches.map((batch) => batch.id),
    );

    return batches.map((batch) => {
      const batchTotals = totals.get(batch.id);
      const openingQuantity =
        batch.sourceTransactionType == null
          ? toBatchQuantity(batch.quantity)
          : 0;
      const balance = calcBatchBalance(
        openingQuantity,
        batchTotals?.quantityIn ?? 0,
        batchTotals?.quantityOut ?? 0,
      );

      return {
        ...batch,
        quantityIn: balance.quantityIn,
        quantityOut: balance.quantityOut,
      } as T & IBatchBalance;
    });
  }

  /**
   * Retrieves the available quantity on hand of each given batch, excluding
   * the given transaction when editing an invoice that already consumed the
   * batch.
   */
  public async getAvailableQuantities(
    batches: Batch[],
    excludeTransaction?: IExcludeTransaction,
  ): Promise<Map<number, number>> {
    const quantities = new Map<number, number>(
      batches.map((batch) => [batch.id, toBatchQuantity(batch.quantityOnHand)]),
    );

    if (!excludeTransaction || batches.length === 0) {
      return quantities;
    }
    const totals = await this.getTransactionTotalsForReference(
      excludeTransaction.transactionType,
      excludeTransaction.transactionId,
      batches.map((batch) => batch.id),
    );

    totals.forEach((total, batchId) => {
      const current = quantities.get(batchId) ?? 0;
      quantities.set(
        batchId,
        toBatchQuantity(current + total.quantityOut - total.quantityIn),
      );
    });
    return quantities;
  }
}
