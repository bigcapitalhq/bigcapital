import { DashboardService } from './Dashboard.service';

interface BuildServiceOptions {
  organizationId?: string | null;
  enabled?: boolean;
  settings?: Record<string, unknown>;
  extensionSettings?: Array<{
    id: string;
    owner: string;
    key: string;
    definition: Record<string, unknown>;
  }>;
  withExtensions?: boolean;
}

const buildService = (options: BuildServiceOptions = {}) => {
  const featuresManager = {
    all: jest.fn().mockResolvedValue([]),
  };
  const configService = {
    get: jest.fn().mockReturnValue(false),
  };
  const tenancyContext = {
    getSystemUser: jest.fn().mockResolvedValue({ id: 1 }),
  };
  const cls = {
    get: jest
      .fn()
      .mockReturnValue(
        options.organizationId === null
          ? undefined
          : (options.organizationId ?? 'org-1'),
      ),
  };
  const tenantUserModel = jest.fn().mockReturnValue({
    query: () => ({
      findOne: () => ({
        withGraphFetched: () => ({
          throwIfNotFound: async () => ({
            role: { slug: 'admin' },
          }),
        }),
      }),
    }),
  });

  const extensionManager = {
    listForOrganization: jest.fn().mockResolvedValue([
      {
        id: 'acme.reports',
        version: '1.0.0',
        enabled: options.enabled ?? true,
        settings: options.settings,
      },
    ]),
  };
  const extensionRegistry = {
    getSettings: jest.fn().mockReturnValue(options.extensionSettings ?? []),
  };

  const withExtensions = options.withExtensions ?? true;

  const service = new DashboardService(
    featuresManager as any,
    configService as any,
    tenancyContext as any,
    cls as any,
    tenantUserModel as any,
    withExtensions ? (extensionManager as any) : undefined,
    withExtensions ? (extensionRegistry as any) : undefined,
  );

  return { service, extensionManager, extensionRegistry, cls };
};

describe('DashboardService boot meta', () => {
  it('includes enabled extensions with only public settings', async () => {
    const { service } = buildService({
      settings: { api_key: 'secret', theme: 'dark' },
      extensionSettings: [
        {
          id: 'ext:acme.reports:theme',
          owner: 'acme.reports',
          key: 'theme',
          definition: { key: 'theme', type: 'string', public: true },
        },
        {
          id: 'ext:acme.reports:api_key',
          owner: 'acme.reports',
          key: 'api_key',
          definition: { key: 'api_key', type: 'secret', public: false },
        },
      ],
    });

    const meta = await service.getBootMeta();

    expect(meta.abilities).toEqual([{ subject: 'all', action: 'manage' }]);
    expect(meta.extensions).toEqual([
      {
        id: 'acme.reports',
        version: '1.0.0',
        settings: { theme: 'dark' },
      },
    ]);
  });

  it('excludes extensions that are disabled for the tenant', async () => {
    const { service } = buildService({ enabled: false });

    const meta = await service.getBootMeta();

    expect(meta.extensions).toEqual([]);
  });

  it('returns no extensions when there is no tenant context', async () => {
    const { service, extensionManager } = buildService({
      organizationId: null,
    });

    const meta = await service.getBootMeta();

    expect(meta.extensions).toEqual([]);
    expect(extensionManager.listForOrganization).not.toHaveBeenCalled();
  });

  it('returns no extensions when the extension kernel is not installed', async () => {
    const { service } = buildService({ withExtensions: false });

    const meta = await service.getBootMeta();

    expect(meta.extensions).toEqual([]);
  });
});
