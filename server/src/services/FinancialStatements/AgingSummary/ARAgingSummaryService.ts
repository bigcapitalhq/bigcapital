import moment from 'moment';
import { Inject, Service } from 'typedi';
import { IARAgingSummaryQuery } from 'interfaces';
import TenancyService from 'services/Tenancy/TenancyService';
import ARAgingSummarySheet from './ARAgingSummarySheet';

@Service()
export default class ARAgingSummaryService {
  @Inject()
  tenancy: TenancyService;

  @Inject('logger')
  logger: any;

  /**
   * Default report query.
   */
  get defaultQuery(): IARAgingSummaryQuery {
    return {
      asDate: moment().format('YYYY-MM-DD'),
      agingDaysBefore: 30,
      agingPeriods: 3,
      numberFormat: {
        divideOn1000: false,
        negativeFormat: 'mines',
        showZero: false,
        formatMoney: 'total',
        precision: 2,
      },
      customersIds: [],
      noneZero: false,
    };
  }

  /**
   * Retrieve A/R aging summary report.
   * @param {number} tenantId - Tenant id.
   * @param {IARAgingSummaryQuery} query -
   */
  async ARAgingSummary(tenantId: number, query: IARAgingSummaryQuery) {
    const {
      customerRepository,
      saleInvoiceRepository,
    } = this.tenancy.repositories(tenantId);

    const filter = {
      ...this.defaultQuery,
      ...query,
    };
    this.logger.info('[AR_Aging_Summary] try to calculate the report.', {
      tenantId,
      filter,
    });
    // Settings tenant service.
    const settings = this.tenancy.settings(tenantId);

    const baseCurrency = settings.get({
      group: 'organization',
      key: 'base_currency',
    });
    // Retrieve all customers from the storage.
    const customers =
      filter.customersIds.length > 0
        ? await customerRepository.findWhereIn('id', filter.customersIds)
        : await customerRepository.all();

    // Retrieve all overdue sale invoices.
    const overdueSaleInvoices = await saleInvoiceRepository.overdueInvoices(
      filter.asDate
    );
    // Retrieve all due sale invoices.
    const currentInvoices = await saleInvoiceRepository.dueInvoices(
      filter.asDate
    );
    // AR aging summary report instance.
    const ARAgingSummaryReport = new ARAgingSummarySheet(
      tenantId,
      filter,
      customers,
      overdueSaleInvoices,
      currentInvoices,
      baseCurrency
    );
    // AR aging summary report data and columns.
    const data = ARAgingSummaryReport.reportData();
    const columns = ARAgingSummaryReport.reportColumns();

    return { data, columns, query: filter };
  }
}
