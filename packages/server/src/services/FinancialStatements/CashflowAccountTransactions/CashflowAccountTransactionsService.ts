import { Service, Inject } from 'typedi';
import * as qim from 'qim';
import { ICashflowAccountTransactionsQuery, IAccount } from '@/interfaces';
import TenancyService from '@/services/Tenancy/TenancyService';
import FinancialSheet from '../FinancialSheet';
import { CashflowAccountTransactionReport } from './CashflowAccountTransactions';
import I18nService from '@/services/I18n/I18nService';
import { CashflowAccountTransactionsRepo } from './CashflowAccountTransactionsRepo';

@Service()
export default class CashflowAccountTransactionsService extends FinancialSheet {
  @Inject()
  private tenancy: TenancyService;

  /**
   * Defaults balance sheet filter query.
   * @return {IBalanceSheetQuery}
   */
  private get defaultQuery(): Partial<ICashflowAccountTransactionsQuery> {
    return {
      pageSize: 50,
      page: 1,
      numberFormat: {
        precision: 2,
        divideOn1000: false,
        showZero: false,
        formatMoney: 'total',
        negativeFormat: 'mines',
      },
    };
  }

  /**
   * Retrieve the cashflow account transactions report data.
   * @param {number} tenantId -
   * @param {ICashflowAccountTransactionsQuery} query -
   * @return {Promise<IInvetoryItemDetailDOO>}
   */
  public async cashflowAccountTransactions(
    tenantId: number,
    query: ICashflowAccountTransactionsQuery
  ) {
    const models = this.tenancy.models(tenantId);
    const parsedQuery = { ...this.defaultQuery, ...query };

    // Initalize the bank transactions report repository.
    const cashflowTransactionsRepo = new CashflowAccountTransactionsRepo(
      models,
      parsedQuery
    );
    await cashflowTransactionsRepo.asyncInit();

    // Retrieve the computed report.
    const report = new CashflowAccountTransactionReport(
      cashflowTransactionsRepo,
      parsedQuery
    );
    const transactions = report.reportData();
    const pagination = cashflowTransactionsRepo.pagination;

    return { transactions, pagination };
  }
}
