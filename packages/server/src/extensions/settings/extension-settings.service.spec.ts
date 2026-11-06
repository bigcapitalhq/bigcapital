import { parseExtensionManifest } from '@bigcapital/extension-sdk/manifest';
import {
  EXTENSION_SECRET_MASK,
  ExtensionSettingsService,
} from './extension-settings.service';

const manifest = parseExtensionManifest({
  id: 'acme.reports',
  name: 'Acme Reports',
  version: '1.0.0',
  trust: 'partner',
  settings: [
    {
      key: 'default_period',
      type: 'string',
      defaultValue: 'this_year',
      public: true,
    },
    {
      key: 'page_size',
      type: 'number',
      defaultValue: 25,
    },
    {
      key: 'mode',
      type: 'enum',
      enumValues: ['summary', 'detailed'],
      defaultValue: 'summary',
    },
    {
      key: 'enabled',
      type: 'boolean',
    },
    {
      key: 'api_key',
      type: 'secret',
      public: true,
      required: true,
    },
    {
      key: 'options',
      type: 'json',
    },
  ],
});

const buildService = (stored?: Record<string, unknown>) => {
  const manager = {
    ensureTenantRecord: jest.fn().mockResolvedValue({ settings: stored }),
    updateSettings: jest.fn().mockResolvedValue({ settings: stored }),
    getTenantRecord: jest.fn().mockResolvedValue({ settings: stored }),
  };
  const registry = {
    getManifest: jest.fn().mockReturnValue(manifest),
    hasManifest: jest.fn().mockReturnValue(true),
  };

  return {
    service: new ExtensionSettingsService(manager as any, registry as any),
    manager,
  };
};

describe('ExtensionSettingsService', () => {
  it('merges manifest defaults with stored settings', () => {
    const { service } = buildService({ page_size: 50 });

    expect(
      service.getEffectiveSettings('acme.reports', { page_size: 50 }),
    ).toEqual({
      default_period: 'this_year',
      page_size: 50,
      mode: 'summary',
    });
  });

  it('masks secret values for the admin API', () => {
    const { service } = buildService();

    const settings = service.getAdminSettings('acme.reports', {
      api_key: 'super-secret',
      page_size: 50,
    });

    expect(settings.api_key).toBe(EXTENSION_SECRET_MASK);
    expect(settings.page_size).toBe(50);
  });

  it('never exposes secrets in public settings', () => {
    const { service } = buildService();

    const publicSettings = service.getPublicSettings('acme.reports', {
      api_key: 'super-secret',
      default_period: 'last_month',
    });

    expect(publicSettings).toEqual({ default_period: 'last_month' });
    expect(publicSettings).not.toHaveProperty('api_key');
  });

  it('rejects unknown keys and invalid values', () => {
    const { service } = buildService();

    expect(() =>
      service.validateSettings(
        manifest.settings,
        {},
        {
          unknown: true,
          page_size: 'large',
          mode: 'invalid',
          enabled: 'yes',
          options: 'not-json',
        },
      ),
    ).toThrow(/Unknown setting/);
  });

  it('rejects invalid typed values through the update path', () => {
    const { service } = buildService();

    expect(() =>
      service.validateSettings(manifest.settings, {}, ['not-an-object']),
    ).toThrow(/must be an object/);
    expect(() =>
      service.validateSettings(
        manifest.settings,
        {},
        {
          page_size: 'large',
        },
      ),
    ).toThrow(/must be a number/);
    expect(() =>
      service.validateSettings(
        manifest.settings,
        {},
        {
          mode: 'invalid',
        },
      ),
    ).toThrow(/must be one of/);
    expect(() =>
      service.validateSettings(
        manifest.settings,
        {},
        {
          enabled: 'yes',
        },
      ),
    ).toThrow(/must be a boolean/);
    expect(() =>
      service.validateSettings(
        manifest.settings,
        {},
        {
          options: 'not-json',
        },
      ),
    ).toThrow(/must be a JSON object/);
  });

  it('requires required settings after merging', () => {
    const { service } = buildService();

    expect(() => service.validateSettings(manifest.settings, {}, {})).toThrow(
      /api_key.*required/,
    );
  });

  it('preserves an existing secret when the masked value is sent back', () => {
    const { service } = buildService();

    const settings = service.validateSettings(
      manifest.settings,
      { api_key: 'existing-secret' },
      { api_key: EXTENSION_SECRET_MASK, page_size: 10 },
    );

    expect(settings.api_key).toBe('existing-secret');
    expect(settings.page_size).toBe(10);
  });

  it('stores validated settings through the manager', async () => {
    const { service, manager } = buildService();

    await service.updateSettings('acme.reports', 'org-1', {
      api_key: 'new-secret',
      page_size: 100,
    });

    expect(manager.updateSettings).toHaveBeenCalledWith(
      'acme.reports',
      'org-1',
      expect.objectContaining({
        api_key: 'new-secret',
        page_size: 100,
      }),
    );
  });
});
