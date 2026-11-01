import { flow } from 'fp-ts/function';
import * as A from 'fp-ts/Array';
import { assoc, when } from '@/common/fp';
import { BalanceSheetComparsionPreviousYear } from './BalanceSheetComparsionPreviousYear';
import { FinancialPreviousPeriod } from '../../common/FinancialPreviousPeriod';
import { FinancialHorizTotals } from '../../common/FinancialHorizTotals';
import {
  IBalanceSheetNetIncomeNode,
  IBalanceSheetTotal,
} from './BalanceSheet.types';
import { BalanceSheetQuery } from './BalanceSheetQuery';
import { BalanceSheetRepository } from './BalanceSheetRepository';
import { GConstructor } from '@/common/types/Constructor';
import { FinancialSheet } from '../../common/FinancialSheet';

export const BalanceSheetNetIncomeDatePeriodsPY = <
  T extends GConstructor<FinancialSheet>,
>(
  Base: T,
) =>
  class extends flow(
    BalanceSheetComparsionPreviousYear,
    FinancialPreviousPeriod,
    FinancialHorizTotals,
  )(Base) {
    query: BalanceSheetQuery;
    repository: BalanceSheetRepository;

    /**
     * Retrieves the PY total income of the given date period.
     * @param {Date} toDate -
     * @return {number}
     */
    public getPYIncomeDatePeriodTotal = (toDate: Date): number => {
      const PYPeriodsTotal = this.repository.incomePYPeriodsAccountsLedger
        .whereToDate(toDate)
        .getClosingBalance();

      const PYPeriodsOpeningTotal =
        this.repository.incomePYPeriodsOpeningAccountLedger.getClosingBalance();

      return PYPeriodsOpeningTotal + PYPeriodsTotal;
    };

    /**
     * Retrieves the PY total expense of the given date period.
     * @param {Date} toDate -
     * @returns {number}
     */
    public getPYExpenseDatePeriodTotal = (toDate: Date): number => {
      const PYPeriodsTotal = this.repository.expensePYPeriodsAccountsLedger
        .whereToDate(toDate)
        .getClosingBalance();

      const PYPeriodsOpeningTotal =
        this.repository.expensePYPeriodsOpeningAccountLedger.getClosingBalance();

      return PYPeriodsOpeningTotal + PYPeriodsTotal;
    };

    /**
     * Retrieve the given net income total of the given period.
     * @param {Date} toDate - To date.
     * @returns {number}
     */
    public getPYNetIncomeDatePeriodTotal = (toDate: Date): number => {
      const income = this.getPYIncomeDatePeriodTotal(toDate);
      const expense = this.getPYExpenseDatePeriodTotal(toDate);

      return income - expense;
    };

    /**
     * Assoc preivous year to account horizontal total node.
     * @param {IBalanceSheetAccountNode} node
     * @returns {}
     */
    public assocPreviousYearNetIncomeHorizTotal =
      (_node: IBalanceSheetNetIncomeNode) =>
      (totalNode: any): IBalanceSheetTotal => {
        const total = this.getPYNetIncomeDatePeriodTotal(
          totalNode.previousYearToDate.date,
        );
        return assoc('previousYear', this.getAmountMeta(total), totalNode);
      };

    /**
     * Compose PY to net income horizontal nodes.
     * @param {IBalanceSheetTotal} node
     * @returns {IBalanceSheetTotal}
     */
    public previousYearNetIncomeHorizNodeComposer =
      (node: IBalanceSheetNetIncomeNode) =>
      (horiontalTotalNode): IBalanceSheetTotal => {
        return flow(
          when(
            this.query.isPreviousYearActive,
            this.assocPreviousYearHorizNodeFromToDates as any,
          ),
          when(
            this.query.isPreviousYearActive,
            this.assocPreviousYearNetIncomeHorizTotal(node),
          ),
          when(
            this.query.isPreviousYearChangeActive,
            this.assocPreviousYearTotalChangeNode,
          ),
          when(
            this.query.isPreviousYearPercentageActive,
            this.assocPreviousYearTotalPercentageNode,
          ),
        )(horiontalTotalNode) as IBalanceSheetTotal;
      };

    /**
     * Associate the PY to net income horizontal nodes.
     * @param   {IBalanceSheetCommonNode} node
     * @returns {IBalanceSheetCommonNode}
     */
    public assocPreviousYearNetIncomeHorizNode = (
      node: IBalanceSheetNetIncomeNode,
    ): IBalanceSheetNetIncomeNode => {
      const horizontalTotals = A.mapWithIndex(
        (_index: number, totalNode: IBalanceSheetTotal) =>
          this.previousYearNetIncomeHorizNodeComposer(node)(totalNode),
      )(node.horizontalTotals) as IBalanceSheetTotal[];

      return assoc('horizontalTotals', horizontalTotals, node);
    };
  };
