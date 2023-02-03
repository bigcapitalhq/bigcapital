import { Service, Inject } from 'typedi';
import events from '@/subscribers/events';
import { IWarehouseTransferCreated } from '@/interfaces';
import { WarehouseTransferAutoIncrement } from './WarehouseTransferAutoIncrement';

@Service()
export class WarehouseTransferAutoIncrementSubscriber {
  @Inject()
  private warehouseTransferAutoIncrement: WarehouseTransferAutoIncrement;

  /**
   * Attaches events with handlers.
   */
  public attach = (bus) => {
    bus.subscribe(
      events.warehouseTransfer.onCreated,
      this.incrementTransferAutoIncrementOnCreated
    );
    return bus;
  };

  /**
   * Writes inventory transactions once warehouse transfer created.
   * @param {IInventoryTransactionsCreatedPayload} -
   */
  private incrementTransferAutoIncrementOnCreated = async ({
    tenantId,
  }: IWarehouseTransferCreated) => {
    await this.warehouseTransferAutoIncrement.incrementNextTransferNumber(
      tenantId
    );
  };
}
