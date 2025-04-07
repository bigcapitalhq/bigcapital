import { Process } from '@nestjs/bull';
import {
  WriteInventoryTransactionsGLEntriesQueue,
  WriteInventoryTransactionsGLEntriesQueueJob,
} from '../types/InventoryCost.types';
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

  @Process(WriteInventoryTransactionsGLEntriesQueueJob)
  async process() {}
}
