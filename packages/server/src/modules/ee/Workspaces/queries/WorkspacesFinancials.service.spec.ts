import { WorkspacesFinancialsService } from './WorkspacesFinancials.service';

describe('WorkspacesFinancialsService', () => {
  const makeService = (options: {
    enabled?: boolean;
    clickhouseTotals?: Map<string, any> | Error;
    tenantRows?: Map<string, any[]> | Error;
  }) => {
    const schemaService = {
      isEnabled: () => options.enabled ?? false,
    } as any;

    const ledgerAnalyticsSync = {
      getFinancialTotals: jest.fn(() =>
        options.clickhouseTotals instanceof Error
          ? Promise.reject(options.clickhouseTotals)
          : Promise.resolve(options.clickhouseTotals ?? new Map()),
      ),
      fetchTenantBalanceRows: jest.fn((organizationId: string) =>
        options.tenantRows instanceof Error
          ? Promise.reject(options.tenantRows)
          : Promise.resolve(options.tenantRows?.get(organizationId) ?? []),
      ),
    } as any;

    return {
      service: new WorkspacesFinancialsService(
        ledgerAnalyticsSync,
        schemaService,
      ),
      ledgerAnalyticsSync,
    };
  };

  it('returns the ClickHouse totals of all the organizations', async () => {
    const { service, ledgerAnalyticsSync } = makeService({
      enabled: true,
      clickhouseTotals: new Map([
        ['org-1', { totalAssets: 100, totalLiabilities: 10 }],
        ['org-2', { totalAssets: 200, totalLiabilities: 20 }],
      ]),
    });

    const totals = await service.getTotals(['org-1', 'org-2']);

    expect(totals.get('org-1')).toEqual({
      totalAssets: 100,
      totalLiabilities: 10,
    });
    expect(totals.get('org-2')).toEqual({
      totalAssets: 200,
      totalLiabilities: 20,
    });
    expect(ledgerAnalyticsSync.fetchTenantBalanceRows).not.toHaveBeenCalled();
  });

  it('falls back to the tenant database of the organizations missing from ClickHouse', async () => {
    const { service } = makeService({
      enabled: true,
      clickhouseTotals: new Map([
        ['org-1', { totalAssets: 100, totalLiabilities: 10 }],
      ]),
      tenantRows: new Map([
        [
          'org-2',
          [
            {
              organizationId: 'org-2',
              accountType: 'bank',
              accountNormal: 'debit',
              active: 1,
              credit: 0,
              debit: 75,
            },
          ],
        ],
      ]),
    });

    const totals = await service.getTotals(['org-1', 'org-2']);

    expect(totals.get('org-1')).toEqual({
      totalAssets: 100,
      totalLiabilities: 10,
    });
    expect(totals.get('org-2')).toEqual({
      totalAssets: 75,
      totalLiabilities: 0,
    });
  });

  it('falls back to the tenant databases when ClickHouse is disabled', async () => {
    const { service, ledgerAnalyticsSync } = makeService({
      enabled: false,
      tenantRows: new Map([
        [
          'org-1',
          [
            {
              organizationId: 'org-1',
              accountType: 'accounts-payable',
              accountNormal: 'credit',
              active: 1,
              credit: 60,
              debit: 0,
            },
          ],
        ],
      ]),
    });

    const totals = await service.getTotals(['org-1']);

    expect(totals.get('org-1')).toEqual({
      totalAssets: 0,
      totalLiabilities: 60,
    });
    expect(ledgerAnalyticsSync.getFinancialTotals).not.toHaveBeenCalled();
  });

  it('falls back to the tenant databases when ClickHouse query fails', async () => {
    const { service } = makeService({
      enabled: true,
      clickhouseTotals: new Error('ClickHouse is down'),
      tenantRows: new Map([
        [
          'org-1',
          [
            {
              organizationId: 'org-1',
              accountType: 'bank',
              accountNormal: 'debit',
              active: 1,
              credit: 0,
              debit: 100,
            },
          ],
        ],
      ]),
    });

    const totals = await service.getTotals(['org-1']);

    expect(totals.get('org-1')).toEqual({
      totalAssets: 100,
      totalLiabilities: 0,
    });
  });

  it('omits the organizations whose tenant database is unreachable', async () => {
    const { service } = makeService({
      enabled: false,
      tenantRows: new Error('Unknown database'),
    });

    const totals = await service.getTotals(['org-1']);

    expect(totals.has('org-1')).toBe(false);
  });

  it('defaults the totals of an organization without transactions', async () => {
    const { service } = makeService({
      enabled: false,
      tenantRows: new Map([['org-1', []]]),
    });

    const totals = await service.getTotals(['org-1']);

    expect(totals.get('org-1')).toEqual({
      totalAssets: 0,
      totalLiabilities: 0,
    });
  });

  it('returns an empty map for empty organizations', async () => {
    const { service, ledgerAnalyticsSync } = makeService({ enabled: true });

    const totals = await service.getTotals([]);

    expect(totals.size).toBe(0);
    expect(ledgerAnalyticsSync.getFinancialTotals).not.toHaveBeenCalled();
  });
});
