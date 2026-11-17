import { ServiceError } from '@/modules/Items/ServiceError';
import { BATCHES_ERRORS } from '../types/Batches.types';
import { BulkSaveBatchesService } from './BulkSaveBatches.service';

describe('BulkSaveBatchesService', () => {
  const trx = { transaction: true };
  let service: BulkSaveBatchesService;
  let uow: any;
  let batchModel: any;
  let validators: any;
  let createBatchService: any;
  let editBatchService: any;
  let batchesBalance: any;

  beforeEach(() => {
    uow = {
      withTransaction: jest.fn((work) => work(trx)),
    };
    batchModel = jest.fn();
    validators = {
      validateBatchItem: jest
        .fn()
        .mockResolvedValue({ id: 1, type: 'inventory' }),
      validateBatchDates: jest.fn(),
    };
    createBatchService = {
      createBatch: jest
        .fn()
        .mockImplementation((dto) => Promise.resolve({ id: 10, ...dto })),
    };
    editBatchService = {
      editBatch: jest
        .fn()
        .mockImplementation((id, dto) => Promise.resolve({ id, ...dto })),
    };
    batchesBalance = {
      attachBalance: jest.fn((batches) => Promise.resolve(batches)),
    };
    service = new BulkSaveBatchesService(
      uow,
      batchModel,
      validators,
      createBatchService,
      editBatchService,
      batchesBalance,
    );
  });

  it('updates batches with batchId and creates the ones without it', async () => {
    batchModel.mockReturnValue({
      query: () => ({
        whereIn: jest
          .fn()
          .mockResolvedValue([{ id: 2, itemId: 1, batchNumber: 'B' }]),
      }),
    });

    const result = await service.bulkSaveBatches({
      itemId: 1,
      batches: [
        {
          batchId: 2,
          batchNumber: 'B',
          batchRef: null,
          manufacturedDate: null,
          expiryDate: null,
        },
        {
          batchNumber: 'C',
          quantity: 5,
          sourceTransactionType: 'Bill',
        },
      ],
    });

    expect(editBatchService.editBatch).toHaveBeenCalledWith(
      2,
      expect.objectContaining({ id: 2, batchNumber: 'B' }),
      trx,
    );
    expect(createBatchService.createBatch).toHaveBeenCalledWith(
      expect.objectContaining({
        itemId: 1,
        batchNumber: 'C',
        quantity: 5,
        sourceTransactionType: 'Bill',
      }),
      trx,
    );
    expect(result.map((batch) => batch.id)).toEqual([2, 10]);
    expect(batchesBalance.attachBalance).toHaveBeenCalledWith([
      expect.objectContaining({ id: 2 }),
      expect.objectContaining({ id: 10 }),
    ]);
  });

  it('rejects batches that belong to another item', async () => {
    batchModel.mockReturnValue({
      query: () => ({
        whereIn: jest
          .fn()
          .mockResolvedValue([{ id: 2, itemId: 9, batchNumber: 'B' }]),
      }),
    });

    await expect(
      service.bulkSaveBatches({
        itemId: 1,
        batches: [{ batchId: 2, batchNumber: 'B' }],
      }),
    ).rejects.toMatchObject({
      errorType: BATCHES_ERRORS.BATCH_ITEM_MISMATCH,
    });
    expect(editBatchService.editBatch).not.toHaveBeenCalled();
  });

  it('rejects duplicate batch numbers in the payload', async () => {
    await expect(
      service.bulkSaveBatches({
        itemId: 1,
        batches: [{ batchNumber: 'BATCH-001' }, { batchNumber: ' batch-001 ' }],
      }),
    ).rejects.toBeInstanceOf(ServiceError);
    expect(editBatchService.editBatch).not.toHaveBeenCalled();
    expect(createBatchService.createBatch).not.toHaveBeenCalled();
  });
});
