import { flow } from 'fp-ts/function';
import * as A from 'fp-ts/Array';
import { sumBy } from 'lodash';
import { assoc, when } from '@/common/fp';
import {
  IBalanceSheetAccountNode,
  IBalanceSheetDataNode,
  IBalanceSheetAggregateNode,
  IBalanceSheetTotal,
  IBalanceSheetCommonNode,
} from './BalanceSheet.types';
import { FinancialPreviousPeriod } from '../../common/FinancialPreviousPeriod';
import { FinancialHorizTotals } from '../../common/FinancialHorizTotals';
import { IFinancialDatePeriodsUnit } from '../../types/Report.types';
import { GConstructor } from '@/common/types/Constructor';
import { FinancialSheet } from '../../common/FinancialSheet';
import { BalanceSheetQuery } from './BalanceSheetQuery';
import { BalanceSheetRepository } from './BalanceSheetRepository';

export const BalanceSheetComparsionPreviousPeriod = <
  T extends GConstructor<FinancialSheet>,
>(
  Base: T,
) =>
  class BalanceSheetComparsionPreviousPeriod extends flow(
    FinancialHorizTotals,
    FinancialPreviousPeriod,
  )(Base) {
    query: BalanceSheetQuery;
    repository: BalanceSheetRepository;

    // ------------------------------
    // # Account
    // ------------------------------
    /**
     * Associates the previous period to account node.
     * @param {IBalanceSheetDataNode} node
     * @returns {IBalanceSheetDataNode}
     */
    public assocPreviousPeriodAccountNode = (
      node: IBalanceSheetDataNode,
    ): IBalanceSheetDataNode => {
      const accountIds = this.repository.getAccountsIdsIncludingChildren(
        node.id as number,
      );
      const total =
        this.repository.PPTotalAccountsLedger.whereAccountsIds(
          accountIds,
        ).getClosingBalance();

      return assoc('previousPeriod', this.getAmountMeta(total), node);
    };

    /**
     * Previous period account node composer.
     * @param {IBalanceSheetAccountNode} node
     * @returns {IBalanceSheetAccountNode}
     */
    public previousPeriodAccountNodeComposer = (
      node: IBalanceSheetAccountNode,
    ): IBalanceSheetAccountNode => {
      return flow(
        this.assocPreviousPeriodAccountNode,
        when(
          this.query.isPreviousPeriodChangeActive,
          this.assocPreviousPeriodChangeNode,
        ),
        when(
          this.query.isPreviousPeriodPercentageActive,
          this.assocPreviousPeriodPercentageNode,
        ),
        when(
          this.isNodeHasHorizTotals,
          this.assocPreivousPeriodAccountHorizNodeComposer,
        ),
      )(node) as IBalanceSheetAccountNode;
    };

    // ------------------------------
    // # Aggregate
    // ------------------------------
    /**
     * Assoc previous period total to aggregate node.
     * @param {IBalanceSheetAggregateNode} node
     * @returns {IBalanceSheetAggregateNode}
     */
    public assocPreviousPeriodAggregateNode = (
      node: any,
    ): IBalanceSheetAggregateNode => {
      const total = sumBy(node.children, 'previousPeriod.amount');

      return assoc('previousPeriod', this.getTotalAmountMeta(total), node);
    };

    /**
     * Previous period aggregate node composer.
     * @param {IBalanceSheetAccountNode} node
     * @returns {IBalanceSheetAccountNode}
     */
    public previousPeriodAggregateNodeComposer = (
      node: IBalanceSheetAccountNode,
    ): IBalanceSheetAccountNode => {
      return flow(
        this.assocPreviousPeriodAggregateNode,
        when(
          this.query.isPreviousPeriodChangeActive,
          this.assocPreviousPeriodTotalChangeNode,
        ),
        when(
          this.query.isPreviousPeriodPercentageActive,
          this.assocPreviousPeriodTotalPercentageNode,
        ),
        when(
          this.isNodeHasHorizTotals,
          this.assocPreviousPeriodAggregateHorizNode,
        ),
      )(node) as IBalanceSheetAccountNode;
    };

    // ------------------------------
    // # Horizontal Nodes - Account.
    // ------------------------------
    /**
     * Retrieve the given account total in the given period.
     * @param {number} accountId - Account id.
     * @param {Date} fromDate - From date.
     * @param {Date} toDate - To date.
     * @returns {number}
     */
    private getAccountPPDatePeriodTotal = (
      accountId: number,
      fromDate: Date,
      toDate: Date,
    ): number => {
      const accountIds =
        this.repository.getAccountsIdsIncludingChildren(accountId);
      const PPPeriodsTotal =
        this.repository.PPPeriodsAccountsLedger.whereAccountsIds(accountIds)
          .whereToDate(toDate)
          .getClosingBalance();

      const PPPeriodsOpeningTotal =
        this.repository.PPPeriodsOpeningAccountLedger.whereAccountsIds(
          accountIds,
        ).getClosingBalance();

      return PPPeriodsOpeningTotal + PPPeriodsTotal;
    };

    /**
     * Assoc preivous period to account horizontal total node.
     * @param   {IBalanceSheetAccountNode} node
     * @returns {}
     */
    private assocPreviousPeriodAccountHorizTotal =
      (node: IBalanceSheetAccountNode) =>
      (totalNode: any): IBalanceSheetTotal => {
        const total = this.getAccountPPDatePeriodTotal(
          node.id,
          totalNode.previousPeriodFromDate.date,
          totalNode.previousPeriodToDate.date,
        );
        return assoc('previousPeriod', this.getAmountMeta(total), totalNode);
      };

    /**
     * Previous year account horizontal node composer.
     * @param {IBalanceSheetAccountNode} node -
     * @param {IBalanceSheetTotal}
     * @returns {IBalanceSheetTotal}
     */
    private previousPeriodAccountHorizNodeCompose =
      (node: IBalanceSheetAccountNode) =>
      (horizontalTotalNode): IBalanceSheetTotal => {
        return flow(
          when(
            this.query.isPreviousPeriodActive,
            this.assocPreviousPeriodHorizNodeFromToDates(
              this.query.displayColumnsBy as IFinancialDatePeriodsUnit,
            ),
          ),
          when(
            this.query.isPreviousPeriodActive,
            this.assocPreviousPeriodAccountHorizTotal(node),
          ),
          when(
            this.query.isPreviousPeriodChangeActive,
            this.assocPreviousPeriodChangeNode,
          ),
          when(
            this.query.isPreviousPeriodPercentageActive,
            this.assocPreviousPeriodPercentageNode,
          ),
        )(horizontalTotalNode) as IBalanceSheetTotal;
      };

    /**
     *
     * @param {IBalanceSheetAccountNode} node
     * @returns
     */
    private assocPreivousPeriodAccountHorizNodeComposer = (
      node: IBalanceSheetAccountNode,
    ): IBalanceSheetAccountNode => {
      const horizontalTotals = A.map((totalNode: IBalanceSheetTotal) =>
        this.previousPeriodAccountHorizNodeCompose(node)(totalNode),
      )(node.horizontalTotals);
      return assoc('horizontalTotals', horizontalTotals, node);
    };

    // ------------------------------
    // # Horizontal Nodes - Aggregate
    // ------------------------------
    /**
     * Assoc previous year total to horizontal node.
     * @param node
     * @returns
     */
    private assocPreviousPeriodAggregateHorizTotalNode =
      (node, index: number) =>
      (totalNode: IBalanceSheetTotal): IBalanceSheetTotal => {
        const total = this.getPPHorizNodesTotalSumation(index, node);

        return assoc(
          'previousPeriod',
          this.getTotalAmountMeta(total),
          totalNode,
        );
      };

    /**
     * Compose previous period to aggregate horizontal nodes.
     * @param   {IBalanceSheetTotal} node
     * @returns {IBalanceSheetTotal}
     */
    private previousPeriodAggregateHorizNodeComposer =
      (node: IBalanceSheetCommonNode) =>
      (horiontalTotalNode, index: number): IBalanceSheetTotal => {
        return flow(
          when(
            this.query.isPreviousPeriodActive,
            this.assocPreviousPeriodHorizNodeFromToDates(
              this.query.displayColumnsBy as IFinancialDatePeriodsUnit,
            ),
          ),
          when(
            this.query.isPreviousPeriodActive,
            this.assocPreviousPeriodAggregateHorizTotalNode(node, index),
          ),
          when(
            this.query.isPreviousPeriodChangeActive,
            this.assocPreviousPeriodTotalChangeNode,
          ),
          when(
            this.query.isPreviousPeriodPercentageActive,
            this.assocPreviousPeriodTotalPercentageNode,
          ),
        )(horiontalTotalNode) as IBalanceSheetTotal;
      };

    /**
     * Assoc
     * @param   {IBalanceSheetCommonNode} node
     * @returns {IBalanceSheetCommonNode}
     */
    private assocPreviousPeriodAggregateHorizNode = (
      node: IBalanceSheetCommonNode,
    ): IBalanceSheetCommonNode => {
      const horizontalTotals = A.mapWithIndex(
        (index: number, totalNode: IBalanceSheetTotal) =>
          this.previousPeriodAggregateHorizNodeComposer(node)(totalNode, index),
      )(node.horizontalTotals) as IBalanceSheetTotal[];

      return assoc('horizontalTotals', horizontalTotals, node);
    };
  };
