import { Features } from '@/common/types/Features';
import { ServiceError } from '@/modules/Items/ServiceError';
import { PREVENT_STOCK_FROM_GOING_BELOW_ZERO_SETTING } from '../InventoryCost.constants';
import { InventoryStockGuard } from './InventoryStockGuard.service';

const buildQuery = (result: unknown[]) => {
  const resultPromise = Promise.resolve(result);
  const chain: any = {
    where: jest.fn(() => chain),
    whereIn: jest.fn(() => chain),
    forUpdate: jest.fn(() => chain),
    then: resultPromise.then.bind(resultPromise),
    catch: resultPromise.catch.bind(resultPromise),
  };
  return chain;
};

const createModel = (results: unknown[][]) => {
  let index = 0;

  return jest.fn(() => ({
    query: jest.fn(() => buildQuery(results[index++] ?? [])),
  }));
};

const makeItem = (overrides: Record<string, unknown> = {}) => ({
  id: 1,
  name: 'Widget',
  type: 'inventory',
  quantityOnHand: 5,
  ...overrides,
});

const makeTransaction = (overrides: Record<string, unknown> = {}) => ({
  itemId: 1,
  quantity: 1,
  direction: 'OUT',
  transactionType: 'SaleInvoice',
  transactionId: 1,
  ...overrides,
});

function createService({
  enabled = true,
  warehousesEnabled = false,
  items = [makeItem()],
  oldTransactions = [],
  warehouseQuantities = [],
}: {
  enabled?: boolean;
  warehousesEnabled?: boolean;
  items?: Array<Record<string, unknown>>;
  oldTransactions?: Array<Record<string, unknown>>;
  warehouseQuantities?: Array<Record<string, unknown>>;
} = {}) {
  const itemModel = createModel([items]);
  const itemWarehouseQuantityModel = createModel([warehouseQuantities]);
  const inventoryTransactionModel = createModel([oldTransactions]);
  const settingsStore = {
    get: jest.fn((query: { key: string }, defaultValue: unknown) => {
      if (query.key === PREVENT_STOCK_FROM_GOING_BELOW_ZERO_SETTING) {
        return enabled;
      }
      if (query.key === Features.WAREHOUSES) {
        return warehousesEnabled;
      }
      return defaultValue;
    }),
  };
  const service = new InventoryStockGuard(
    itemModel as any,
    itemWarehouseQuantityModel as any,
    inventoryTransactionModel as any,
    (() => Promise.resolve(settingsStore)) as any,
  );
  return { service, itemModel };
}

describe('InventoryStockGuard', () => {
  it('skips validation when the setting is disabled', async () => {
    const { service, itemModel } = createService({ enabled: false });

    await expect(
      service.assertSufficientStock([
        makeTransaction({ quantity: 100 }),
      ] as any),
    ).resolves.toBeUndefined();
    expect(itemModel).not.toHaveBeenCalled();
  });

  it('allows an outbound transaction within the available stock', async () => {
    const { service } = createService();

    await expect(
      service.assertSufficientStock([makeTransaction({ quantity: 5 })] as any),
    ).resolves.toBeUndefined();
  });

  it('rejects an outbound transaction above the available stock', async () => {
    const { service } = createService();

    await expect(
      service.assertSufficientStock([makeTransaction({ quantity: 6 })] as any),
    ).rejects.toMatchObject({
      errorType: 'INVENTORY_ITEM_INSUFFICIENT_STOCK',
      payload: {
        items: [
          {
            itemId: 1,
            itemName: 'Widget',
            availableQuantity: 5,
            requestedQuantity: 6,
          },
        ],
      },
    });
  });

  it('nets out the replaced transactions when overriding', async () => {
    const { service } = createService({
      oldTransactions: [makeTransaction({ direction: 'OUT', quantity: 5 })],
    });

    // Current stock 5 still includes the old OUT 5, so replacing it with an
    // OUT 8 leaves 2 units on hand.
    await expect(
      service.assertSufficientStock(
        [makeTransaction({ direction: 'OUT', quantity: 8 })] as any,
        true,
      ),
    ).resolves.toBeUndefined();
  });

  it('rejects overriding an inbound transaction when the replacement would make stock negative', async () => {
    const { service } = createService({
      oldTransactions: [makeTransaction({ direction: 'IN', quantity: 5 })],
    });

    await expect(
      service.assertSufficientStock(
        [makeTransaction({ direction: 'OUT', quantity: 1 })] as any,
        true,
      ),
    ).rejects.toBeInstanceOf(ServiceError);
  });

  it('rejects when the selected warehouse would go negative', async () => {
    const { service } = createService({
      warehousesEnabled: true,
      items: [makeItem({ quantityOnHand: 10 })],
      warehouseQuantities: [{ itemId: 1, warehouseId: 2, quantityOnHand: 2 }],
    });

    await expect(
      service.assertSufficientStock([
        makeTransaction({ quantity: 5, warehouseId: 2 }),
      ] as any),
    ).rejects.toMatchObject({
      errorType: 'INVENTORY_ITEM_INSUFFICIENT_STOCK',
      payload: {
        items: [
          {
            itemId: 1,
            availableQuantity: 2,
            requestedQuantity: 5,
            warehouseId: 2,
          },
        ],
      },
    });
  });

  it('rejects reverting an inbound transaction when stock is insufficient', async () => {
    const { service } = createService({
      items: [makeItem({ quantityOnHand: 2 })],
    });

    await expect(
      service.assertSufficientStockForDeletion([
        makeTransaction({ direction: 'IN', quantity: 5 }),
      ] as any),
    ).rejects.toBeInstanceOf(ServiceError);
  });

  it('allows reverting an outbound transaction', async () => {
    const { service } = createService({
      items: [makeItem({ quantityOnHand: 2 })],
    });

    await expect(
      service.assertSufficientStockForDeletion([
        makeTransaction({ direction: 'OUT', quantity: 5 }),
      ] as any),
    ).resolves.toBeUndefined();
  });
});
