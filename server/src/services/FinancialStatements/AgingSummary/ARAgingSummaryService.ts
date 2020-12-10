import moment from 'moment';
import { Inject, Service } from 'typedi';
import { IARAgingSummaryQuery } from 'interfaces';
import TenancyService from 'services/Tenancy/TenancyService';
import Journal from 'services/Accounting/JournalPoster';
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
   * Retreive th accounts receivable aging summary data and columns.
   * @param {number} tenantId 
   * @param query 
   */
  async ARAgingSummary(tenantId: number, query: IARAgingSummaryQuery) {
    const {
      customerRepository,
      accountRepository,
      transactionsRepository,
      accountTypeRepository
    } = this.tenancy.repositories(tenantId);

    const { Account } = this.tenancy.models(tenantId);
    const filter = {
      ...this.defaultQuery,
      ...query,
    };
    this.logger.info('[AR_Aging_Summary] try to calculate the report.', { tenantId, filter });

    // Settings tenant service.
    const settings = this.tenancy.settings(tenantId);
    const baseCurrency = settings.get({ group: 'organization', key: 'base_currency' });

    // Retrieve all accounts graph on the storage.
    const accountsGraph = await accountRepository.getDependencyGraph();

    // Retrieve all customers from the storage.
    const customers = await customerRepository.all();

    // Retrieve AR account type.
    const ARType = await accountTypeRepository.getByKey('accounts_receivable');

    // Retreive AR account.
    const ARAccount = await Account.query().findOne('account_type_id', ARType.id);

    // Retrieve journal transactions based on the given query.
    const transactions = await transactionsRepository.journal({
      toDate: filter.asDate,
      contactType: 'customer',
      contactsIds: customers.map(customer => customer.id),
    });
    // Converts transactions array to journal collection.
    const journal = Journal.fromTransactions(transactions, tenantId, accountsGraph);

    // AR aging summary report instnace.
    const ARAgingSummaryReport = new ARAgingSummarySheet(
      tenantId,
      filter,
      customers,
      journal,
      ARAccount,
      baseCurrency
    );
    // AR aging summary report data and columns.
    const data = ARAgingSummaryReport.reportData();
    const columns = ARAgingSummaryReport.reportColumns();

    return { data, columns };
  }
}