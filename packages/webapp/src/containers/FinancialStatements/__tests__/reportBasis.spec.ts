import { FALLBACK_REPORT_BASIS, resolveReportBasis } from '../reportBasis';

describe('resolveReportBasis', () => {
  it('should use the cash basis of the organization', () => {
    expect(resolveReportBasis('cash')).toBe('cash');
  });

  it('should use the accrual basis of the organization', () => {
    expect(resolveReportBasis('accrual')).toBe('accrual');
  });

  it('should fall back when the setting is missing or unknown', () => {
    expect(FALLBACK_REPORT_BASIS).toBe('accrual');
    expect(resolveReportBasis(undefined)).toBe(FALLBACK_REPORT_BASIS);
    expect(resolveReportBasis(null)).toBe(FALLBACK_REPORT_BASIS);
    expect(resolveReportBasis('')).toBe(FALLBACK_REPORT_BASIS);
    expect(resolveReportBasis('Cash')).toBe(FALLBACK_REPORT_BASIS);
  });
});
