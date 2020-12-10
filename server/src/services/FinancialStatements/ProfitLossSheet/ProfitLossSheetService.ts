import { Service, Inject } from 'typedi';
import moment from 'moment';
import Journal from 'services/Accounting/JournalPoster';
import { IProfitLossSheetQuery } from 'interfaces';
import ProfitLossSheet from './ProfitLossSheet';
import TenancyService from 'services/Tenancy/TenancyService';
import AccountsService from 'services/Accounts/AccountsService';

// Profit/Loss sheet service.
@Service()
export default class ProfitLossSheetService {
  @Inject()
  tenancy: TenancyService;

  @Inject('logger')
  logger: any;

  @Inject()
  accountsService: AccountsService;

  /**
   * Default sheet filter query.
   * @return {IBalanceSheetQuery}
   */
  get defaultQuery(): IProfitLossSheetQuery {
    return {
      fromDate: moment().startOf('year').format('YYYY-MM-DD'),
      toDate: moment().endOf('year').format('YYYY-MM-DD'),
      numberFormat: {
        noCents: false,
        divideOn1000: false,
      },
      basis: 'accural',
      noneZero: false,
      noneTransactions: false,
      displayColumnsType: 'total',
      displayColumnsBy: 'month',
      accountsIds: [],
    };
  }

  /**
   * Retrieve profit/loss sheet statement.
   * @param {number} tenantId 
   * @param {IProfitLossSheetQuery} query 
   * @return { }
   */
  async profitLossSheet(tenantId: number, query: IProfitLossSheetQuery) {
    const {
      accountRepository,
      transactionsRepository,
    } = this.tenancy.repositories(tenantId);

    const filter = {
      ...this.defaultQuery,
      ...query,
    };
    this.logger.info('[profit_loss_sheet] trying to calculate the report.', { tenantId, filter });

    // Get the given accounts or throw not found service error.
    if (filter.accountsIds.length > 0) {
      await this.accountsService.getAccountsOrThrowError(tenantId, filter.accountsIds);
    }
    // Settings tenant service.
    const settings = this.tenancy.settings(tenantId);
    const baseCurrency = settings.get({ group: 'organization', key: 'base_currency' });

    // Retrieve all accounts on the storage.
    const accounts = await accountRepository.allAccounts('type');
    const accountsGraph = await accountRepository.getDependencyGraph();

    // Retrieve all journal transactions based on the given query.
    const transactions = await transactionsRepository.journal({
      fromDate: query.fromDate,
      toDate: query.toDate,
    });
    // Transform transactions to journal collection.
    const transactionsJournal = Journal.fromTransactions(transactions, tenantId, accountsGraph);

    // Profit/Loss report instance.
    const profitLossInstance = new ProfitLossSheet(
      tenantId,
      filter,
      accounts,
      transactionsJournal,
      baseCurrency
    );
    // Profit/loss report data and collumns.
    const profitLossData = profitLossInstance.reportData();
    const profitLossColumns = profitLossInstance.reportColumns();

    return {
      data: profitLossData,
      columns: profitLossColumns,
      query: filter,
    };
  }
}