import {
  BatchAllocationsBridge,
  IBatchAllocationsProvider,
} from './BatchAllocationsBridge';

describe('BatchAllocationsBridge', () => {
  let bridge: BatchAllocationsBridge;

  beforeEach(() => {
    bridge = new BatchAllocationsBridge();
  });

  it('resolves as a no-op without a registered provider', async () => {
    await expect(
      bridge.syncEntriesAllocations('Bill', 1, [
        { index: 1, quantity: 10, batches: [{ batchId: 1, quantity: 10 }] },
      ]),
    ).resolves.toBeUndefined();
  });

  it('delegates the synchronization to the registered provider', async () => {
    const provider: jest.Mocked<IBatchAllocationsProvider> = {
      syncEntriesAllocations: jest.fn().mockResolvedValue(undefined),
    };
    const entries = [
      { index: 1, quantity: 10, batches: [{ batchId: 1, quantity: 10 }] },
    ];
    bridge.register(provider);

    await bridge.syncEntriesAllocations('Bill', 5, entries);

    expect(provider.syncEntriesAllocations).toHaveBeenCalledWith(
      'Bill',
      5,
      entries,
      undefined,
    );
  });
});
