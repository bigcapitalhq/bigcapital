import * as R from 'ramda';
import {
  IBalanceSheetDataNode,
  IBalanceSheetNetIncomeNode,
} from './BalanceSheet.types';
import { BalanceSheetComparsionPreviousPeriod } from './BalanceSheetComparsionPreviousPeriod';
import { FinancialPreviousPeriod } from '../../common/FinancialPreviousPeriod';
import { FinancialHorizTotals } from '../../common/FinancialHorizTotals';
import { BalanceSheetRepository } from './BalanceSheetRepository';
import { BalanceSheetQuery } from './BalanceSheetQuery';
import { BalanceSheetNetIncomeDatePeriodsPP } from './BalanceSheetNetIncomeDatePeriodsPP';

export const BalanceSheetNetIncomePP = (Base: any) =>
  class extends R.compose(
    BalanceSheetNetIncomeDatePeriodsPP,
    BalanceSheetComparsionPreviousPeriod,
    FinancialPreviousPeriod,
    FinancialHorizTotals,
  )(Base) {
    public repository: BalanceSheetRepository;
    public query: BalanceSheetQuery;

    // -------------------------------
    // # Previous Period (PP)
    // -------------------------------
    /**
     * Retrieves the PP net income.
     * @returns {}
     */
    public getPreviousPeriodNetIncome = () => {
      const income = this.repository.incomePPAccountsLedger.getClosingBalance();
      const expense =
        this.repository.expensePPAccountsLedger.getClosingBalance();

      return income - expense;
    };

    /**
     * Associates the previous period to account node.
     * @param {IBalanceSheetDataNode} node
     * @returns {IBalanceSheetDataNode}
     */
    public assocPreviousPeriodNetIncomeNode = (
      node: IBalanceSheetDataNode,
    ): IBalanceSheetDataNode => {
      const total = this.getPreviousPeriodNetIncome();

      return R.assoc('previousPeriod', this.getAmountMeta(total), node);
    };

    /**
     * Previous period account node composer.
     * @param {IBalanceSheetNetIncomeNode} node
     * @returns {IBalanceSheetNetIncomeNode}
     */
    public previousPeriodNetIncomeNodeCompose = (
      node: IBalanceSheetNetIncomeNode,
    ): IBalanceSheetNetIncomeNode => {
      return R.compose(
        R.when(
          this.isNodeHasHorizTotals,
          this.assocPreviousPeriodNetIncomeHorizNode,
        ),
        R.when(
          this.query.isPreviousPeriodPercentageActive,
          this.assocPreviousPeriodPercentageNode,
        ),
        R.when(
          this.query.isPreviousPeriodChangeActive,
          this.assocPreviousPeriodChangeNode,
        ),
        this.assocPreviousPeriodNetIncomeNode,
      )(node);
    };
  };
