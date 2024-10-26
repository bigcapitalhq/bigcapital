import { Inject } from 'typedi';
import moment from 'moment';
import * as R from 'ramda';
import TenancyService from '@/services/Tenancy/TenancyService';
import {
  ITransactionsByVendorsService,
  ITransactionsByVendorsFilter,
  ITransactionsByVendorsStatement,
  ILedgerEntry,
} from '@/interfaces';
import TransactionsByVendor from './TransactionsByVendor';
import Ledger from '@/services/Accounting/Ledger';
import TransactionsByVendorRepository from './TransactionsByVendorRepository';
import { Tenant } from '@/system/models';
import { TransactionsByVendorMeta } from './TransactionsByVendorMeta';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import events from '@/subscribers/events';

export class TransactionsByVendorsInjectable
  implements ITransactionsByVendorsService
{
  @Inject()
  private tenancy: TenancyService;

  @Inject()
  private reportRepository: TransactionsByVendorRepository;

  @Inject()
  private transactionsByVendorMeta: TransactionsByVendorMeta;

  @Inject()
  private eventPublisher: EventPublisher;

  /**
   * Defaults balance sheet filter query.
   * @return {IVendorBalanceSummaryQuery}
   */
  get defaultQuery(): ITransactionsByVendorsFilter {
    return {
      fromDate: moment().startOf('month').format('YYYY-MM-DD'),
      toDate: moment().format('YYYY-MM-DD'),
      numberFormat: {
        precision: 2,
        divideOn1000: false,
        showZero: false,
        formatMoney: 'total',
        negativeFormat: 'mines',
      },
      comparison: {
        percentageOfColumn: true,
      },
      noneZero: false,
      noneTransactions: true,
      vendorsIds: [],
    };
  }

  /**
   * Retrieve the customers opening balance transactions.
   * @param {number} tenantId
   * @param {number} openingDate
   * @param {number} customersIds
   * @returns {Promise<ILedgerEntry[]>}
   */
  private async getVendorsOpeningBalanceEntries(
    tenantId: number,
    openingDate: Date,
    customersIds?: number[]
  ): Promise<ILedgerEntry[]> {
    const openingTransactions =
      await this.reportRepository.getVendorsOpeningBalance(
        tenantId,
        openingDate,
        customersIds
      );
    return R.compose(
      R.map(R.assoc('date', openingDate)),
      R.map(R.assoc('accountNormal', 'credit'))
    )(openingTransactions);
  }

  /**
   *
   * @param {number} tenantId
   * @param {Date|string} openingDate
   * @param {number[]} customersIds
   */
  private async getVendorsPeriodEntries(
    tenantId: number,
    fromDate: Date,
    toDate: Date
  ): Promise<ILedgerEntry[]> {
    const transactions =
      await this.reportRepository.getVendorsPeriodTransactions(
        tenantId,
        fromDate,
        toDate
      );
    return R.compose(
      R.map(R.assoc('accountNormal', 'credit')),
      R.map((trans) => ({
        ...trans,
        referenceTypeFormatted: trans.referenceTypeFormatted,
      }))
    )(transactions);
  }

  /**
   * Retrieve the report ledger entries from repository.
   * @param {number} tenantId
   * @param {Date} fromDate
   * @param {Date} toDate
   * @returns {Promise<ILedgerEntry[]>}
   */
  private async getReportEntries(
    tenantId: number,
    fromDate: Date,
    toDate: Date
  ): Promise<ILedgerEntry[]> {
    const openingBalanceDate = moment(fromDate).subtract(1, 'days').toDate();

    return [
      ...(await this.getVendorsOpeningBalanceEntries(
        tenantId,
        openingBalanceDate
      )),
      ...(await this.getVendorsPeriodEntries(tenantId, fromDate, toDate)),
    ];
  }

  /**
   * Retrieve transactions by by the customers.
   * @param {number} tenantId
   * @param {ITransactionsByVendorsFilter} query
   * @return {Promise<ITransactionsByVendorsStatement>}
   */
  public async transactionsByVendors(
    tenantId: number,
    query: ITransactionsByVendorsFilter
  ): Promise<ITransactionsByVendorsStatement> {
    const { accountRepository } = this.tenancy.repositories(tenantId);

    const i18n = this.tenancy.i18n(tenantId);

    const tenant = await Tenant.query()
      .findById(tenantId)
      .withGraphFetched('metadata');

    const filter = { ...this.defaultQuery, ...query };

    // Retrieve the report vendors.
    const vendors = await this.reportRepository.getVendors(
      tenantId,
      filter.vendorsIds
    );
    // Retrieve the accounts graph.
    const accountsGraph = await accountRepository.getDependencyGraph();

    // Journal transactions.
    const reportEntries = await this.getReportEntries(
      tenantId,
      filter.fromDate,
      filter.toDate
    );
    // Ledger collection.
    const journal = new Ledger(reportEntries);

    // Transactions by customers data mapper.
    const reportInstance = new TransactionsByVendor(
      vendors,
      accountsGraph,
      journal,
      filter,
      tenant.metadata.baseCurrency,
      i18n
    );
    const meta = await this.transactionsByVendorMeta.meta(tenantId, filter);

    // Triggers `onVendorTransactionsViewed` event.
    await this.eventPublisher.emitAsync(
      events.reports.onVendorTransactionsViewed,
      {
        tenantId,
        query,
      }
    );

    return {
      data: reportInstance.reportData(),
      query: filter,
      meta,
    };
  }
}
