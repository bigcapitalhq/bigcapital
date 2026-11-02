import { ExtensionReportsController } from './extension-reports.controller';

const buildController = () => {
  const reports = {
    run: jest.fn().mockResolvedValue({ columns: [], rows: [] }),
  };
  const accountingQuery = {
    accounts: { list: jest.fn() },
    ledger: { entries: jest.fn() },
    transactions: { list: jest.fn() },
    contacts: { list: jest.fn() },
    items: { list: jest.fn() },
  };
  const cls = {
    get: jest.fn((key: string) => (key === 'organizationId' ? 'org-1' : 7)),
  };

  return {
    controller: new ExtensionReportsController(
      reports as any,
      accountingQuery as any,
      cls as any,
    ),
    reports,
  };
};

describe('ExtensionReportsController', () => {
  it('runs the namespaced report with tenant context', async () => {
    const { controller, reports } = buildController();

    const result = await controller.run(
      'bigcapital.example-reports',
      'default',
      'revenue-by-customer',
      { from: '2026-01-01', to: '2026-12-31' },
    );

    expect(reports.run).toHaveBeenCalledWith(
      'ext:bigcapital.example-reports:default:revenue-by-customer',
      expect.objectContaining({
        organizationId: 'org-1',
        userId: 7,
        parameters: {
          from: '2026-01-01',
          to: '2026-12-31',
        },
      }),
    );
    expect(result).toEqual({ columns: [], rows: [] });
  });
});
