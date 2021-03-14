import moment from 'moment';
import { Inject, Service } from 'typedi';
import { IAPAgingSummaryQuery, IARAgingSummaryMeta } from 'interfaces';
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
  get defaultQuery(): IAPAgingSummaryQuery {
    return {
      asDate: moment().format('YYYY-MM-DD'),
      agingDaysBefore: 30,
      agingPeriods: 3,
      numberFormat: {
        precision: 2,
        divideOn1000: false,
        showZero: false,
        formatMoney: 'total',
        negativeFormat: 'mines',
      },
      vendorsIds: [],
      noneZero: false,
    };
  }

  /**
   * Retrieve the balance sheet meta.
   * @param {number} tenantId -
   * @returns {IBalanceSheetMeta}
   */
  reportMetadata(tenantId: number): IARAgingSummaryMeta {
    const settings = this.tenancy.settings(tenantId);

    const organizationName = settings.get({
      group: 'organization',
      key: 'name',
    });
    const baseCurrency = settings.get({
      group: 'organization',
      key: 'base_currency',
    });

    return {
      organizationName,
      baseCurrency,
    };
  }

  /**
   * Retrieve A/P aging summary report.
   * @param {number} tenantId -
   * @param {IAPAgingSummaryQuery} query -
   */
  async APAgingSummary(tenantId: number, query: IAPAgingSummaryQuery) {
    const { vendorRepository, billRepository } = this.tenancy.repositories(
      tenantId
    );

    const filter = {
      ...this.defaultQuery,
      ...query,
    };
    this.logger.info('[AR_Aging_Summary] trying to prepairing the report.', {
      tenantId,
      filter,
    });
    // Settings tenant service.
    const settings = this.tenancy.settings(tenantId);
    const baseCurrency = settings.get({
      group: 'organization',
      key: 'base_currency',
    });
    // Retrieve all vendors from the storage.
    const vendors =
      filter.vendorsIds.length > 0
        ? await vendorRepository.findWhereIn('id', filter.vendorsIds)
        : await vendorRepository.all();

    // Retrieve all overdue vendors bills.
    const overdueBills = await billRepository.overdueBills(filter.asDate);

    // Retrieve all due vendors bills.
    const dueBills = await billRepository.dueBills(filter.asDate);

    // A/P aging summary report instance.
    const APAgingSummaryReport = new APAgingSummarySheet(
      tenantId,
      filter,
      vendors,
      overdueBills,
      dueBills,
      baseCurrency
    );
    // A/P aging summary report data and columns.
    const data = APAgingSummaryReport.reportData();
    const columns = APAgingSummaryReport.reportColumns();

    return {
      data,
      columns,
      query: filter,
      meta: this.reportMetadata(tenantId),
    };
  }
}
