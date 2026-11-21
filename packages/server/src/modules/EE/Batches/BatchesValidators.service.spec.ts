import { BatchesValidators } from './BatchesValidators.service';

describe('required item batches', () => {
  const itemQuery = {
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    whereIn: jest.fn().mockResolvedValue([{ id: 1 }]),
  };
  const items = jest.fn(() => ({ query: () => itemQuery }));
  const batches = jest.fn(() => ({
    query: () => ({
      whereIn: (_column: string, ids: number[]) => ({
        orderBy: () =>
          Promise.resolve(
            [5, 6]
              .filter((id) => ids.includes(id))
              .map((id) => ({ id, itemId: 1 })),
          ),
      }),
    }),
  }));
  const validator = new BatchesValidators(batches as any, items as any, null);

  it('reports every unassigned tracked line in document order, including repeated items', async () => {
    await expect(
      validator.validateEntriesBatches([
        {},
        { itemId: 2 },
        { itemId: 1, index: 8, batches: [] },
        { itemId: 1, batchId: 5 },
        { itemId: 1 },
        { itemId: 1, quantity: 1, batches: [{ batchId: 6, quantity: 1 }] },
      ]),
    ).rejects.toMatchObject({
      httpStatus: 400,
      errorType: 'BATCH_ALLOCATIONS_REQUIRED',
      payload: { entryIndexes: [8, 5] },
    });
    expect(itemQuery.where).toHaveBeenCalledWith({
      type: 'inventory',
      inventoryTracking: 'batches',
    });
    expect(itemQuery.whereIn).toHaveBeenCalledWith('id', [2, 1, 1]);
  });

  it('rejects a batch assigned to a line without an item', async () => {
    await expect(
      validator.validateEntriesBatches([{ batchId: 5 }]),
    ).rejects.toMatchObject({ errorType: 'BATCH_ITEM_MISMATCH' });
  });

  it('accepts legacy single-batch and split allocations alongside an untracked line', async () => {
    itemQuery.whereIn.mockResolvedValueOnce([]);
    await expect(
      validator.validateEntriesBatches([
        { itemId: 2 },
        { itemId: 1, quantity: 1, batchId: 5 },
        {
          itemId: 1,
          quantity: 3,
          batches: [
            { batchId: 5, quantity: 1 },
            { batchId: 6, quantity: 2 },
          ],
        },
      ]),
    ).resolves.toBeUndefined();
  });
});
