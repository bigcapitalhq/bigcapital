import { ItemCostMethodResolverService } from './ItemCostMethodResolver.service';

const createResolver = (defaultCostMethod?: string | null) => {
  const settingsStore = jest.fn(async () => ({
    get: () => defaultCostMethod,
  }));

  return new ItemCostMethodResolverService(settingsStore as any);
};

describe('ItemCostMethodResolverService', () => {
  it('should resolve the item-level cost method first', () => {
    const resolver = createResolver('LIFO');

    expect(
      resolver.resolveCostMethod(
        { costMethod: 'FIFO', category: { costMethod: 'AVG' } },
        'LIFO',
      ),
    ).toBe('FIFO');
  });

  it('should fall back to the category cost method', () => {
    const resolver = createResolver('LIFO');

    expect(
      resolver.resolveCostMethod(
        { costMethod: null, category: { costMethod: 'FIFO' } },
        'LIFO',
      ),
    ).toBe('FIFO');
  });

  it('should fall back to the global default cost method', () => {
    const resolver = createResolver('LIFO');

    expect(
      resolver.resolveCostMethod({ costMethod: null, category: null }, 'LIFO'),
    ).toBe('LIFO');
  });

  it('should fall back to AVG when no cost method is defined', async () => {
    const resolver = createResolver(null);

    expect(await resolver.getDefaultCostMethod()).toBe('AVG');
    expect(await resolver.resolveItemCostMethod({ costMethod: null })).toBe(
      'AVG',
    );
  });

  it('should read the default cost method from the settings store', async () => {
    const resolver = createResolver('FIFO');

    expect(await resolver.getDefaultCostMethod()).toBe('FIFO');
    expect(await resolver.resolveItemCostMethod({})).toBe('FIFO');
  });
});
