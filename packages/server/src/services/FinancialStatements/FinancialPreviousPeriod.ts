import { sumBy } from 'lodash';
import {
  IFinancialDatePeriodsUnit,
  IFinancialNodeWithPreviousPeriod,
} from '@/interfaces';
import * as R from 'ramda';

export const FinancialPreviousPeriod = (Base) =>
  class extends Base {
    // ---------------------------
    // # Common Node.
    // ---------------------------
    /**
     * Assoc previous period percentage attribute to account node.
     * @param   {IProfitLossSheetAccountNode} accountNode
     * @returns {IFinancialNodeWithPreviousPeriod}
     */
    protected assocPreviousPeriodPercentageNode = (
      accountNode: IProfitLossSheetAccountNode
    ): IFinancialNodeWithPreviousPeriod => {
      const percentage = this.getPercentageBasis(
        accountNode.previousPeriod.amount,
        accountNode.previousPeriodChange.amount
      );
      return R.assoc(
        'previousPeriodPercentage',
        this.getPercentageAmountMeta(percentage),
        accountNode
      );
    };

    /**
     * Assoc previous period total attribute to account node.
     * @param   {IProfitLossSheetAccountNode} accountNode
     * @returns {IFinancialNodeWithPreviousPeriod}
     */
    protected assocPreviousPeriodChangeNode = (
      accountNode: IProfitLossSheetAccountNode
    ): IFinancialNodeWithPreviousPeriod => {
      const change = this.getAmountChange(
        accountNode.total.amount,
        accountNode.previousPeriod.amount
      );
      return R.assoc(
        'previousPeriodChange',
        this.getAmountMeta(change),
        accountNode
      );
    };

    /**
     * Assoc previous period percentage attribute to account node.
     *
     * % change = Change ÷ Original Number × 100.
     *
     * @param   {IProfitLossSheetAccountNode} accountNode
     * @returns {IFinancialNodeWithPreviousPeriod}
     */
    protected assocPreviousPeriodTotalPercentageNode = (
      accountNode: IProfitLossSheetAccountNode
    ): IFinancialNodeWithPreviousPeriod => {
      const percentage = this.getPercentageBasis(
        accountNode.previousPeriod.amount,
        accountNode.previousPeriodChange.amount
      );
      return R.assoc(
        'previousPeriodPercentage',
        this.getPercentageTotalAmountMeta(percentage),
        accountNode
      );
    };

    /**
     * Assoc previous period total attribute to account node.
     * @param   {IProfitLossSheetAccountNode} accountNode
     * @returns {IFinancialNodeWithPreviousPeriod}
     */
    protected assocPreviousPeriodTotalChangeNode = (
      accountNode: any
    ): IFinancialNodeWithPreviousPeriod => {
      const change = this.getAmountChange(
        accountNode.total.amount,
        accountNode.previousPeriod.amount
      );
      return R.assoc(
        'previousPeriodChange',
        this.getTotalAmountMeta(change),
        accountNode
      );
    };

    /**
     * Assoc previous year from/to date to horizontal nodes.
     * @param horizNode
     * @returns {IFinancialNodeWithPreviousPeriod}
     */
    protected assocPreviousPeriodHorizNodeFromToDates = R.curry(
      (
        periodUnit: IFinancialDatePeriodsUnit,
        horizNode: any
      ): IFinancialNodeWithPreviousPeriod => {
        const { fromDate: PPFromDate, toDate: PPToDate } =
          this.getPreviousPeriodDateRange(
            horizNode.fromDate.date,
            horizNode.toDate.date,
            periodUnit
          );
        return R.compose(
          R.assoc('previousPeriodToDate', this.getDateMeta(PPToDate)),
          R.assoc('previousPeriodFromDate', this.getDateMeta(PPFromDate))
        )(horizNode);
      }
    );

    /**
     * Retrieves PP total summation of the given horiz index node.
     * @param {number} index
     * @param node
     * @returns {number}
     */
    protected getPPHorizNodesTotalSummation = (index: number, node): number => {
      return sumBy(
        node.children,
        `horizontalTotals[${index}].previousPeriod.amount`
      );
    };
  };
