import * as R from 'ramda';
import { get } from 'lodash';
import {
  IBalanceSheetDataNode,
  BALANCE_SHEET_NODE_TYPE,
} from '../../../interfaces';
import { FinancialFilter } from '../FinancialFilter';

export const BalanceSheetFiltering = (Base) =>
  class extends R.compose(FinancialFilter)(Base) {
    // -----------------------
    // # Account
    // -----------------------
    /**
     * Filter report node determine.
     * @param  {IBalanceSheetDataNode} node - Balance sheet node.
     * @return {boolean}
     */
    private accountNoneZeroNodesFilterDeterminer = (
      node: IBalanceSheetDataNode
    ): boolean => {
      return R.ifElse(
        this.isNodeType(BALANCE_SHEET_NODE_TYPE.ACCOUNT),
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
      node: IBalanceSheetDataNode
    ): boolean => {
      return R.ifElse(
        this.isNodeType(BALANCE_SHEET_NODE_TYPE.ACCOUNT),
        this.isNodeNoneZero,
        R.always(true)
      )(node);
    };

    /**
     * Report nodes filter.
     * @param  {IBalanceSheetSection[]} nodes -
     * @return {IBalanceSheetSection[]}
     */
    private accountsNoneZeroNodesFilter = (
      nodes: IBalanceSheetDataNode[]
    ): IBalanceSheetDataNode[] => {
      return this.filterNodesDeep(
        nodes,
        this.accountNoneZeroNodesFilterDeterminer
      );
    };

    /**
     * Filters the accounts none-transactions nodes.
     * @param   {IBalanceSheetDataNode[]} nodes
     * @returns {IBalanceSheetDataNode[]}
     */
    private accountsNoneTransactionsNodesFilter = (
      nodes: IBalanceSheetDataNode[]
    ) => {
      return this.filterNodesDeep(nodes, this.accountNoneTransFilterDeterminer);
    };

    // -----------------------
    // # Aggregate/Accounts.
    // -----------------------
    /**
     * Determines aggregate none-children filtering.
     * @param   {IBalanceSheetDataNode} node
     * @returns {boolean}
     */
    private aggregateNoneChildrenFilterDeterminer = (
      node: IBalanceSheetDataNode
    ): boolean => {
      // Determines whether the given node is aggregate or accounts node.
      const isAggregateOrAccounts =
        this.isNodeType(BALANCE_SHEET_NODE_TYPE.AGGREGATE, node) ||
        this.isNodeType(BALANCE_SHEET_NODE_TYPE.ACCOUNTS, node);

      // Retrieve the schema node of the given id.
      const schemaNode = this.getSchemaNodeById(node.id);

      // Determines if the schema node is always should show.
      const isSchemaAlwaysShow = get(schemaNode, 'alwaysShow', false);

      return isAggregateOrAccounts && !isSchemaAlwaysShow
        ? this.isNodeHasChildren(node)
        : true;
    };

    /**
     * Filters aggregate none-children nodes.
     * @param   {IBalanceSheetDataNode[]} nodes
     * @returns {IBalanceSheetDataNode[]}
     */
    private aggregateNoneChildrenFilter = (
      nodes: IBalanceSheetDataNode[]
    ): IBalanceSheetDataNode[] => {
      return this.filterNodesDeep2(
        this.aggregateNoneChildrenFilterDeterminer,
        nodes
      );
    };

    // -----------------------
    // # Composers.
    // -----------------------
    /**
     * Filters none-zero nodes.
     * @param   {IBalanceSheetDataNode[]} nodes
     * @returns {IBalanceSheetDataNode[]}
     */
    private filterNoneZeroNodesCompose = (
      nodes: IBalanceSheetDataNode[]
    ): IBalanceSheetDataNode[] => {
      return R.compose(
        this.aggregateNoneChildrenFilter,
        this.accountsNoneZeroNodesFilter
      )(nodes);
    };

    /**
     * Filters none-transactions nodes.
     * @param   {IBalanceSheetDataNode[]} nodes
     * @returns {IBalanceSheetDataNode[]}
     */
    private filterNoneTransNodesCompose = (
      nodes: IBalanceSheetDataNode[]
    ): IBalanceSheetDataNode[] => {
      return R.compose(
        this.aggregateNoneChildrenFilter,
        this.accountsNoneTransactionsNodesFilter
      )(nodes);
    };

    /**
     * Supress nodes when accounts transactions ledger is empty.
     * @param   {IBalanceSheetDataNode[]} nodes
     * @returns {IBalanceSheetDataNode[]}
     */
    private supressNodesWhenAccountsTransactionsEmpty = (
      nodes: IBalanceSheetDataNode[]
    ): IBalanceSheetDataNode[] => {
      return this.repository.totalAccountsLedger.isEmpty() ? [] : nodes;
    };

    /**
     * Compose report nodes filtering.
     * @param   {IBalanceSheetDataNode[]} nodes
     * @returns {IBalanceSheetDataNode[]}
     */
    protected reportFilterPlugin = (nodes: IBalanceSheetDataNode[]) => {
      return R.compose(
        this.supressNodesWhenAccountsTransactionsEmpty,
        R.when(R.always(this.query.noneZero), this.filterNoneZeroNodesCompose),
        R.when(
          R.always(this.query.noneTransactions),
          this.filterNoneTransNodesCompose
        )
      )(nodes);
    };
  };
