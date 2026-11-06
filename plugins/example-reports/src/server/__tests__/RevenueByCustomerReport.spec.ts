import { describe, expect, it } from 'vitest';
import type {
  AccountingQueryFacade,
  ReportContext,
} from '@bigcapital/extension-sdk/bridges';
import {
  REVENUE_BY_CUSTOMER_REPORT_ID,
  revenueByCustomerReport,
} from '../RevenueByCustomerReport';

const buildQuery = (): AccountingQueryFacade => ({
  accounts: { list: async () => [] },
  ledger: { entries: async () => [] },
  transactions: {
    list: async () => [
      { customerId: 1, total: 100 },
      { customerId: 1, total: 50 },
      { customerId: 2, total: 75 },
    ],
  },
  contacts: {
    list: async () => [
      { id: 1, displayName: 'Acme' },
      { id: 2, firstName: 'Beta', lastName: 'Industries' },
    ],
  },
  items: { list: async () => [] },
});

const buildContext = (): ReportContext => ({
  organizationId: 'org-1',
  parameters: { from: '2026-01-01', to: '2026-12-31' },
  query: buildQuery(),
});

describe('revenueByCustomerReport', () => {
  it('aggregates revenue by customer and sorts descending', async () => {
    const result = await revenueByCustomerReport.run(
      REVENUE_BY_CUSTOMER_REPORT_ID,
      buildContext(),
    );

    expect(result.columns).toEqual([
      { key: 'customer', label: 'Customer' },
      { key: 'total', label: 'Revenue' },
    ]);
    expect(result.rows).toEqual([
      { customerId: 1, customer: 'Acme', total: 150 },
      {
        customerId: 2,
        customer: 'Beta Industries',
        total: 75,
      },
    ]);
    expect(result.meta).toEqual({
      from: '2026-01-01',
      to: '2026-12-31',
    });
  });

  it('rejects an unknown report id', async () => {
    await expect(
      revenueByCustomerReport.run('unknown', buildContext()),
    ).rejects.toThrow(/Unknown example report/);
  });
});
