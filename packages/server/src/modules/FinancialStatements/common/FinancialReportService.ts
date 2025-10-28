export default class FinancialReportService {
  transformOrganizationMeta(tenant) {
    return {
      organizationName: tenant.metadata?.name,
      baseCurrency: tenant.metadata?.baseCurrency,
    };
  }
}
