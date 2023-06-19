import * as R from 'ramda';
import { sumBy, isEmpty } from 'lodash';
import {
  IBalanceSheetAccountNode,
  IBalanceSheetCommonNode,
  IBalanceSheetDataNode,
  IBalanceSheetTotal,
  ITableColumn,
} from '@/interfaces';
import { FinancialPreviousYear } from '../FinancialPreviousYear';

export const BalanceSheetComparisonPreviousYear = (Base: any) =>
  class
    extends R.compose(FinancialPreviousYear)(Base)
    implements IBalanceSheetComparisons
  {
    // ------------------------------
    // # Account
    // ------------------------------
    /**
     * Associates the previous year to account node.
     * @param   {IBalanceSheetDataNode} node
     * @returns {IBalanceSheetDataNode}
     */
    protected assocPreviousYearAccountNode = (
      node: IBalanceSheetDataNode
    ): IBalanceSheetDataNode => {
      const closingBalance =
        this.repository.PYTotalAccountsLedger.whereAccountId(
          node.id
        ).getClosingBalance();

      return R.assoc('previousYear', this.getAmountMeta(closingBalance), node);
    };

    /**
     * Assoc previous year attributes to account node.
     * @param   {IBalanceSheetAccountNode} node
     * @returns {IBalanceSheetAccountNode}
     */
    protected previousYearAccountNodeComposer = (
      node: IBalanceSheetAccountNode
    ): IBalanceSheetAccountNode => {
      return R.compose(
        R.when(
          this.isNodeHasHorizontalTotals,
          this.assocPreviousYearAccountHorizNodeComposer
        ),
        R.when(
          this.query.isPreviousYearPercentageActive,
          this.assocPreviousYearPercentageNode
        ),
        R.when(
          this.query.isPreviousYearChangeActive,
          this.assocPreviousYearChangedNode
        ),
        this.assocPreviousYearAccountNode
      )(node);
    };

    // ------------------------------
    // # Aggregate
    // ------------------------------
    /**
     * Assoc previous year on aggregate node.
     * @param   {IBalanceSheetAccountNode} node
     * @returns {IBalanceSheetAccountNode}
     */
    protected assocPreviousYearAggregateNode = (
      node: IBalanceSheetAccountNode
    ): IBalanceSheetAccountNode => {
      const total = sumBy(node.children, 'previousYear.amount');

      return R.assoc('previousYear', this.getTotalAmountMeta(total), node);
    };

    /**
     * Assoc previous year attributes to aggregate node.
     * @param   {IBalanceSheetAccountNode} node
     * @returns {IBalanceSheetAccountNode}
     */
    protected previousYearAggregateNodeComposer = (
      node: IBalanceSheetAccountNode
    ): IBalanceSheetAccountNode => {
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
        this.assocPreviousYearAggregateNode
      )(node);
    };

    // ------------------------------
    // # Horizontal Nodes - Aggregate
    // ------------------------------
    /**
     * Assoc previous year total to horizontal node.
     * @param node
     * @returns
     */
    private assocPreviousYearAggregateHorizTotalNode = R.curry(
      (node, index, totalNode) => {
        const total = this.getPYHorizNodesTotalSumation(index, node);

        return R.assoc(
          'previousYear',
          this.getTotalAmountMeta(total),
          totalNode
        );
      }
    );

    /**
     * Compose previous year to aggregate horizontal nodes.
     * @param   {IBalanceSheetTotal} node
     * @returns {IBalanceSheetTotal}
     */
    private previousYearAggregateHorizNodeComposer = R.curry(
      (
        node: IBalanceSheetCommonNode,
        horizontalTotalNode: IBalanceSheetTotal,
        index: number
      ): IBalanceSheetTotal => {
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
            this.query.isPreviousYearActive,
            this.assocPreviousYearAggregateHorizTotalNode(node, index)
          ),
          R.when(
            this.query.isPreviousYearActive,
            this.assocPreviousYearHorizNodeFromToDates
          )
        )(horizontalTotalNode);
      }
    );

    /**
     * Assoc
     * @param   {IBalanceSheetCommonNode} node
     * @returns {IBalanceSheetCommonNode}
     */
    private assocPreviousYearAggregateHorizNode = (
      node: IBalanceSheetCommonNode
    ) => {
      const horizontalTotals = R.addIndex(R.map)(
        this.previousYearAggregateHorizNodeComposer(node),
        node.horizontalTotals
      );
      return R.assoc('horizontalTotals', horizontalTotals, node);
    };

    // ------------------------------
    // # Horizontal Nodes - Account.
    // ------------------------------
    /**
     * Retrieve the given account total in the given period.
     * @param   {number} accountId - Account id.
     * @param   {Date} fromDate - From date.
     * @param   {Date} toDate - To date.
     * @returns {number}
     */
    private getAccountPYDatePeriodTotal = R.curry(
      (accountId: number, fromDate: Date, toDate: Date): number => {
        const PYPeriodsTotal =
          this.repository.PYPeriodsAccountsLedger.whereAccountId(accountId)
            .whereToDate(toDate)
            .getClosingBalance();

        const PYPeriodsOpeningTotal =
          this.repository.PYPeriodsOpeningAccountLedger.whereAccountId(
            accountId
          ).getClosingBalance();

        return PYPeriodsOpeningTotal + PYPeriodsTotal;
      }
    );

    /**
     * Assoc previous year to account horizontal total node.
     * @param   {IBalanceSheetAccountNode} node
     * @returns {}
     */
    private assocPreviousYearAccountHorizTotal = R.curry(
      (node: IBalanceSheetAccountNode, totalNode) => {
        const total = this.getAccountPYDatePeriodTotal(
          node.id,
          totalNode.previousYearFromDate.date,
          totalNode.previousYearToDate.date
        );
        return R.assoc('previousYear', this.getAmountMeta(total), totalNode);
      }
    );

    /**
     * Previous year account horizontal node composer.
     * @param   {IBalanceSheetAccountNode} node -
     * @param   {IBalanceSheetTotal}
     * @returns {IBalanceSheetTotal}
     */
    private previousYearAccountHorizNodeCompose = R.curry(
      (
        node: IBalanceSheetAccountNode,
        horizontalTotalNode: IBalanceSheetTotal
      ): IBalanceSheetTotal => {
        return R.compose(
          R.when(
            this.query.isPreviousYearPercentageActive,
            this.assocPreviousYearPercentageNode
          ),
          R.when(
            this.query.isPreviousYearChangeActive,
            this.assocPreviousYearChangedNode
          ),
          R.when(
            this.query.isPreviousYearActive,
            this.assocPreviousYearAccountHorizTotal(node)
          ),
          R.when(
            this.query.isPreviousYearActive,
            this.assocPreviousYearHorizNodeFromToDates
          )
        )(horizontalTotalNode);
      }
    );

    /**
     * Assoc previous year horizontal nodes to account node.
     * @param   {IBalanceSheetAccountNode} node
     * @returns {IBalanceSheetAccountNode}
     */
    private assocPreviousYearAccountHorizNodeComposer = (
      node: IBalanceSheetAccountNode
    ) => {
      const horizontalTotals = R.map(
        this.previousYearAccountHorizNodeCompose(node),
        node.horizontalTotals
      );
      return R.assoc('horizontalTotals', horizontalTotals, node);
    };

    // ------------------------------
    // # Horizontal Nodes - Aggregate.
    // ------------------------------

    /**
     * Determines whether the given node has horizontal totals.
     * @param   {IBalanceSheetCommonNode} node
     * @returns {boolean}
     */
    private isNodeHasHorizontalTotals = (node: IBalanceSheetCommonNode) =>
      !isEmpty(node.horizontalTotals);
  };
