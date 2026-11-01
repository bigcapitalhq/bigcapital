import { flow } from 'fp-ts/function';
import * as A from 'fp-ts/Array';
import { sumBy, isEmpty } from 'lodash';
import { assoc, when } from '@/common/fp';
import {
  IBalanceSheetAccountNode,
  IBalanceSheetCommonNode,
  IBalanceSheetDataNode,
  IBalanceSheetTotal,
} from './BalanceSheet.types';
import { FinancialPreviousYear } from '../../common/FinancialPreviousYear';
import { GConstructor } from '@/common/types/Constructor';
import { FinancialSheet } from '../../common/FinancialSheet';
import { BalanceSheetQuery } from './BalanceSheetQuery';
import { BalanceSheetRepository } from './BalanceSheetRepository';

export const BalanceSheetComparsionPreviousYear = <
  T extends GConstructor<FinancialSheet>,
>(
  Base: T,
) =>
  class BalanceSheetComparsionPreviousYear extends flow(FinancialPreviousYear)(
    Base,
  ) {
    query: BalanceSheetQuery;
    repository: BalanceSheetRepository;

    // ------------------------------
    // # Account
    // ------------------------------
    /**
     * Associates the previous year to account node.
     * @param   {IBalanceSheetDataNode} node
     * @returns {IBalanceSheetDataNode}
     */
    protected assocPreviousYearAccountNode = (
      node: IBalanceSheetDataNode,
    ): IBalanceSheetDataNode => {
      const accountIds = this.repository.getAccountsIdsIncludingChildren(
        node.id as number,
      );
      const closingBalance =
        this.repository.PYTotalAccountsLedger.whereAccountsIds(
          accountIds,
        ).getClosingBalance();

      return assoc('previousYear', this.getAmountMeta(closingBalance), node);
    };

    /**
     * Assoc previous year attributes to account node.
     * @param {IBalanceSheetAccountNode} node
     * @returns {IBalanceSheetAccountNode}
     */
    protected previousYearAccountNodeComposer = (
      node: IBalanceSheetAccountNode,
    ): IBalanceSheetAccountNode => {
      return flow(
        this.assocPreviousYearAccountNode,
        when(
          this.query.isPreviousYearChangeActive,
          this.assocPreviousYearChangetNode,
        ),
        when(
          this.query.isPreviousYearPercentageActive,
          this.assocPreviousYearPercentageNode,
        ),
        when(
          this.isNodeHasHorizontalTotals,
          this.assocPreviousYearAccountHorizNodeComposer,
        ),
      )(node) as IBalanceSheetAccountNode;
    };

    // ------------------------------
    // # Aggregate
    // ------------------------------
    /**
     * Assoc previous year on aggregate node.
     * @param {IBalanceSheetAccountNode} node
     * @returns {IBalanceSheetAccountNode}
     */
    protected assocPreviousYearAggregateNode = (
      node: IBalanceSheetAccountNode,
    ): IBalanceSheetAccountNode => {
      const total = sumBy(node.children, 'previousYear.amount');

      return assoc('previousYear', this.getTotalAmountMeta(total), node);
    };

    /**
     * Assoc previous year attributes to aggregate node.
     * @param {IBalanceSheetAccountNode} node
     * @returns {IBalanceSheetAccountNode}
     */
    protected previousYearAggregateNodeComposer = (
      node: IBalanceSheetAccountNode,
    ): IBalanceSheetAccountNode => {
      return flow(
        this.assocPreviousYearAggregateNode,
        when(
          this.isNodeHasHorizontalTotals,
          this.assocPreviousYearAggregateHorizNode,
        ),
        when(
          this.query.isPreviousYearChangeActive,
          this.assocPreviousYearTotalChangeNode,
        ),
        when(
          this.query.isPreviousYearPercentageActive,
          this.assocPreviousYearTotalPercentageNode,
        ),
      )(node) as IBalanceSheetAccountNode;
    };

    // ------------------------------
    // # Horizontal Nodes - Aggregate
    // ------------------------------
    /**
     * Assoc previous year total to horizontal node.
     * @param node
     * @returns
     */
    private assocPreviousYearAggregateHorizTotalNode =
      (node, index: number) =>
      (totalNode: any): IBalanceSheetTotal => {
        const total = this.getPYHorizNodesTotalSumation(index, node);

        return assoc('previousYear', this.getTotalAmountMeta(total), totalNode);
      };

    /**
     * Compose previous year to aggregate horizontal nodes.
     * @param   {IBalanceSheetTotal} node
     * @returns {IBalanceSheetTotal}
     */
    private previousYearAggregateHorizNodeComposer =
      (node: IBalanceSheetCommonNode) =>
      (horiontalTotalNode, index: number): IBalanceSheetTotal => {
        return flow(
          when(
            this.query.isPreviousYearActive,
            this.assocPreviousYearHorizNodeFromToDates,
          ),
          when(
            this.query.isPreviousYearActive,
            this.assocPreviousYearAggregateHorizTotalNode(node, index),
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
     * Assoc
     * @param   {IBalanceSheetCommonNode} node
     * @returns {IBalanceSheetCommonNode}
     */
    public assocPreviousYearAggregateHorizNode = (
      node: IBalanceSheetCommonNode,
    ): IBalanceSheetCommonNode => {
      const horizontalTotals = A.mapWithIndex(
        (index: number, totalNode: IBalanceSheetTotal) =>
          this.previousYearAggregateHorizNodeComposer(node)(totalNode, index),
      )(node.horizontalTotals) as IBalanceSheetTotal[];

      return assoc('horizontalTotals', horizontalTotals, node);
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
    private getAccountPYDatePeriodTotal = (
      accountId: number,
      fromDate: Date,
      toDate: Date,
    ): number => {
      const accountIds =
        this.repository.getAccountsIdsIncludingChildren(accountId);
      const PYPeriodsTotal =
        this.repository.PYPeriodsAccountsLedger.whereAccountsIds(accountIds)
          .whereToDate(toDate)
          .getClosingBalance();

      const PYPeriodsOpeningTotal =
        this.repository.PYPeriodsOpeningAccountLedger.whereAccountsIds(
          accountIds,
        ).getClosingBalance();

      return PYPeriodsOpeningTotal + PYPeriodsTotal;
    };

    /**
     * Assoc preivous year to account horizontal total node.
     * @param   {IBalanceSheetAccountNode} node
     * @returns {}
     */
    private assocPreviousYearAccountHorizTotal =
      (node: IBalanceSheetAccountNode) =>
      (totalNode: any): IBalanceSheetTotal => {
        const total = this.getAccountPYDatePeriodTotal(
          node.id,
          totalNode.previousYearFromDate.date,
          totalNode.previousYearToDate.date,
        );
        return assoc('previousYear', this.getAmountMeta(total), totalNode);
      };

    /**
     * Previous year account horizontal node composer.
     * @param   {IBalanceSheetAccountNode} node -
     * @param   {IBalanceSheetTotal}
     * @returns {IBalanceSheetTotal}
     */
    private previousYearAccountHorizNodeCompose =
      (node: IBalanceSheetAccountNode) =>
      (horizontalTotalNode): IBalanceSheetTotal => {
        return flow(
          when(
            this.query.isPreviousYearActive,
            this.assocPreviousYearHorizNodeFromToDates,
          ),
          when(
            this.query.isPreviousYearActive,
            this.assocPreviousYearAccountHorizTotal(node),
          ),
          when(
            this.query.isPreviousYearChangeActive,
            this.assocPreviousYearChangetNode,
          ),
          when(
            this.query.isPreviousYearPercentageActive,
            this.assocPreviousYearPercentageNode,
          ),
        )(horizontalTotalNode) as IBalanceSheetTotal;
      };

    /**
     * Assoc previous year horizontal nodes to account node.
     * @param   {IBalanceSheetAccountNode} node
     * @returns {IBalanceSheetAccountNode}
     */
    private assocPreviousYearAccountHorizNodeComposer = (
      node: IBalanceSheetAccountNode,
    ): IBalanceSheetAccountNode => {
      const horizontalTotals = A.map((totalNode: IBalanceSheetTotal) =>
        this.previousYearAccountHorizNodeCompose(node)(totalNode),
      )(node.horizontalTotals);
      return assoc('horizontalTotals', horizontalTotals, node);
    };

    // ------------------------------
    // # Horizontal Nodes - Aggregate.
    // ------------------------------
    /**
     * Detarmines whether the given node has horizontal totals.
     * @param   {IBalanceSheetCommonNode} node
     * @returns {boolean}
     */
    public isNodeHasHorizontalTotals = (node: IBalanceSheetCommonNode) =>
      !isEmpty(node.horizontalTotals);
  };
