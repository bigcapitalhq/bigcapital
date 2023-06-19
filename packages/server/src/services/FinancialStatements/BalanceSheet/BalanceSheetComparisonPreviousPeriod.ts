import * as R from 'ramda';
import { sumBy } from 'lodash';
import {
  IBalanceSheetAccountNode,
  IBalanceSheetDataNode,
  IBalanceSheetAggregateNode,
  IBalanceSheetTotal,
  IBalanceSheetCommonNode,
} from '@/interfaces';
import { FinancialPreviousPeriod } from '../FinancialPreviousPeriod';
import { FinancialHorizTotals } from '../FinancialHorizTotals';

export const BalanceSheetComparisonPreviousPeriod = (Base: any) =>
  class
    extends R.compose(FinancialPreviousPeriod, FinancialHorizTotals)(Base)
    implements IBalanceSheetComparisons
  {
    // ------------------------------
    // # Account
    // ------------------------------
    /**
     * Associates the previous period to account node.
     * @param   {IBalanceSheetDataNode} node
     * @returns {IBalanceSheetDataNode}
     */
    protected assocPreviousPeriodAccountNode = (
      node: IBalanceSheetDataNode
    ): IBalanceSheetDataNode => {
      const total = this.repository.PPTotalAccountsLedger.whereAccountId(
        node.id
      ).getClosingBalance();

      return R.assoc('previousPeriod', this.getAmountMeta(total), node);
    };

    /**
     * Previous period account node composer.
     * @param   {IBalanceSheetAccountNode} node
     * @returns {IBalanceSheetAccountNode}
     */
    protected previousPeriodAccountNodeComposer = (
      node: IBalanceSheetAccountNode
    ): IBalanceSheetAccountNode => {
      return R.compose(
        R.when(
          this.isNodeHasHorizTotals,
          this.assocPreivousPeriodAccountHorizNodeComposer
        ),
        R.when(
          this.query.isPreviousPeriodPercentageActive,
          this.assocPreviousPeriodPercentageNode
        ),
        R.when(
          this.query.isPreviousPeriodChangeActive,
          this.assocPreviousPeriodChangeNode
        ),
        R.when(
          this.query.isPreviousPeriodActive,
          this.assocPreviousPeriodAccountNode
        )
      )(node);
    };

    // ------------------------------
    // # Aggregate
    // ------------------------------
    /**
     * Assoc previous period total to aggregate node.
     * @param   {IBalanceSheetAggregateNode} node
     * @returns {IBalanceSheetAggregateNode}
     */
    protected assocPreviousPeriodAggregateNode = (
      node: IBalanceSheetAggregateNode
    ): IBalanceSheetAggregateNode => {
      const total = sumBy(node.children, 'previousYear.amount');

      return R.assoc('previousPeriod', this.getTotalAmountMeta(total), node);
    };

    /**
     * Previous period aggregate node composer.
     * @param   {IBalanceSheetAccountNode} node
     * @returns {IBalanceSheetAccountNode}
     */
    protected previousPeriodAggregateNodeComposer = (
      node: IBalanceSheetAccountNode
    ): IBalanceSheetAccountNode => {
      return R.compose(
        R.when(
          this.isNodeHasHorizTotals,
          this.assocPreviousPeriodAggregateHorizNode
        ),
        R.when(
          this.query.isPreviousPeriodPercentageActive,
          this.assocPreviousPeriodTotalPercentageNode
        ),
        R.when(
          this.query.isPreviousPeriodChangeActive,
          this.assocPreviousPeriodTotalChangeNode
        ),
        R.when(
          this.query.isPreviousPeriodActive,
          this.assocPreviousPeriodAggregateNode
        )
      )(node);
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
    private getAccountPPDatePeriodTotal = R.curry(
      (accountId: number, fromDate: Date, toDate: Date): number => {
        const PPPeriodsTotal =
          this.repository.PPPeriodsAccountsLedger.whereAccountId(accountId)
            .whereToDate(toDate)
            .getClosingBalance();

        const PPPeriodsOpeningTotal =
          this.repository.PPPeriodsOpeningAccountLedger.whereAccountId(
            accountId
          ).getClosingBalance();

        return PPPeriodsOpeningTotal + PPPeriodsTotal;
      }
    );

    /**
     * Assoc preivous period to account horizontal total node.
     * @param   {IBalanceSheetAccountNode} node
     * @returns {}
     */
    private assocPreviousPeriodAccountHorizTotal = R.curry(
      (node: IBalanceSheetAccountNode, totalNode) => {
        const total = this.getAccountPPDatePeriodTotal(
          node.id,
          totalNode.previousPeriodFromDate.date,
          totalNode.previousPeriodToDate.date
        );
        return R.assoc('previousPeriod', this.getAmountMeta(total), totalNode);
      }
    );

    /**
     * Previous year account horizontal node composer.
     * @param   {IBalanceSheetAccountNode} node -
     * @param   {IBalanceSheetTotal}
     * @returns {IBalanceSheetTotal}
     */
    private previousPeriodAccountHorizNodeCompose = R.curry(
      (
        node: IBalanceSheetAccountNode,
        horizontalTotalNode: IBalanceSheetTotal
      ): IBalanceSheetTotal => {
        return R.compose(
          R.when(
            this.query.isPreviousPeriodPercentageActive,
            this.assocPreviousPeriodPercentageNode
          ),
          R.when(
            this.query.isPreviousPeriodChangeActive,
            this.assocPreviousPeriodChangeNode
          ),
          R.when(
            this.query.isPreviousPeriodActive,
            this.assocPreviousPeriodAccountHorizTotal(node)
          ),
          R.when(
            this.query.isPreviousPeriodActive,
            this.assocPreviousPeriodHorizNodeFromToDates(
              this.query.displayColumnsBy
            )
          )
        )(horizontalTotalNode);
      }
    );

    /**
     *
     * @param {IBalanceSheetAccountNode} node
     * @returns
     */
    private assocPreivousPeriodAccountHorizNodeComposer = (
      node: IBalanceSheetAccountNode
    ) => {
      const horizontalTotals = R.map(
        this.previousPeriodAccountHorizNodeCompose(node),
        node.horizontalTotals
      );
      return R.assoc('horizontalTotals', horizontalTotals, node);
    };

    // ------------------------------
    // # Horizontal Nodes - Aggregate
    // ------------------------------
    /**
     * Assoc previous year total to horizontal node.
     * @param node
     * @returns
     */
    private assocPreviousPeriodAggregateHorizTotalNode = R.curry(
      (node, index: number, totalNode) => {
        const total = this.getPPHorizNodesTotalSumation(index, node);

        return R.assoc(
          'previousPeriod',
          this.getTotalAmountMeta(total),
          totalNode
        );
      }
    );

    /**
     * Compose previous period to aggregate horizontal nodes.
     * @param   {IBalanceSheetTotal} node
     * @returns {IBalanceSheetTotal}
     */
    private previousPeriodAggregateHorizNodeComposer = R.curry(
      (
        node: IBalanceSheetCommonNode,
        horizontalTotalNode: IBalanceSheetTotal,
        index: number
      ): IBalanceSheetTotal => {
        return R.compose(
          R.when(
            this.query.isPreviousPeriodPercentageActive,
            this.assocPreviousPeriodTotalPercentageNode
          ),
          R.when(
            this.query.isPreviousPeriodChangeActive,
            this.assocPreviousPeriodTotalChangeNode
          ),
          R.when(
            this.query.isPreviousPeriodActive,
            this.assocPreviousPeriodAggregateHorizTotalNode(node, index)
          ),
          R.when(
            this.query.isPreviousPeriodActive,
            this.assocPreviousPeriodHorizNodeFromToDates(
              this.query.displayColumnsBy
            )
          )
        )(horizontalTotalNode);
      }
    );

    /**
     * Assoc
     * @param   {IBalanceSheetCommonNode} node
     * @returns {IBalanceSheetCommonNode}
     */
    private assocPreviousPeriodAggregateHorizNode = (
      node: IBalanceSheetCommonNode
    ) => {
      const horizontalTotals = R.addIndex(R.map)(
        this.previousPeriodAggregateHorizNodeComposer(node),
        node.horizontalTotals
      );
      return R.assoc('horizontalTotals', horizontalTotals, node);
    };
  };
