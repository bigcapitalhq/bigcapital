// @ts-nocheck
import * as R from 'ramda';
import { map } from 'lodash';
import { Account } from "@/modules/Accounts/models/Account.model";
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
  public amountAdjustment = (direction: 'mines' | 'plus', amount): number => {
    return R.when(
      R.always(R.equals(direction, 'mines')),
      R.multiply(-1),
    )(amount);
  };
}
