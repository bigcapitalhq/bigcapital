import { WorkspaceTransformer } from './WorkspaceTransformer';
import { OrgFinancialTotalsMap } from '@/modules/Analytics/Analytics.constants';

const buildMembership = (overrides: any = {}) =>
  ({
    role: 'owner',
    tenant: {
      organizationId: 'org-1',
      isReady: true,
      isBuildRunning: false,
      isDeleting: false,
      isActive: true,
      metadata: {
        name: 'Org One',
        baseCurrency: 'USD',
      },
      ...overrides,
    },
    ...overrides,
  }) as any;

const totalsMap = (entries: Record<string, any>): OrgFinancialTotalsMap => {
  return new Map(Object.entries(entries));
};

describe('WorkspaceTransformer', () => {
  it('returns the financial totals of the organization', () => {
    const transformer = new WorkspaceTransformer();
    transformer.setOptions({
      financialTotals: totalsMap({
        'org-1': { totalAssets: 150.5, totalLiabilities: 50.25 },
      }),
    });

    const dto = transformer.transform(buildMembership());

    expect(dto.totalAssets).toBe(150.5);
    expect(dto.totalLiabilities).toBe(50.25);
  });

  it('formats the financial totals with the organization base currency', () => {
    const transformer = new WorkspaceTransformer();
    transformer.setOptions({
      financialTotals: totalsMap({
        'org-1': { totalAssets: 150.5, totalLiabilities: 50.25 },
      }),
    });

    const dto = transformer.transform(buildMembership());

    expect(dto.formattedTotalAssets).toBe('$150.50');
    expect(dto.formattedTotalLiabilities).toBe('$50.25');
  });

  it('returns undefined totals and dash when the organization has no totals', () => {
    const transformer = new WorkspaceTransformer();
    transformer.setOptions({ financialTotals: totalsMap({}) });

    const dto = transformer.transform(buildMembership());

    expect(dto.totalAssets).toBeUndefined();
    expect(dto.totalLiabilities).toBeUndefined();
    expect(dto.formattedTotalAssets).toBe('-');
    expect(dto.formattedTotalLiabilities).toBe('-');
  });

  it('returns dash when the financial totals option is missing', () => {
    const transformer = new WorkspaceTransformer();

    const dto = transformer.transform(buildMembership());

    expect(dto.totalAssets).toBeUndefined();
    expect(dto.formattedTotalAssets).toBe('-');
  });

  it('returns dash when the organization has no tenant relation', () => {
    const transformer = new WorkspaceTransformer();
    transformer.setOptions({
      financialTotals: totalsMap({
        'org-1': { totalAssets: 150.5, totalLiabilities: 50.25 },
      }),
    });

    const dto = transformer.transform(buildMembership({ tenant: null }));

    expect(dto.totalAssets).toBeUndefined();
    expect(dto.formattedTotalAssets).toBe('-');
  });
});
