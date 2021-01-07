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
  get defaultQuery() {
    return {
      asDate: moment().format('YYYY-MM-DD'),
      agingDaysBefore: 30,
      agingPeriods: 3,
      numberFormat: {
        no_cents: false,
        divide_1000: false,
      },
      customersIds: [],
      noneZero: false,
    };
  }

  /**
   * 
   * @param {number} tenantId
   * @param query
   */
  async ARAgingSummary(tenantId: number, query: IARAgingSummaryQuery) {
    const {
      customerRepository,
      saleInvoiceRepository
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
    const customers = await customerRepository.all();

    // Retrieve all due sale invoices.
    const dueSaleInvoices = await saleInvoiceRepository.dueInvoices();

    // AR aging summary report instance.
    const ARAgingSummaryReport = new ARAgingSummarySheet(
      tenantId,
      filter,
      customers,
      dueSaleInvoices,
      baseCurrency
    );
    // AR aging summary report data and columns.
    const data = ARAgingSummaryReport.reportData();
    const columns = ARAgingSummaryReport.reportColumns();

    return { data, columns, query: filter };
  }
}
