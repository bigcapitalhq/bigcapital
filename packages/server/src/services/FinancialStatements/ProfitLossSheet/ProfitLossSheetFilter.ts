import { type IProfitLossSheetNode, ProfitLossNodeType } from '@/interfaces';
import { get } from 'lodash';
import * as R from 'ramda';
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
     * Filter report node detarmine.
     * @param  {IProfitLossSheetNode} node - Balance sheet node.
     * @return {boolean}
     */
    private accountNoneZeroNodesFilterDetarminer = (node: IProfitLossSheetNode): boolean => {
      return R.ifElse(this.isNodeType(ProfitLossNodeType.ACCOUNT), this.isNodeNoneZero, R.always(true))(node);
    };

    /**
     * Detarmines account none-transactions node.
     * @param   {IBalanceSheetDataNode} node
     * @returns {boolean}
     */
    private accountNoneTransFilterDetarminer = (node: IProfitLossSheetNode): boolean => {
      return R.ifElse(this.isNodeType(ProfitLossNodeType.ACCOUNT), this.isNodeNoneZero, R.always(true))(node);
    };

    /**
     * Report nodes filter.
     * @param  {IProfitLossSheetNode[]} nodes -
     * @return {IProfitLossSheetNode[]}
     */
    private accountsNoneZeroNodesFilter = (nodes: IProfitLossSheetNode[]): IProfitLossSheetNode[] => {
      return this.filterNodesDeep(nodes, this.accountNoneZeroNodesFilterDetarminer);
    };

    /**
     * Filters the accounts none-transactions nodes.
     * @param   {IProfitLossSheetNode[]} nodes
     * @returns {IProfitLossSheetNode[]}
     */
    private accountsNoneTransactionsNodesFilter = (nodes: IProfitLossSheetNode[]) => {
      return this.filterNodesDeep(nodes, this.accountNoneTransFilterDetarminer);
    };

    // ----------------
    // # Aggregate.
    // ----------------
    /**
     * Detearmines aggregate none-children filtering.
     * @param   {IProfitLossSheetNode} node
     * @returns {boolean}
     */
    private aggregateNoneChildrenFilterDetarminer = (node: IProfitLossSheetNode): boolean => {
      const schemaNode = this.getSchemaNodeById(node.id);

      // Detarmines whether the given node is aggregate node.
      const isAggregateNode = this.isNodeType(ProfitLossNodeType.ACCOUNTS, node);
      // Detarmines if the schema node is always should show.
      const isSchemaAlwaysShow = get(schemaNode, 'alwaysShow', false);

      // Should node has children if aggregate node or not always show.
      return isAggregateNode && !isSchemaAlwaysShow ? this.isNodeHasChildren(node) : true;
    };

    /**
     * Filters aggregate none-children nodes.
     * @param   {IProfitLossSheetNode[]} nodes
     * @returns {IProfitLossSheetNode[]}
     */
    private aggregateNoneChildrenFilter = (nodes: IProfitLossSheetNode[]): IProfitLossSheetNode[] => {
      return this.filterNodesDeep2(this.aggregateNoneChildrenFilterDetarminer, nodes);
    };

    // ----------------
    // # Composers.
    // ----------------
    /**
     * Filters none-zero nodes.
     * @param   {IProfitLossSheetNode[]} nodes
     * @returns {IProfitLossSheetNode[]}
     */
    private filterNoneZeroNodesCompose = (nodes: IProfitLossSheetNode[]): IProfitLossSheetNode[] => {
      return R.compose(this.aggregateNoneChildrenFilter, this.accountsNoneZeroNodesFilter)(nodes);
    };

    /**
     * Filters none-transactions nodes.
     * @param   {IProfitLossSheetNode[]} nodes
     * @returns {IProfitLossSheetNode[]}
     */
    private filterNoneTransNodesCompose = (nodes: IProfitLossSheetNode[]): IProfitLossSheetNode[] => {
      return R.compose(this.aggregateNoneChildrenFilter, this.accountsNoneTransactionsNodesFilter)(nodes);
    };

    /**
     * Supress nodes when total accounts range transactions is empty.
     * @param   {IProfitLossSheetNode[]} nodes
     * @returns {IProfitLossSheetNode[]}
     */
    private supressNodesWhenRangeTransactionsEmpty = (nodes: IProfitLossSheetNode[]) => {
      return this.repository.totalAccountsLedger.isEmpty() ? [] : nodes;
    };

    /**
     * Compose report nodes filtering.
     * @param   {IProfitLossSheetNode[]} nodes
     * @returns {IProfitLossSheetNode[]}
     */
    protected reportFilterPlugin = (nodes: IProfitLossSheetNode[]): IProfitLossSheetNode[] => {
      return R.compose(
        this.supressNodesWhenRangeTransactionsEmpty,
        R.when(() => this.query.noneZero, this.filterNoneZeroNodesCompose),
        R.when(() => this.query.noneTransactions, this.filterNoneTransNodesCompose),
      )(nodes);
    };
  };
