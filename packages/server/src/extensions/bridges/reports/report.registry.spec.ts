import { NotFoundException } from '@nestjs/common';
import type {
  AccountingQueryFacade,
  ReportProvider,
} from '@bigcapital/extension-sdk/bridges';
import { ReportRegistry } from './report.registry';

const queryFacade: AccountingQueryFacade = {
  accounts: { list: async () => [] },
  ledger: { entries: async () => [] },
  transactions: { list: async () => [] },
  contacts: { list: async () => [] },
  items: { list: async () => [] },
};

const context = {
  organizationId: 'org-1',
  parameters: {},
  query: queryFacade,
};

const buildProvider = (key: string, reportId: string): ReportProvider => ({
  key,
  list: () => [
    {
      id: reportId,
      name: reportId,
      category: 'custom' as const,
    },
  ],
  run: jest.fn(async (localId: string) => ({
    columns: [],
    rows: [{ id: localId }],
  })),
});

describe('ReportRegistry', () => {
  it('namespaces report ids and routes runs to the provider', async () => {
    const registry = new ReportRegistry();
    const provider = buildProvider('p1', 'revenue');

    registry.register('acme.reports', provider);

    const reports = registry.listReports();

    expect(reports).toHaveLength(1);
    expect(reports[0].id).toBe('ext:acme.reports:p1:revenue');
    expect(reports[0].localId).toBe('revenue');

    const result = await registry.run(reports[0].id, context);

    expect(provider.run).toHaveBeenCalledWith('revenue', context);
    expect(result.rows).toEqual([{ id: 'revenue' }]);
  });

  it('throws for an unknown report', async () => {
    const registry = new ReportRegistry();

    await expect(
      registry.run('ext:acme.reports:p1:missing', context),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('removes providers by owner', () => {
    const registry = new ReportRegistry();

    registry.register('acme.reports', buildProvider('p1', 'a'));
    registry.register('acme.reports', buildProvider('p2', 'b'));

    expect(registry.removeByOwner('acme.reports')).toBe(2);
    expect(registry.listReports()).toHaveLength(0);
  });
});
