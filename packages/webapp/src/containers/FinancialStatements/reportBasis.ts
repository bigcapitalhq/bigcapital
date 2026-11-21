export type ReportBasis = 'cash' | 'accrual';

/**
 * The basis used when the organization has no accounting basis setting.
 * Matches the server, which resolves a report query without a basis to
 * accrual in that case, so the screen and the numbers never disagree.
 */
export const FALLBACK_REPORT_BASIS: ReportBasis = 'accrual';

/**
 * Resolves the organization accounting basis setting to a report basis.
 * @param {unknown} setting - The `organization.accounting_basis` value.
 * @returns {ReportBasis}
 */
export const resolveReportBasis = (setting: unknown): ReportBasis =>
  setting === 'cash' || setting === 'accrual' ? setting : FALLBACK_REPORT_BASIS;
