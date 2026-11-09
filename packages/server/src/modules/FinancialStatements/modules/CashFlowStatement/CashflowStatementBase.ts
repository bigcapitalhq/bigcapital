import { constant } from 'fp-ts/function';
import { map } from 'lodash';
import { when } from '@/common/fp';
import { Account } from '@/modules/Accounts/models/Account.model';
import { ICashFlowStatementQuery } from './Cashflow.types';
import { FinancialSheet } from '../../common/FinancialSheet';

export class CashflowStatementBase extends FinancialSheet {
  readonly accountsByRootType: Map<string, Account[]>;
  readonly query: ICashFlowStatementQuery;

  // --------------------------------------------
  // # GENERAL UTILITIES
  // --------------------------------------------
  /**
   * Retrieve the expense accounts ids.
   * @return {number[]}
   */
  public getAccountsIdsByType = (accountType: string): number[] => {
    const expenseAccounts = this.accountsByRootType.get(accountType);
    const expenseAccountsIds = map(expenseAccounts, 'id');

    return expenseAccountsIds;
  };

  /**
   * Detarmines the given display columns by type.
   * @param {string} displayColumnsBy
   * @returns {boolean}
   */
  public isDisplayColumnsBy = (displayColumnsBy: string): boolean => {
    return this.query.displayColumnsType === displayColumnsBy;
  };

  /**
   * Adjustments the given amount.
   * @param {string} direction
   * @param {number} amount -
   * @return {number}
   */
  public amountAdjustment = (direction: string, amount): number => {
    return when(
      constant(direction === 'mines'),
      (value: number) => value * -1,
    )(amount);
  };
}
