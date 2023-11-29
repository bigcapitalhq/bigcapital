import moment from 'moment';
import { Inject, Service } from 'typedi';
import { isEmpty } from 'lodash';
import { IAPAgingSummaryQuery, IARAgingSummaryMeta } from '@/interfaces';
import TenancyService from '@/services/Tenancy/TenancyService';
import APAgingSummarySheet from './APAgingSummarySheet';
import { Tenant } from '@/system/models';

@Service()
export class APAgingSummaryService {
  @Inject()
  tenancy: TenancyService;

  @Inject('logger')
  logger: any;

  /**
   * Default report query.
   */
  private get defaultQuery(): IAPAgingSummaryQuery {
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
      branchesIds: [],
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
    const { Bill } = this.tenancy.models(tenantId);
    const { vendorRepository } = this.tenancy.repositories(tenantId);

    const filter = {
      ...this.defaultQuery,
      ...query,
    };
    // Settings tenant service.
    const tenant = await Tenant.query()
      .findById(tenantId)
      .withGraphFetched('metadata');

    // Retrieve all vendors from the storage.
    const vendors =
      filter.vendorsIds.length > 0
        ? await vendorRepository.findWhereIn('id', filter.vendorsIds)
        : await vendorRepository.all();

    // Common query.
    const commonQuery = (query) => {
      if (!isEmpty(filter.branchesIds)) {
        query.modify('filterByBranches', filter.branchesIds);
      }
    };
    // Retrieve all overdue vendors bills.
    const overdueBills = await Bill.query()
      .modify('overdueBillsFromDate', filter.asDate)
      .onBuild(commonQuery);

    // Retrieve all due vendors bills.
    const dueBills = await Bill.query()
      .modify('dueBillsFromDate', filter.asDate)
      .onBuild(commonQuery);

    // A/P aging summary report instance.
    const APAgingSummaryReport = new APAgingSummarySheet(
      tenantId,
      filter,
      vendors,
      overdueBills,
      dueBills,
      tenant.metadata.baseCurrency
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
