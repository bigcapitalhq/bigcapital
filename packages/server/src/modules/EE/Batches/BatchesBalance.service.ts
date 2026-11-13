import { Inject, Injectable } from '@nestjs/common';
import { raw } from 'objection';
import { InventoryTransaction } from '@/modules/InventoryCost/models/InventoryTransaction';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { Batch } from './models/Batch';
import { calcBatchBalance, getBatchStatus } from './Batches.utils';
import type { IBatchWithBalance } from './types/Batches.types';

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
   * Retrieves the total quantity in/out grouped by batch id.
   */
  public async getTransactionsTotals(
    batchesIds: number[],
    excludeTransaction?: IExcludeTransaction,
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

    if (excludeTransaction) {
      query.whereNot({
        transactionType: excludeTransaction.transactionType,
        transactionId: excludeTransaction.transactionId,
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
   * Attaches the balance and status to the given batches.
   */
  public async attachBalance<
    T extends {
      id: number;
      itemId: number;
      quantity: number;
      batchNumber: string;
      expiryDate?: Date | string | null;
    },
  >(batches: T[]): Promise<Array<T & IBatchWithBalance>> {
    const totals = await this.getTransactionsTotals(
      batches.map((batch) => batch.id),
    );

    return batches.map((batch) => {
      const batchTotals = totals.get(batch.id);
      const balance = calcBatchBalance(
        batch.quantity,
        batchTotals?.quantityIn ?? 0,
        batchTotals?.quantityOut ?? 0,
      );
      return {
        ...batch,
        ...balance,
        status: getBatchStatus(batch.expiryDate, balance.quantityOnHand),
      } as T & IBatchWithBalance;
    });
  }

  /**
   * Retrieves the available quantity of the given batch excluding the given
   * transaction (used when editing an invoice that already consumed the batch).
   */
  public async getAvailableQuantity(
    batch: Batch,
    excludeTransaction?: IExcludeTransaction,
  ): Promise<number> {
    const totals = await this.getTransactionsTotals(
      [batch.id],
      excludeTransaction,
    );
    const batchTotals = totals.get(batch.id);
    const balance = calcBatchBalance(
      batch.quantity,
      batchTotals?.quantityIn ?? 0,
      batchTotals?.quantityOut ?? 0,
    );
    return balance.quantityOnHand;
  }
}
