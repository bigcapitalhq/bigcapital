import type { TaxProvider } from '@bigcapital/extension-sdk/bridges';
import { TaxRegistry } from './tax.registry';

const buildProvider = (key: string): TaxProvider => ({
  key,
  calculate: async () => ({ lines: [], totalTaxAmount: 0 }),
  validateConfiguration: async () => {},
});

describe('TaxRegistry', () => {
  it('returns undefined when no provider is registered', () => {
    const registry = new TaxRegistry();

    expect(registry.getActive()).toBeUndefined();
  });

  it('selects the configured provider key and falls back to the first', () => {
    const registry = new TaxRegistry();
    const first = buildProvider('first');
    const second = buildProvider('second');

    registry.register('acme.tax', first);
    registry.register('acme.tax', second);

    expect(registry.getActive('ext:acme.tax:second')).toBe(second);
    expect(registry.getActive()).toBe(first);
    expect(registry.getActive('missing')).toBe(first);
  });

  it('removes providers by owner', () => {
    const registry = new TaxRegistry();

    registry.register('acme.tax', buildProvider('default'));

    expect(registry.removeByOwner('acme.tax')).toBe(1);
    expect(registry.getActive()).toBeUndefined();
  });
});
