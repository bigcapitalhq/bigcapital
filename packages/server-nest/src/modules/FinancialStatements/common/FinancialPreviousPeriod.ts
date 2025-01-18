import { sumBy } from 'lodash';
import {
  IFinancialDatePeriodsUnit,
  IFinancialNodeWithPreviousPeriod,
} from '../types/Report.types';
import * as R from 'ramda';
import { Constructor, GConstructor } from '@/common/types/Constructor';
import { FinancialSheet } from './FinancialSheet';
import { FinancialDatePeriods } from './FinancialDatePeriods';

export const FinancialPreviousPeriod = <T extends GConstructor<FinancialSheet>>(
  Base: T,
) =>
  class extends R.compose(FinancialDatePeriods)(Base) {
    // ---------------------------
    // # Common Node.
    // ---------------------------
    /**
     * Assoc previous period percentage attribute to account node.
     * @param   {IProfitLossSheetAccountNode} accountNode
     * @returns {IFinancialNodeWithPreviousPeriod}
     */
    public assocPreviousPeriodPercentageNode = (
      accountNode: IProfitLossSheetAccountNode,
    ): IFinancialNodeWithPreviousPeriod => {
      const percentage = this.getPercentageBasis(
        accountNode.previousPeriod.amount,
        accountNode.previousPeriodChange.amount,
      );
      return R.assoc(
        'previousPeriodPercentage',
        this.getPercentageAmountMeta(percentage),
        accountNode,
      );
    };

    /**
     * Assoc previous period total attribute to account node.
     * @param   {IProfitLossSheetAccountNode} accountNode
     * @returns {IFinancialNodeWithPreviousPeriod}
     */
    public assocPreviousPeriodChangeNode = (
      accountNode: IProfitLossSheetAccountNode,
    ): IFinancialNodeWithPreviousPeriod => {
      const change = this.getAmountChange(
        accountNode.total.amount,
        accountNode.previousPeriod.amount,
      );
      return R.assoc(
        'previousPeriodChange',
        this.getAmountMeta(change),
        accountNode,
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
    public assocPreviousPeriodTotalPercentageNode = (
      accountNode: IProfitLossSheetAccountNode,
    ): IFinancialNodeWithPreviousPeriod => {
      const percentage = this.getPercentageBasis(
        accountNode.previousPeriod.amount,
        accountNode.previousPeriodChange.amount,
      );
      return R.assoc(
        'previousPeriodPercentage',
        this.getPercentageTotalAmountMeta(percentage),
        accountNode,
      );
    };

    /**
     * Assoc previous period total attribute to account node.
     * @param   {IProfitLossSheetAccountNode} accountNode
     * @returns {IFinancialNodeWithPreviousPeriod}
     */
    public assocPreviousPeriodTotalChangeNode = (
      accountNode: any,
    ): IFinancialNodeWithPreviousPeriod => {
      const change = this.getAmountChange(
        accountNode.total.amount,
        accountNode.previousPeriod.amount,
      );
      return R.assoc(
        'previousPeriodChange',
        this.getTotalAmountMeta(change),
        accountNode,
      );
    };

    /**
     * Assoc previous year from/to date to horizontal nodes.
     * @param horizNode
     * @returns {IFinancialNodeWithPreviousPeriod}
     */
    public assocPreviousPeriodHorizNodeFromToDates = R.curry(
      (
        periodUnit: IFinancialDatePeriodsUnit,
        horizNode: any,
      ): IFinancialNodeWithPreviousPeriod => {
        const { fromDate: PPFromDate, toDate: PPToDate } =
          this.getPreviousPeriodDateRange(
            horizNode.fromDate.date,
            horizNode.toDate.date,
            periodUnit,
          );
        return R.compose(
          R.assoc('previousPeriodToDate', this.getDateMeta(PPToDate)),
          R.assoc('previousPeriodFromDate', this.getDateMeta(PPFromDate)),
        )(horizNode);
      },
    );

    /**
     * Retrieves PP total sumation of the given horiz index node.
     * @param {number} index
     * @param node
     * @returns {number}
     */
    public getPPHorizNodesTotalSumation = (index: number, node): number => {
      return sumBy(
        node.children,
        `horizontalTotals[${index}].previousPeriod.amount`,
      );
    };
  };
