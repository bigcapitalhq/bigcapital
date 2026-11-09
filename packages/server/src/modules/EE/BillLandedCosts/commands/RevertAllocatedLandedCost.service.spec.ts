import { ServiceError } from '@/modules/Items/ServiceError';
import { billLandedCostEvents } from '../BillLandedCosts.events';
import { ERRORS } from '../utils';
import { RevertAllocatedLandedCost } from './RevertAllocatedLandedCost.service';

describe('RevertAllocatedLandedCost', () => {
  let eventPublisher: { emitAsync: jest.Mock };
  let uow: { withTransaction: jest.Mock };
  let billLandedCostEntryModel: jest.Mock;
  let billLandedCostModel: jest.Mock;
  let service: RevertAllocatedLandedCost;
  let entryWhere: jest.Mock;
  let entryDelete: jest.Mock;
  let costWhere: jest.Mock;
  let costDelete: jest.Mock;

  beforeEach(() => {
    entryDelete = jest.fn().mockResolvedValue(1);
    entryWhere = jest.fn(() => ({ delete: entryDelete }));
    billLandedCostEntryModel = jest.fn(() => ({
      query: jest.fn(() => ({ where: entryWhere })),
    }));

    costDelete = jest.fn().mockResolvedValue(1);
    costWhere = jest.fn(() => ({ delete: costDelete }));
    billLandedCostModel = jest.fn(() => ({
      query: jest.fn(() => ({ where: costWhere })),
    }));

    eventPublisher = { emitAsync: jest.fn().mockResolvedValue(undefined) };
    uow = {
      withTransaction: jest.fn((callback) => callback({ id: 'trx' })),
    };
    service = new RevertAllocatedLandedCost(
      eventPublisher as any,
      uow as any,
      billLandedCostEntryModel as any,
    );
    (service as any).billLandedCostModel = billLandedCostModel;
  });

  it('deletes the allocated landed cost and triggers the deleted event', async () => {
    jest.spyOn(service, 'getBillLandedCostOrThrowError').mockResolvedValue({
      id: 99,
      billId: 5,
    } as any);

    const result = await service.deleteAllocatedLandedCost(99);

    expect(entryWhere).toHaveBeenCalledWith('bill_located_cost_id', 99);
    expect(costWhere).toHaveBeenCalledWith('id', 99);
    expect(eventPublisher.emitAsync).toHaveBeenCalledWith(
      billLandedCostEvents.onDeleted,
      expect.objectContaining({
        oldBillLandedCost: expect.objectContaining({ id: 99 }),
        billId: 5,
        trx: expect.objectContaining({ id: 'trx' }),
      }),
    );
    expect(result).toEqual({ landedCostId: 99 });
  });

  it('rejects once the allocated landed cost is not found', async () => {
    jest
      .spyOn(service, 'getBillLandedCostOrThrowError')
      .mockRejectedValue(new ServiceError(ERRORS.BILL_LANDED_COST_NOT_FOUND));

    await expect(service.deleteAllocatedLandedCost(99)).rejects.toMatchObject({
      errorType: ERRORS.BILL_LANDED_COST_NOT_FOUND,
    });
    expect(uow.withTransaction).not.toHaveBeenCalled();
  });
});
