import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';

/**
 * Batch allocation DTO entry.
 */
export interface IBatchAllocationEntry {
  id?: number;
  index?: number;
  quantity?: number;
  batches?: Array<{
    batchId?: number;
    quantity?: number;
  }>;
}

/**
 * Item entry batch allocations provider contract that is implemented by the
 * enterprise edition.
 */
export interface IBatchAllocationsProvider {
  /**
   * Replaces the stored batch allocations of the given transaction entries
   * with the allocations of the given DTO entries.
   * @param {string} referenceType - Transaction reference type.
   * @param {number} referenceId - Transaction reference id.
   * @param {IBatchAllocationEntry[]} dtoEntries - Transaction entries.
   * @param {Knex.Transaction} trx - Knex transaction.
   */
  syncEntriesAllocations(
    referenceType: string,
    referenceId: number,
    dtoEntries: IBatchAllocationEntry[],
    trx?: Knex.Transaction,
  ): Promise<void>;
}

/**
 * Bridge between the open-source transaction modules and the item entry batch
 * allocations provider. The default implementation is a no-op until the
 * enterprise edition registers its provider.
 */
@Injectable()
export class BatchAllocationsBridge {
  private provider: IBatchAllocationsProvider | null = null;

  /**
   * Registers the batch allocations provider.
   * @param {IBatchAllocationsProvider} provider - Batch allocations provider.
   */
  public register(provider: IBatchAllocationsProvider): void {
    this.provider = provider;
  }

  /**
   * Replaces the stored batch allocations of the given transaction entries.
   */
  public async syncEntriesAllocations(
    referenceType: string,
    referenceId: number,
    dtoEntries: IBatchAllocationEntry[],
    trx?: Knex.Transaction,
  ): Promise<void> {
    await this.provider?.syncEntriesAllocations(
      referenceType,
      referenceId,
      dtoEntries,
      trx,
    );
  }
}
