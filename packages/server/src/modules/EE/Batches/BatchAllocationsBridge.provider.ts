import { Injectable, OnModuleInit } from '@nestjs/common';
import { Knex } from 'knex';
import {
  BatchAllocationsBridge,
  IBatchAllocationEntry,
  IBatchAllocationsProvider,
} from '@/modules/TransactionItemEntry/integrations/BatchAllocationsBridge';
import { BatchAllocationsService } from './BatchAllocations.service';

/**
 * Registers the enterprise batch allocations provider on the core bridge.
 */
@Injectable()
export class BatchAllocationsBridgeProvider
  implements IBatchAllocationsProvider, OnModuleInit
{
  constructor(
    private readonly bridge: BatchAllocationsBridge,
    private readonly batchAllocations: BatchAllocationsService,
  ) {}

  /**
   * Registers the batch allocations provider.
   */
  public onModuleInit(): void {
    this.bridge.register(this);
  }

  /**
   * Replaces the stored batch allocations of the given transaction entries.
   */
  public syncEntriesAllocations(
    referenceType: string,
    referenceId: number,
    dtoEntries: IBatchAllocationEntry[],
    trx?: Knex.Transaction,
  ): Promise<void> {
    return this.batchAllocations.syncEntriesAllocations(
      referenceType,
      referenceId,
      dtoEntries,
      trx,
    );
  }
}
