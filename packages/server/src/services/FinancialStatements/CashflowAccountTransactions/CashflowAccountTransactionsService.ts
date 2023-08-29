import { Service, Inject } from 'typedi';
import { includes } from 'lodash';
import * as qim from 'qim';
import { ICashflowAccountTransactionsQuery, IAccount } from '@/interfaces';
import TenancyService from '@/services/Tenancy/TenancyService';
import FinancialSheet from '../FinancialSheet';
import CashflowAccountTransactionsRepo from './CashflowAccountTransactionsRepo';
import CashflowAccountTransactionsReport from './CashflowAccountTransactions';
import { ACCOUNT_TYPE } from '@/data/AccountTypes';
import { ServiceError } from '@/exceptions';
import { ERRORS } from './constants';
import I18nService from '@/services/I18n/I18nService';

@Service()
export default class CashflowAccountTransactionsService extends FinancialSheet {
  @Inject()
  tenancy: TenancyService;

  @Inject()
  cashflowTransactionsRepo: CashflowAccountTransactionsRepo;

  @Inject()
  i18nService: I18nService;

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
    const { Account } = this.tenancy.models(tenantId);
    const parsedQuery = { ...this.defaultQuery, ...query };

    // Retrieve the given account or throw not found service error.
    const account = await Account.query().findById(parsedQuery.accountId);

    // Validates the cashflow account type.
    this.validateCashflowAccountType(account);

    // Retrieve the cashflow account transactions.
    const { results: transactions, pagination } =
      await this.cashflowTransactionsRepo.getCashflowAccountTransactions(
        tenantId,
        parsedQuery
      );
    // Retrieve the cashflow account opening balance.
    const openingBalance =
      await this.cashflowTransactionsRepo.getCashflowAccountOpeningBalance(
        tenantId,
        parsedQuery.accountId,
        pagination
      );
    // Retrieve the computed report.
    const report = new CashflowAccountTransactionsReport(
      transactions,
      openingBalance,
      parsedQuery
    );
    const reportTranasctions = report.reportData();

    return {
      transactions: this.i18nService.i18nApply(
        [[qim.$each, 'formattedTransactionType']],
        reportTranasctions,
        tenantId
      ),
      pagination,
    };
  }

  /**
   * Validates the cashflow account type.
   * @param {IAccount} account -
   */
  private validateCashflowAccountType(account: IAccount) {
    const cashflowTypes = [
      ACCOUNT_TYPE.CASH,
      ACCOUNT_TYPE.CREDIT_CARD,
      ACCOUNT_TYPE.BANK,
    ];

    if (!includes(cashflowTypes, account.accountType)) {
      throw new ServiceError(ERRORS.ACCOUNT_ID_HAS_INVALID_TYPE);
    }
  }
}
