import * as R from 'ramda';
import { get } from 'lodash';
import { IProfitLossSheetNode, ProfitLossNodeType } from '@/interfaces';
import { FinancialFilter } from '../FinancialFilter';
import { ProfitLossSheetBase } from './ProfitLossSheetBase';
import { ProfitLossSheetQuery } from './ProfitLossSheetQuery';

export const ProfitLossSheetFilter = (Base) =>
  class extends R.compose(FinancialFilter, ProfitLossSheetBase)(Base) {
    query: ProfitLossSheetQuery;

    // ----------------
    // # Account.
    // ----------------
    /**
     * Filter report node determine.
     * @param  {IProfitLossSheetNode} node - Balance sheet node.
     * @return {boolean}
     */
    private accountNoneZeroNodesFilterDeterminer = (
      node: IProfitLossSheetNode
    ): boolean => {
      return R.ifElse(
        this.isNodeType(ProfitLossNodeType.ACCOUNT),
        this.isNodeNoneZero,
        R.always(true)
      )(node);
    };

    /**
     * Determines account none-transactions node.
     * @param   {IBalanceSheetDataNode} node
     * @returns {boolean}
     */
    private accountNoneTransFilterDeterminer = (
      node: IProfitLossSheetNode
    ): boolean => {
      return R.ifElse(
        this.isNodeType(ProfitLossNodeType.ACCOUNT),
        this.isNodeNoneZero,
        R.always(true)
      )(node);
    };

    /**
     * Report nodes filter.
     * @param  {IProfitLossSheetNode[]} nodes -
     * @return {IProfitLossSheetNode[]}
     */
    private accountsNoneZeroNodesFilter = (
      nodes: IProfitLossSheetNode[]
    ): IProfitLossSheetNode[] => {
      return this.filterNodesDeep(
        nodes,
        this.accountNoneZeroNodesFilterDeterminer
      );
    };

    /**
     * Filters the accounts none-transactions nodes.
     * @param   {IProfitLossSheetNode[]} nodes
     * @returns {IProfitLossSheetNode[]}
     */
    private accountsNoneTransactionsNodesFilter = (
      nodes: IProfitLossSheetNode[]
    ) => {
      return this.filterNodesDeep(nodes, this.accountNoneTransFilterDeterminer);
    };

    // ----------------
    // # Aggregate.
    // ----------------
    /**
     * Determines aggregate none-children filtering.
     * @param   {IProfitLossSheetNode} node
     * @returns {boolean}
     */
    private aggregateNoneChildrenFilterDeterminer = (
      node: IProfitLossSheetNode
    ): boolean => {
      const schemaNode = this.getSchemaNodeById(node.id);

      // Determines whether the given node is aggregate node.
      const isAggregateNode = this.isNodeType(
        ProfitLossNodeType.ACCOUNTS,
        node
      );
      // Determines if the schema node is always should show.
      const isSchemaAlwaysShow = get(schemaNode, 'alwaysShow', false);

      // Should node has children if aggregate node or not always show.
      return isAggregateNode && !isSchemaAlwaysShow
        ? this.isNodeHasChildren(node)
        : true;
    };

    /**
     * Filters aggregate none-children nodes.
     * @param   {IProfitLossSheetNode[]} nodes
     * @returns {IProfitLossSheetNode[]}
     */
    private aggregateNoneChildrenFilter = (
      nodes: IProfitLossSheetNode[]
    ): IProfitLossSheetNode[] => {
      return this.filterNodesDeep2(
        this.aggregateNoneChildrenFilterDeterminer,
        nodes
      );
    };

    // ----------------
    // # Composers.
    // ----------------
    /**
     * Filters none-zero nodes.
     * @param   {IProfitLossSheetNode[]} nodes
     * @returns {IProfitLossSheetNode[]}
     */
    private filterNoneZeroNodesCompose = (
      nodes: IProfitLossSheetNode[]
    ): IProfitLossSheetNode[] => {
      return R.compose(
        this.aggregateNoneChildrenFilter,
        this.accountsNoneZeroNodesFilter
      )(nodes);
    };

    /**
     * Filters none-transactions nodes.
     * @param   {IProfitLossSheetNode[]} nodes
     * @returns {IProfitLossSheetNode[]}
     */
    private filterNoneTransNodesCompose = (
      nodes: IProfitLossSheetNode[]
    ): IProfitLossSheetNode[] => {
      return R.compose(
        this.aggregateNoneChildrenFilter,
        this.accountsNoneTransactionsNodesFilter
      )(nodes);
    };

    /**
     * Supress nodes when total accounts range transactions is empty.
     * @param   {IProfitLossSheetNode[]} nodes
     * @returns {IProfitLossSheetNode[]}
     */
    private supressNodesWhenRangeTransactionsEmpty = (
      nodes: IProfitLossSheetNode[]
    ) => {
      return this.repository.totalAccountsLedger.isEmpty() ? [] : nodes;
    };

    /**
     * Compose report nodes filtering.
     * @param   {IProfitLossSheetNode[]} nodes
     * @returns {IProfitLossSheetNode[]}
     */
    protected reportFilterPlugin = (
      nodes: IProfitLossSheetNode[]
    ): IProfitLossSheetNode[] => {
      return R.compose(
        this.supressNodesWhenRangeTransactionsEmpty,
        R.when(() => this.query.noneZero, this.filterNoneZeroNodesCompose),
        R.when(
          () => this.query.noneTransactions,
          this.filterNoneTransNodesCompose
        )
      )(nodes);
    };
  };
