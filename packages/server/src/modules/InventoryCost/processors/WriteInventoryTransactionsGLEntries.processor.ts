import { WriteInventoryTransactionsGLEntriesQueue } from '../types/InventoryCost.types';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Scope } from '@nestjs/common';

@Processor({
  name: WriteInventoryTransactionsGLEntriesQueue,
  scope: Scope.REQUEST,
})
export class WriteInventoryTransactionsGLEntriesProcessor extends WorkerHost {
  constructor() {
    super();
  }

  async process() {}
}
