import moment from 'moment';
import { Inject, Service } from 'typedi';
import { isEmpty } from 'lodash';
import { IAPAgingSummaryQuery, IAPAgingSummarySheet } from '@/interfaces';
import TenancyService from '@/services/Tenancy/TenancyService';
import APAgingSummarySheet from './APAgingSummarySheet';
import { Tenant } from '@/system/models';
import { APAgingSummaryMeta } from './APAgingSummaryMeta';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import events from '@/subscribers/events';

@Service()
export class APAgingSummaryService {
  @Inject()
  private tenancy: TenancyService;

  @Inject()
  private APAgingSummaryMeta: APAgingSummaryMeta;

  @Inject()
  private eventPublisher: EventPublisher;

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
   * Retrieve A/P aging summary report.
   * @param {number} tenantId -
   * @param {IAPAgingSummaryQuery} query -
   * @returns {Promise<IAPAgingSummarySheet>}
   */
  public async APAgingSummary(
    tenantId: number,
    query: IAPAgingSummaryQuery
  ): Promise<IAPAgingSummarySheet> {
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

    // Retrieve the aging summary report meta.
    const meta = await this.APAgingSummaryMeta.meta(tenantId, filter);

    // Triggers `onPayableAgingViewed` event.
    await this.eventPublisher.emitAsync(events.reports.onPayableAgingViewed, {
      tenantId,
      query,
    });

    return {
      data,
      columns,
      query: filter,
      meta,
    };
  }
}
