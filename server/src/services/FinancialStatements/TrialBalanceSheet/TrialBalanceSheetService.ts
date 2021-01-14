import { Service, Inject } from 'typedi';
import moment from 'moment';
import TenancyService from 'services/Tenancy/TenancyService';
import Journal from 'services/Accounting/JournalPoster';
import { INumberFormatQuery, ITrialBalanceSheetQuery, ITrialBalanceStatement } from 'interfaces';
import TrialBalanceSheet from './TrialBalanceSheet';
import FinancialSheet from '../FinancialSheet';

@Service()
export default class TrialBalanceSheetService extends FinancialSheet {
  @Inject()
  tenancy: TenancyService;

  @Inject('logger')
  logger: any;

  /**
   * Defaults trial balance sheet filter query.
   * @return {IBalanceSheetQuery}
   */
  get defaultQuery(): ITrialBalanceSheetQuery {
    return {
      fromDate: moment().startOf('year').format('YYYY-MM-DD'),
      toDate: moment().endOf('year').format('YYYY-MM-DD'),
      numberFormat: {
        divideOn1000: false,
        negativeFormat: 'mines',
        showZero: false,
        formatMoney: 'total',
        precision: 2,
      },
      basis: 'accural',
      noneZero: false,
      noneTransactions: false,
      accountIds: [],
    };
  }

  /**
   * Retrieve trial balance sheet statement.
   * -------------
   * @param {number} tenantId
   * @param {IBalanceSheetQuery} query
   *
   * @return {IBalanceSheetStatement}
   */
  public async trialBalanceSheet(
    tenantId: number,
    query: ITrialBalanceSheetQuery,
  ): Promise<ITrialBalanceStatement> {
    const filter = {
      ...this.defaultQuery,
      ...query,
    };
    const {
      accountRepository,
      transactionsRepository,
    } = this.tenancy.repositories(tenantId);

    // Settings tenant service.
    const settings = this.tenancy.settings(tenantId);
    const baseCurrency = settings.get({
      group: 'organization',
      key: 'base_currency',
    });

    this.logger.info('[trial_balance_sheet] trying to calcualte the report.', {
      tenantId,
      filter,
    });
    // Retrieve all accounts on the storage.
    const accounts = await accountRepository.all('type');
    const accountsGraph = await accountRepository.getDependencyGraph();

    // Retrieve all journal transactions based on the given query.
    const transactions = await transactionsRepository.journal({
      fromDate: query.fromDate,
      toDate: query.toDate,
      sumationCreditDebit: true,
    });
    // Transform transactions array to journal collection.
    const transactionsJournal = Journal.fromTransactions(
      transactions,
      tenantId,
      accountsGraph
    );
    // Trial balance report instance.
    const trialBalanceInstance = new TrialBalanceSheet(
      tenantId,
      filter,
      accounts,
      transactionsJournal,
      baseCurrency
    );
    // Trial balance sheet data.
    const trialBalanceSheetData = trialBalanceInstance.reportData();

    return {
      data: trialBalanceSheetData,
      query: filter,
    };
  }
}
