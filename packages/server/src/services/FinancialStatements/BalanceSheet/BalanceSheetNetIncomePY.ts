import * as R from 'ramda';
import {
  IBalanceSheetDataNode,
  IBalanceSheetNetIncomeNode,
} from '@/interfaces';
import { BalanceSheetComparsionPreviousYear } from './BalanceSheetComparsionPreviousYear';
import { BalanceSheetComparsionPreviousPeriod } from './BalanceSheetComparsionPreviousPeriod';
import { FinancialPreviousPeriod } from '../FinancialPreviousPeriod';
import { FinancialHorizTotals } from '../FinancialHorizTotals';
import BalanceSheetRepository from './BalanceSheetRepository';
import { BalanceSheetQuery } from './BalanceSheetQuery';

export const BalanceSheetNetIncomePY = (Base: any) =>
  class extends R.compose(
    BalanceSheetComparsionPreviousYear,
    BalanceSheetComparsionPreviousPeriod,
    FinancialPreviousPeriod,
    FinancialHorizTotals
  )(Base) {
    private repository: BalanceSheetRepository;
    private query: BalanceSheetQuery;

    // ------------------------------
    // # Previous Year (PY)
    // ------------------------------
    /**
     * Retrieves the previous year (PY) net income.
     * @returns {number}
     */
    protected getPreviousYearNetIncome = () => {
      const income =
        this.repository.incomePYTotalAccountsLedger.getClosingBalance();
      const expense =
        this.repository.expensePYTotalAccountsLedger.getClosingBalance();

      return income - expense;
    };

    /**
     * Assoc previous year on aggregate node.
     * @param {IBalanceSheetAccountNode} node
     * @returns {IBalanceSheetAccountNode}
     */
    protected assocPreviousYearNetIncomeNode = (
      node: IBalanceSheetNetIncomeNode
    ): IBalanceSheetNetIncomeNode => {
      const total = this.getPreviousYearNetIncome();

      return R.assoc('previousYear', this.getTotalAmountMeta(total), node);
    };

    /**
     * Assoc previous year attributes to aggregate node.
     * @param   {IBalanceSheetAccountNode} node
     * @returns {IBalanceSheetAccountNode}
     */
    protected previousYearNetIncomeNodeCompose = (
      node: IBalanceSheetNetIncomeNode
    ): IBalanceSheetNetIncomeNode => {
      return R.compose(
        R.when(
          this.query.isPreviousYearPercentageActive,
          this.assocPreviousYearTotalPercentageNode
        ),
        R.when(
          this.query.isPreviousYearChangeActive,
          this.assocPreviousYearTotalChangeNode
        ),
        R.when(
          this.isNodeHasHorizontalTotals,
          this.assocPreviousYearAggregateHorizNode
        ),
        this.assocPreviousYearNetIncomeNode
      )(node);
    };
  };
