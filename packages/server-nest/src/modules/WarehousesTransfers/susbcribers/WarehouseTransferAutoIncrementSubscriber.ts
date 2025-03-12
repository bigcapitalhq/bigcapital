import { Inject, Injectable } from '@nestjs/common';
import { events } from '@/common/events/events';
import { IWarehouseTransferCreated } from '../../Warehouses/Warehouse.types';
import { WarehouseTransferAutoIncrement } from '../commands/WarehouseTransferAutoIncrement';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class WarehouseTransferAutoIncrementSubscriber {
  constructor(
    private readonly warehouseTransferAutoIncrement: WarehouseTransferAutoIncrement,
  ) {}

  /**
   * Writes inventory transactions once warehouse transfer created.
   * @param {IInventoryTransactionsCreatedPayload} -
   */
  @OnEvent(events.warehouseTransfer.onCreated)
  async incrementTransferAutoIncrementOnCreated({}: IWarehouseTransferCreated) {
    await this.warehouseTransferAutoIncrement.incrementNextTransferNumber();
  }
}
