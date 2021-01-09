import moment from 'moment';
import { Inject, Service } from 'typedi';
import TenancyService from 'services/Tenancy/TenancyService';
import APAgingSummarySheet from './APAgingSummarySheet';

@Service()
export default class PayableAgingSummaryService {
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
        noCents: false,
        divideOn1000: false,
      },
      vendorsIds: [],
      noneZero: false,
    }
  }

  /**
   * 
   * @param {number} tenantId 
   * @param query 
   */
  async APAgingSummary(tenantId: number, query) {
    const {
      vendorRepository,
      billRepository
    } = this.tenancy.repositories(tenantId);
    const { Bill } = this.tenancy.models(tenantId);

    const filter = {
      ...this.defaultQuery,
      ...query,
    };
    this.logger.info('[AR_Aging_Summary] trying to prepairing the report.', {
      tenantId, filter,
    });
    // Settings tenant service.
    const settings = this.tenancy.settings(tenantId);
    const baseCurrency = settings.get({
      group: 'organization',
      key: 'base_currency',
    });
    // Retrieve all vendors from the storage.
    const vendors = await vendorRepository.all();

    // Retrieve all overdue vendors bills.
    const overdueBills = await billRepository.overdueBills(
      filter.asDate,
    );
    const dueBills = await billRepository.dueBills(filter.asDate);

    // A/P aging summary report instance.
    const APAgingSummaryReport = new APAgingSummarySheet(
      tenantId,
      filter,
      vendors,
      overdueBills,
      dueBills,
      baseCurrency,
    );
    // A/P aging summary report data and columns.
    const data = APAgingSummaryReport.reportData();
    const columns = APAgingSummaryReport.reportColumns();

    return { data, columns, query: filter };
  }
}