import { AllocateLandedCostService } from './AllocateLandedCost.service';
import { ERRORS } from '../utils';
import { billLandedCostEvents } from '../BillLandedCosts.events';

describe('AllocateLandedCostService', () => {
  let uow: { withTransaction: jest.Mock };
  let eventPublisher: { emitAsync: jest.Mock };
  let billModel: jest.Mock;
  let billLandedCostModel: jest.Mock;
  let insertGraph: jest.Mock;
  let service: AllocateLandedCostService;

  const billDTO = {
    transactionType: 'Bill',
    transactionId: 5,
    transactionEntryId: 9,
    allocationMethod: 'value',
    description: 'Ocean freight',
    items: [{ entryId: 1, cost: 100 }],
  };

  beforeEach(() => {
    insertGraph = jest.fn().mockResolvedValue({ id: 99 });
    uow = {
      withTransaction: jest.fn((callback) => callback({ id: 'trx' })),
    };
    eventPublisher = { emitAsync: jest.fn().mockResolvedValue(undefined) };
    billModel = jest.fn(() => ({
      query: jest.fn(() => ({
        findById: jest.fn(() => ({
          withGraphFetched: jest.fn(() => ({
            throwIfNotFound: jest
              .fn()
              .mockResolvedValue({ id: 7, entries: [{ id: 1, itemId: 10 }] }),
          })),
        })),
      })),
    }));
    billLandedCostModel = jest.fn(() => ({
      query: jest.fn(() => ({ insertGraph })),
    }));
    service = new AllocateLandedCostService(
      uow as any,
      eventPublisher as any,
      billModel as any,
      billLandedCostModel as any,
    );
  });

  it('allocates the landed cost and triggers the created event', async () => {
    jest.spyOn(service, 'getLandedCostOrThrowError').mockResolvedValue({
      id: 5,
      currencyCode: 'USD',
      exchangeRate: 1,
    } as any);
    jest.spyOn(service, 'getLandedCostEntry').mockResolvedValue({
      id: 9,
      unallocatedCostAmount: 500,
      costAccountId: 1019,
    } as any);

    const result = await service.allocateLandedCost(billDTO as any, 7);

    expect(insertGraph).toHaveBeenCalledWith(
      expect.objectContaining({
        billId: 7,
        fromTransactionType: 'Bill',
        fromTransactionId: 5,
        fromTransactionEntryId: 9,
        amount: 100,
        allocateEntries: billDTO.items,
        costAccountId: 1019,
      }),
    );
    expect(eventPublisher.emitAsync).toHaveBeenCalledWith(
      billLandedCostEvents.onCreated,
      expect.objectContaining({
        bill: expect.objectContaining({ id: 7 }),
        billLandedCostId: 99,
        billLandedCost: { id: 99 },
        trx: expect.objectContaining({ id: 'trx' }),
      }),
    );
    expect(result).toEqual({ id: 99 });
  });

  it('rejects the allocation once the amount exceeds the unallocated cost', async () => {
    jest
      .spyOn(service, 'getLandedCostOrThrowError')
      .mockResolvedValue({} as any);
    jest.spyOn(service, 'getLandedCostEntry').mockResolvedValue({
      id: 9,
      unallocatedCostAmount: 50,
      costAccountId: 1019,
    } as any);

    await expect(
      service.allocateLandedCost(billDTO as any, 7),
    ).rejects.toMatchObject({
      errorType: ERRORS.COST_AMOUNT_BIGGER_THAN_UNALLOCATED_AMOUNT,
    });
    expect(uow.withTransaction).not.toHaveBeenCalled();
  });

  it('rejects the allocation once an allocate item is not a bill entry', async () => {
    jest
      .spyOn(service, 'getLandedCostOrThrowError')
      .mockResolvedValue({} as any);
    jest.spyOn(service, 'getLandedCostEntry').mockResolvedValue({
      id: 9,
      unallocatedCostAmount: 500,
      costAccountId: 1019,
    } as any);

    await expect(
      service.allocateLandedCost(
        { ...billDTO, items: [{ entryId: 99, cost: 100 }] } as any,
        7,
      ),
    ).rejects.toMatchObject({
      errorType: ERRORS.LANDED_COST_ITEMS_IDS_NOT_FOUND,
    });
  });
});
