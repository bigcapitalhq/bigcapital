import { Service, Inject } from 'typedi';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { ICashflowAccountTransactionsQuery, IPaginationMeta } from '@/interfaces';

@Service()
export default class CashflowAccountTransactionsRepo {
  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Retrieve the cashflow account transactions.
   * @param {number} tenantId -
   * @param {ICashflowAccountTransactionsQuery} query -
   */
  async getCashflowAccountTransactions(
    tenantId: number,
    query: ICashflowAccountTransactionsQuery
  ) {
    const { AccountTransaction } = this.tenancy.models(tenantId);

    return AccountTransaction.query()
      .where('account_id', query.accountId)
      .orderBy([
        { column: 'date', order: 'desc' },
        { column: 'created_at', order: 'desc' },
      ])
      .pagination(query.page - 1, query.pageSize);
  }

  /**
   * Retrieve the cashflow account opening balance.
   * @param {number} tenantId
   * @param {number} accountId
   * @param {IPaginationMeta} pagination
   * @return {Promise<number>}
   */
  async getCashflowAccountOpeningBalance(
    tenantId: number,
    accountId: number,
    pagination: IPaginationMeta
  ): Promise<number> {
    const { AccountTransaction } = this.tenancy.models(tenantId);

    // Retrieve the opening balance of credit and debit balances.
    const openingBalancesSubquery = AccountTransaction.query()
      .where('account_id', accountId)
      .orderBy([
        { column: 'date', order: 'desc' },
        { column: 'created_at', order: 'desc' },
      ])
      .limit(pagination.total)
      .offset(pagination.pageSize * (pagination.page - 1));

    // Summation of credit and debit balance.
    const openingBalances = await AccountTransaction.query()
      .sum('credit as credit')
      .sum('debit as debit')
      .from(openingBalancesSubquery.as('T'))
      .first();

    const openingBalance = openingBalances.debit - openingBalances.credit;

    return openingBalance;
  }
}
