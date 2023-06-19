import * as R from 'ramda';
import { sumBy } from 'lodash'
import {
  IFinancialCommonHorizDatePeriodNode,
  IFinancialCommonNode,
  IFinancialNodeWithPreviousYear,
} from '@/interfaces';

export const FinancialPreviousYear = (Base) =>
  class extends Base {
    // ---------------------------
    // # Common Node
    // ---------------------------
    /**
     * Assoc previous year change attribute to account node.
     * @param    {IProfitLossSheetAccountNode} accountNode
     * @returns  {IProfitLossSheetAccountNode}
     */
    protected assocPreviousYearChangedNode = (
      node: IFinancialCommonNode & IFinancialNodeWithPreviousYear
    ): IFinancialNodeWithPreviousYear => {
      const change = this.getAmountChange(
        node.total.amount,
        node.previousYear.amount
      );
      return R.assoc('previousYearChange', this.getAmountMeta(change), node);
    };

    /**
     * Assoc previous year percentage attribute to account node.
     *
     * % increase = Increase ÷ Original Number × 100.
     *
     * @param   {IProfitLossSheetAccountNode} accountNode
     * @returns {IProfitLossSheetAccountNode}
     */
    protected assocPreviousYearPercentageNode = (
      node: IFinancialCommonNode & IFinancialNodeWithPreviousYear
    ): IFinancialNodeWithPreviousYear => {
      const percentage = this.getPercentageBasis(
        node.previousYear.amount,
        node.previousYearChange.amount
      );
      return R.assoc(
        'previousYearPercentage',
        this.getPercentageAmountMeta(percentage),
        node
      );
    };

    /**
     * Assoc previous year change attribute to account node.
     * @param    {IProfitLossSheetAccountNode} accountNode
     * @returns  {IProfitLossSheetAccountNode}
     */
    protected assocPreviousYearTotalChangeNode = (
      node: IFinancialCommonNode & IFinancialNodeWithPreviousYear
    ): IFinancialNodeWithPreviousYear => {
      const change = this.getAmountChange(
        node.total.amount,
        node.previousYear.amount
      );
      return R.assoc(
        'previousYearChange',
        this.getTotalAmountMeta(change),
        node
      );
    };

    /**
     * Assoc previous year percentage attribute to account node.
     * @param   {IProfitLossSheetAccountNode} accountNode
     * @returns {IProfitLossSheetAccountNode}
     */
    protected assocPreviousYearTotalPercentageNode = (
      node: IFinancialCommonNode & IFinancialNodeWithPreviousYear
    ): IFinancialNodeWithPreviousYear => {
      const percentage = this.getPercentageBasis(
        node.previousYear.amount,
        node.previousYearChange.amount
      );
      return R.assoc(
        'previousYearPercentage',
        this.getPercentageTotalAmountMeta(percentage),
        node
      );
    };

    /**
     * Assoc previous year from/to date to horizontal nodes.
     * @param horizNode
     * @returns
     */
    protected assocPreviousYearHorizNodeFromToDates = (
      horizNode: IFinancialCommonHorizDatePeriodNode
    ) => {
      const PYFromDate = this.getPreviousYearDate(horizNode.fromDate.date);
      const PYToDate = this.getPreviousYearDate(horizNode.toDate.date);

      return R.compose(
        R.assoc('previousYearToDate', this.getDateMeta(PYToDate)),
        R.assoc('previousYearFromDate', this.getDateMeta(PYFromDate))
      )(horizNode);
    };

    /**
     * Retrieves PP total sumation of the given horiz index node. 
     * @param   {number} index 
     * @param   {} node 
     * @returns {number}
     */
    protected getPYHorizNodesTotalSumation = (index: number, node): number => {
      return sumBy(
        node.children,
        `horizontalTotals[${index}].previousYear.amount`
      )
    }
  };
