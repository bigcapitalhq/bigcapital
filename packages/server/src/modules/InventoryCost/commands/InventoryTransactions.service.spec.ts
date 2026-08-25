import { EventEmitter2 } from '@nestjs/event-emitter';
import { InventoryTransactionsService } from './InventoryTransactions.service';
import { events } from '@/common/events/events';

describe('InventoryTransactionsService', () => {
  const createService = () => {
    const eventEmitter = {
      emitAsync: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<EventEmitter2>;

    const service = new InventoryTransactionsService(
      eventEmitter,
      jest.fn() as any,
      jest.fn() as any,
    );

    jest
      .spyOn(service, 'deleteInventoryTransactions')
      .mockResolvedValue({ oldInventoryTransactions: [] } as any);
    jest
      .spyOn(service, 'recordInventoryTransaction')
      .mockImplementation(async (transaction) => transaction as any);

    return { service, eventEmitter };
  };

  const multiLineReceipt = [
    {
      itemId: 1,
      quantity: 5,
      direction: 'OUT',
      transactionId: 42,
      transactionType: 'SaleReceipt',
    },
    {
      itemId: 2,
      quantity: 3,
      direction: 'OUT',
      transactionId: 42,
      transactionType: 'SaleReceipt',
    },
    {
      itemId: 3,
      quantity: 1,
      direction: 'OUT',
      transactionId: 42,
      transactionType: 'SaleReceipt',
    },
  ] as any[];

  it('deletes existing document transactions once when override is true', async () => {
    const { service, eventEmitter } = createService();

    await service.recordInventoryTransactions(multiLineReceipt, true);

    expect(service.deleteInventoryTransactions).toHaveBeenCalledTimes(1);
    expect(service.deleteInventoryTransactions).toHaveBeenCalledWith(
      42,
      'SaleReceipt',
      undefined,
    );
    expect(service.recordInventoryTransaction).toHaveBeenCalledTimes(3);
    expect(service.recordInventoryTransaction).toHaveBeenCalledWith(
      multiLineReceipt[0],
      false,
      undefined,
    );
    expect(eventEmitter.emitAsync).toHaveBeenCalledWith(
      events.inventory.onInventoryTransactionsCreated,
      expect.objectContaining({
        inventoryTransactions: expect.any(Array),
      }),
    );
  });

  it('does not delete existing transactions when override is false', async () => {
    const { service } = createService();

    await service.recordInventoryTransactions(multiLineReceipt, false);

    expect(service.deleteInventoryTransactions).not.toHaveBeenCalled();
    expect(service.recordInventoryTransaction).toHaveBeenCalledTimes(3);
  });
});
