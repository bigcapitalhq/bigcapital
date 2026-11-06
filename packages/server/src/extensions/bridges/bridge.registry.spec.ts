import { DuplicateContributionError } from '@bigcapital/extension-sdk';
import type { BridgeProvider } from '@bigcapital/extension-sdk/bridges';
import { BridgeRegistry } from './bridge.registry';

const provider = (key = 'default'): BridgeProvider => ({ key });

describe('BridgeRegistry', () => {
  it('namespaces provider keys by owner', () => {
    const registry = new BridgeRegistry<BridgeProvider>();

    registry.register('acme.reports', provider('default'));
    registry.register('core', provider('allow'));

    expect(registry.getKeys()).toEqual([
      'ext:acme.reports:default',
      'core:allow',
    ]);
    expect(registry.get('ext:acme.reports:default')?.key).toBe('default');
    expect(registry.get('core:allow')?.key).toBe('allow');
  });

  it('rejects duplicate namespaced keys', () => {
    const registry = new BridgeRegistry<BridgeProvider>();

    registry.register('acme.reports', provider('default'));

    expect(() =>
      registry.register('acme.reports', provider('default')),
    ).toThrow(DuplicateContributionError);
  });

  it('removes providers by owner and via disposable', () => {
    const registry = new BridgeRegistry<BridgeProvider>();

    registry.register('acme.reports', provider('a'));
    registry.register('acme.reports', provider('b'));
    registry.register('acme.other', provider('c'));

    const disposable = registry.register('acme.dispose', provider('d'));
    disposable.dispose();

    expect(registry.getKeys()).not.toContain('ext:acme.dispose:d');
    expect(registry.removeByOwner('acme.reports')).toBe(2);
    expect(registry.getByOwner('acme.reports')).toHaveLength(0);
    expect(registry.getKeys()).toEqual(['ext:acme.other:c']);
  });
});
