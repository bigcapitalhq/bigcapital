import { InventoryComputeCostService } from './InventoryComputeCost.service';

const createService = (item: Record<string, any>) => {
  const averageCostMethod = { computeItemCost: jest.fn() };
  const lotCostMethod = { computeItemCost: jest.fn() };
  const costMethodResolver = {
    resolveItemCostMethod: jest.fn(async (item: Record<string, any>) => {
      const method = item.costMethod ?? item.category?.costMethod ?? 'AVG';
      return ['AVG', 'FIFO', 'LIFO'].includes(method) ? method : 'AVG';
    }),
  };
  const itemModel = jest.fn(() => ({
    query: () => ({
      withGraphFetched: () => ({
        findById: () => Promise.resolve(item),
      }),
    }),
  }));
  const service = new InventoryComputeCostService(
    {} as any,
    averageCostMethod as any,
    lotCostMethod as any,
    {} as any,
    { getOrThrow: () => ({}) } as any,
    {} as any,
    itemModel as any,
    costMethodResolver as any,
    (() => ({})) as any,
  );
  return { service, averageCostMethod, lotCostMethod };
};

describe('InventoryComputeCostService', () => {
  const fromDate = new Date('2026-01-01');

  it('should use the average cost method by default', async () => {
    const { service, averageCostMethod, lotCostMethod } = createService({
      id: 1,
      type: 'inventory',
      category: { costMethod: null },
    });

    await service.computeInventoryItemCost(fromDate, 1);

    expect(averageCostMethod.computeItemCost).toHaveBeenCalledWith(
      fromDate,
      1,
      undefined,
    );
    expect(lotCostMethod.computeItemCost).not.toHaveBeenCalled();
  });

  it('should use the FIFO cost method', async () => {
    const { service, averageCostMethod, lotCostMethod } = createService({
      id: 1,
      type: 'inventory',
      category: { costMethod: 'FIFO' },
    });

    await service.computeInventoryItemCost(fromDate, 1);

    expect(lotCostMethod.computeItemCost).toHaveBeenCalledWith(
      fromDate,
      1,
      'FIFO',
      undefined,
    );
    expect(averageCostMethod.computeItemCost).not.toHaveBeenCalled();
  });

  it('should use the LIFO cost method', async () => {
    const { service, lotCostMethod } = createService({
      id: 1,
      type: 'inventory',
      category: { costMethod: 'LIFO' },
    });

    await service.computeInventoryItemCost(fromDate, 1);

    expect(lotCostMethod.computeItemCost).toHaveBeenCalledWith(
      fromDate,
      1,
      'LIFO',
      undefined,
    );
  });

  it('should prefer the item-level cost method over the category method', async () => {
    const { service, lotCostMethod } = createService({
      id: 1,
      type: 'inventory',
      costMethod: 'LIFO',
      category: { costMethod: 'FIFO' },
    });

    await service.computeInventoryItemCost(fromDate, 1);

    expect(lotCostMethod.computeItemCost).toHaveBeenCalledWith(
      fromDate,
      1,
      'LIFO',
      undefined,
    );
  });

  it('should fall back to the average cost method for unknown values', async () => {
    const { service, averageCostMethod } = createService({
      id: 1,
      type: 'inventory',
      category: { costMethod: 'UNKNOWN' },
    });

    await service.computeInventoryItemCost(fromDate, 1);

    expect(averageCostMethod.computeItemCost).toHaveBeenCalled();
  });

  it('should throw an error for non-inventory items', async () => {
    const { service } = createService({
      id: 1,
      type: 'service',
      category: { costMethod: 'FIFO' },
    });

    await expect(service.computeInventoryItemCost(fromDate, 1)).rejects.toThrow(
      'You could not compute item cost has no inventory type.',
    );
  });
});
