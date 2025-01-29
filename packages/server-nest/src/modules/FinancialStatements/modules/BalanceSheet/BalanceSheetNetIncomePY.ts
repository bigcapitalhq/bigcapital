import * as R from 'ramda';
import { IBalanceSheetNetIncomeNode } from './BalanceSheet.types';
import { BalanceSheetComparsionPreviousYear } from './BalanceSheetComparsionPreviousYear';
import { BalanceSheetComparsionPreviousPeriod } from './BalanceSheetComparsionPreviousPeriod';
import { FinancialPreviousPeriod } from '../../common/FinancialPreviousPeriod';
import { FinancialHorizTotals } from '../../common/FinancialHorizTotals';
import { BalanceSheetRepository } from './BalanceSheetRepository';
import { BalanceSheetQuery } from './BalanceSheetQuery';
import { BalanceSheetNetIncomeDatePeriodsPY } from './BalanceSheetNetIncomeDatePeriodsPY';
import { FinancialSheet } from '../../common/FinancialSheet';
import { GConstructor } from '@/common/types/Constructor';

export const BalanceSheetNetIncomePY = <T extends GConstructor<FinancialSheet>>(
  Base: T,
) =>
  class extends R.pipe(
    BalanceSheetNetIncomeDatePeriodsPY,
    BalanceSheetComparsionPreviousYear,
    BalanceSheetComparsionPreviousPeriod,
    FinancialPreviousPeriod,
    FinancialHorizTotals,
  )(Base) {
    // public repository: BalanceSheetRepository;
    // public query: BalanceSheetQuery;

    // ------------------------------
    // # Previous Year (PY)
    // ------------------------------
    /**
     * Retrieves the previous year (PY) net income.
     * @returns {number}
     */
    public getPreviousYearNetIncome = () => {
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
    public assocPreviousYearNetIncomeNode = (
      node: IBalanceSheetNetIncomeNode,
    ): IBalanceSheetNetIncomeNode => {
      const total = this.getPreviousYearNetIncome();

      return R.assoc('previousYear', this.getTotalAmountMeta(total), node);
    };

    /**
     * Assoc previous year attributes to aggregate node.
     * @param   {IBalanceSheetAccountNode} node
     * @returns {IBalanceSheetAccountNode}
     */
    public previousYearNetIncomeNodeCompose = (
      node: IBalanceSheetNetIncomeNode,
    ): IBalanceSheetNetIncomeNode => {
      return R.compose(
        R.when(
          this.query.isPreviousYearPercentageActive,
          this.assocPreviousYearTotalPercentageNode,
        ),
        R.when(
          this.query.isPreviousYearChangeActive,
          this.assocPreviousYearTotalChangeNode,
        ),
        // Associate the PY to date periods horizontal nodes.
        R.when(
          this.isNodeHasHorizontalTotals,
          this.assocPreviousYearNetIncomeHorizNode,
        ),
        this.assocPreviousYearNetIncomeNode,
      )(node);
    };
  };
