import { BatchesValidators } from './BatchesValidators.service';
import { BATCHES_ERRORS } from './types/Batches.types';
import type { BatchesBalanceService } from './BatchesBalance.service';

describe('warehouse batch availability', () => {
  const batch = { id: 1, itemId: 10, batchNumber: 'LOT-1' };
  const entry = { itemId: 10, batchId: 1, quantity: 3 };
  const batchModel = jest.fn(() => ({
    query: () => ({ whereIn: () => Promise.resolve([batch]) }),
  }));
  const getAvailableQuantities = jest.fn(
    async (_batches, _exclude, warehouseId) =>
      new Map([[1, warehouseId === 2 ? 4 : 3]]),
  );
  const validators = new BatchesValidators(batchModel as any, jest.fn(), {
    getAvailableQuantities,
  } as unknown as BatchesBalanceService);

  it('checks each line against its warehouse, including document-level defaults', async () => {
    await validators.validateEntriesBatches(
      [entry, { ...entry, warehouseId: 3 }],
      {
        warehouseId: 2,
        checkAvailability: true,
        referenceType: 'SaleInvoice',
        referenceId: 15,
      },
    );
    const exclude = { transactionType: 'SaleInvoice', transactionId: 15 };
    for (const warehouseId of [2, 3]) {
      expect(getAvailableQuantities).toHaveBeenCalledWith(
        [batch],
        exclude,
        warehouseId,
        undefined,
      );
    }
  });

  it('adds repeated requests within a warehouse before checking for a shortage', async () => {
    await expect(
      validators.validateEntriesBatches([entry, { ...entry, warehouseId: 2 }], {
        warehouseId: 2,
        checkAvailability: true,
      }),
    ).rejects.toMatchObject({
      errorType: BATCHES_ERRORS.BATCH_INSUFFICIENT_QUANTITY,
      payload: { warehouseId: 2, requestedQuantity: 6, availableQuantity: 4 },
    });
  });
});
