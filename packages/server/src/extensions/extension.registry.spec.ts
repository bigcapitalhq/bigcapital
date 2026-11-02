import { parseExtensionManifest } from '@bigcapital/extension-sdk/manifest';
import { ExtensionCapabilityError } from './extension.errors';
import { ExtensionContributionRegistry } from './extension.registry';

const buildManifest = (capabilities: string[] = []) =>
  parseExtensionManifest({
    id: 'acme.reports',
    name: 'Acme Reports',
    version: '1.0.0',
    trust: 'partner',
    capabilities,
    features: [{ key: 'advanced' }],
    abilities: [
      {
        subject: 'Report',
        subjectLabel: 'Report',
        abilities: [{ key: 'View', label: 'View' }],
      },
    ],
    settings: [{ key: 'api_key', type: 'secret' }],
  });

describe('ExtensionContributionRegistry', () => {
  it('registers manifest-declared contributions', () => {
    const registry = new ExtensionContributionRegistry();
    registry.registerManifest(buildManifest());

    expect(registry.getFeatures().map((item) => item.id)).toEqual([
      'ext:acme.reports:advanced',
    ]);
    expect(registry.getAbilities().map((item) => item.id)).toEqual([
      'ext:acme.reports:Report',
    ]);
    expect(registry.getSettings('acme.reports')).toHaveLength(1);
  });

  it('treats module-time registration of a declared contribution as idempotent', () => {
    const manifest = buildManifest();
    const registry = new ExtensionContributionRegistry();
    registry.registerManifest(manifest);

    registry.registerFeature(manifest.id, manifest.features[0]);
    registry.registerAbility(manifest.id, manifest.abilities[0]);
    registry.registerSetting(manifest.id, manifest.settings[0]);

    expect(registry.getFeatures()).toHaveLength(1);
    expect(registry.getAbilities()).toHaveLength(1);
    expect(registry.getSettings()).toHaveLength(1);
  });

  it('rejects undeclared features', () => {
    const registry = new ExtensionContributionRegistry();
    registry.registerManifest(buildManifest());

    expect(() =>
      registry.registerFeature('acme.reports', {
        key: 'undeclared',
        defaultValue: false,
        public: false,
      }),
    ).toThrow(/must declare feature/);
  });

  it('requires events.subscribe before an event subscriber can register', () => {
    const registry = new ExtensionContributionRegistry();
    registry.registerManifest(buildManifest());

    expect(() =>
      registry.registerEventSubscriber(
        'acme.reports',
        'onSaleInvoiceCreated',
        async () => {},
      ),
    ).toThrow(ExtensionCapabilityError);
  });

  it('registers and removes event subscribers', () => {
    const registry = new ExtensionContributionRegistry();
    registry.registerManifest(buildManifest(['events.subscribe']));

    const subscriber = registry.registerEventSubscriber(
      'acme.reports',
      'onSaleInvoiceCreated',
      async () => {},
    );

    expect(registry.getEventSubscribers()).toHaveLength(1);
    registry.removeEventSubscriber(subscriber.id);
    expect(registry.getEventSubscribers()).toHaveLength(0);
  });

  it('requires jobs.register before a job can register', () => {
    const registry = new ExtensionContributionRegistry();
    registry.registerManifest(buildManifest());

    expect(() =>
      registry.registerJob('acme.reports', {
        name: 'sync',
        handler: async () => {},
      }),
    ).toThrow(ExtensionCapabilityError);
  });

  it('removes every contribution owned by an extension', () => {
    const registry = new ExtensionContributionRegistry();
    registry.registerManifest(
      buildManifest(['events.subscribe', 'jobs.register']),
    );

    registry.registerEventSubscriber(
      'acme.reports',
      'onSaleInvoiceCreated',
      async () => {},
    );
    registry.registerJob('acme.reports', {
      name: 'sync',
      handler: async () => {},
    });

    registry.removeByOwner('acme.reports');

    expect(registry.getFeatures()).toHaveLength(0);
    expect(registry.getAbilities()).toHaveLength(0);
    expect(registry.getSettings()).toHaveLength(0);
    expect(registry.getEventSubscribers()).toHaveLength(0);
    expect(registry.getJobs()).toHaveLength(0);
    expect(registry.hasManifest('acme.reports')).toBe(false);
  });
});
