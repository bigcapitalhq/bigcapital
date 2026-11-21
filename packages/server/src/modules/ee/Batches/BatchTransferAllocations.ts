import type { IInventoryTransactionRecord } from '@/modules/InventoryCost/types/InventoryCost.types';
import { TENANCY_DB_CONNECTION } from '@/modules/Tenancy/TenancyDB/TenancyDB.constants';
import { Inject, Injectable } from '@nestjs/common';
import type { Knex } from 'knex';
import { toBatchQuantity } from './Batches.utils';

interface TransferBatch {
  batchId: number;
  itemId: number;
  quantityOnHand: number;
}

@Injectable()
export class BatchTransferAllocations {
  constructor(
    @Inject(TENANCY_DB_CONNECTION) private readonly tenantDb: () => Knex,
  ) {}

  public async allocateTransfer(
    entries: IInventoryTransactionRecord[],
    override: boolean,
    trx?: Knex.Transaction,
  ): Promise<IInventoryTransactionRecord[]> {
    if (!entries.length) return [];
    const { warehouseId, transactionId } = entries[0];
    const db = trx ?? this.tenantDb();
    const batches: TransferBatch[] = await db(
      'batch_warehouse_balances as balance',
    )
      .join('batches as batch', 'batch.id', 'balance.batchId')
      .where('balance.warehouseId', warehouseId)
      .whereIn(
        'batch.itemId',
        entries.map((entry) => entry.itemId),
      )
      .select('batch.itemId', 'balance.batchId', 'balance.quantityOnHand')
      .orderByRaw('?? IS NULL, ??, ??', [
        'batch.expiryDate',
        'batch.expiryDate',
        'batch.id',
      ])
      .forUpdate();

    const available = new Map(
      batches.map((batch) => [batch.batchId, Number(batch.quantityOnHand)]),
    );
    if (override) {
      const previous = await db('inventory_transactions')
        .select('batchId', 'direction', 'quantity')
        .where({
          transactionType: 'WarehouseTransfer',
          transactionId,
          warehouseId,
        })
        .whereNotNull('batchId');
      for (const movement of previous) {
        const delta =
          Number(movement.quantity) * (movement.direction === 'OUT' ? 1 : -1);
        available.set(
          movement.batchId,
          toBatchQuantity((available.get(movement.batchId) ?? 0) + delta),
        );
      }
    }

    const movements: IInventoryTransactionRecord[] = [];
    for (const entry of entries) {
      let remaining = Number(entry.quantity);
      for (const batch of batches) {
        if (remaining <= 0) break;
        if (batch.itemId !== entry.itemId) continue;
        const stock = available.get(batch.batchId) ?? 0;
        const quantity = Math.min(stock, remaining);
        if (quantity <= 0) continue;
        movements.push({ ...entry, batchId: batch.batchId, quantity });
        remaining = toBatchQuantity(remaining - quantity);
        available.set(batch.batchId, toBatchQuantity(stock - quantity));
      }
      // Items can contain both batch-tracked and unallocated stock.
      if (remaining > 0) movements.push({ ...entry, quantity: remaining });
    }
    return movements;
  }
}
