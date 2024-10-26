import moment from 'moment';
import { Inject, Service } from 'typedi';
import { isEmpty } from 'lodash';
import { IARAgingSummaryQuery } from '@/interfaces';
import TenancyService from '@/services/Tenancy/TenancyService';
import ARAgingSummarySheet from './ARAgingSummarySheet';
import { Tenant } from '@/system/models';
import { ARAgingSummaryMeta } from './ARAgingSummaryMeta';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import events from '@/subscribers/events';

@Service()
export default class ARAgingSummaryService {
  @Inject()
  private tenancy: TenancyService;

  @Inject()
  private ARAgingSummaryMeta: ARAgingSummaryMeta;

  @Inject()
  private eventPublisher: EventPublisher;

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
      branchesIds: [],
      noneZero: false,
    };
  }

  /**
   * Retrieve A/R aging summary report.
   * @param {number} tenantId - Tenant id.
   * @param {IARAgingSummaryQuery} query -
   */
  async ARAgingSummary(tenantId: number, query: IARAgingSummaryQuery) {
    const { SaleInvoice } = this.tenancy.models(tenantId);
    const { customerRepository } = this.tenancy.repositories(tenantId);

    const filter = {
      ...this.defaultQuery,
      ...query,
    };
    const tenant = await Tenant.query()
      .findById(tenantId)
      .withGraphFetched('metadata');

    // Retrieve all customers from the storage.
    const customers =
      filter.customersIds.length > 0
        ? await customerRepository.findWhereIn('id', filter.customersIds)
        : await customerRepository.all();

    // Common query.
    const commonQuery = (query) => {
      if (!isEmpty(filter.branchesIds)) {
        query.modify('filterByBranches', filter.branchesIds);
      }
    };
    // Retrieve all overdue sale invoices.
    const overdueSaleInvoices = await SaleInvoice.query()
      .modify('overdueInvoicesFromDate', filter.asDate)
      .onBuild(commonQuery);

    // Retrieve all due sale invoices.
    const currentInvoices = await SaleInvoice.query()
      .modify('dueInvoicesFromDate', filter.asDate)
      .onBuild(commonQuery);

    // AR aging summary report instance.
    const ARAgingSummaryReport = new ARAgingSummarySheet(
      tenantId,
      filter,
      customers,
      overdueSaleInvoices,
      currentInvoices,
      tenant.metadata.baseCurrency
    );
    // AR aging summary report data and columns.
    const data = ARAgingSummaryReport.reportData();
    const columns = ARAgingSummaryReport.reportColumns();

    // Retrieve the aging summary report meta.
    const meta = await this.ARAgingSummaryMeta.meta(tenantId, filter);

    // Triggers `onReceivableAgingViewed` event.
    await this.eventPublisher.emitAsync(
      events.reports.onReceivableAgingViewed,
      {
        tenantId,
        query,
      }
    );

    return {
      data,
      columns,
      query: filter,
      meta,
    };
  }
}
