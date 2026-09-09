import { flow, constant } from 'fp-ts/function';
import { ifElse, when } from '@/common/fp';
import { get } from 'lodash';
import {
  IBalanceSheetDataNode,
  BALANCE_SHEET_NODE_TYPE,
} from './BalanceSheet.types';
import { GConstructor } from '@/common/types/Constructor';
import { FinancialFilter } from '../../common/FinancialFilter';
import { BalanceSheetBase } from './BalanceSheetBase';
import { BalanceSheetRepository } from './BalanceSheetRepository';
import { FinancialSheet } from '../../common/FinancialSheet';
import { FinancialSheetStructure } from '../../common/FinancialSheetStructure';

export const BalanceSheetFiltering = <T extends GConstructor<FinancialSheet>>(
  Base: T,
) =>
  class extends flow(
    FinancialFilter,
    FinancialSheetStructure,
    BalanceSheetBase,
  )(Base) {
    /**
     * @description Repository.
     */
    readonly repository: BalanceSheetRepository;

    protected getSchemaNodeById: (id: string | number) => any;

    // -----------------------
    // # Account
    // -----------------------
    /**
     * Filter report node detarmine.
     * @param  {IBalanceSheetDataNode} node - Balance sheet node.
     * @return {boolean}
     */
    private accountNoneZeroNodesFilterDetarminer = (
      node: IBalanceSheetDataNode,
    ): boolean => {
      return ifElse(
        this.isNodeType(BALANCE_SHEET_NODE_TYPE.ACCOUNT),
        this.isNodeNoneZero,
        constant(true),
      )(node);
    };

    /**
     * Detarmines account none-transactions node.
     * @param   {IBalanceSheetDataNode} node
     * @returns {boolean}
     */
    private accountNoneTransFilterDetarminer = (
      node: IBalanceSheetDataNode,
    ): boolean => {
      return ifElse(
        this.isNodeType(BALANCE_SHEET_NODE_TYPE.ACCOUNT),
        this.isNodeNoneZero,
        constant(true),
      )(node);
    };

    /**
     * Report nodes filter.
     * @param  {IBalanceSheetSection[]} nodes -
     * @return {IBalanceSheetSection[]}
     */
    private accountsNoneZeroNodesFilter = (
      nodes: IBalanceSheetDataNode[],
    ): IBalanceSheetDataNode[] => {
      return this.filterNodesDeep(
        nodes,
        this.accountNoneZeroNodesFilterDetarminer,
      );
    };

    /**
     * Filters the accounts none-transactions nodes.
     * @param   {IBalanceSheetDataNode[]} nodes
     * @returns {IBalanceSheetDataNode[]}
     */
    private accountsNoneTransactionsNodesFilter = (
      nodes: IBalanceSheetDataNode[],
    ) => {
      return this.filterNodesDeep(nodes, this.accountNoneTransFilterDetarminer);
    };

    // -----------------------
    // # Aggregate/Accounts.
    // -----------------------
    /**
     * Detearmines aggregate none-children filtering.
     * @param   {IBalanceSheetDataNode} node
     * @returns {boolean}
     */
    private aggregateNoneChildrenFilterDetarminer = (
      node: IBalanceSheetDataNode,
    ): boolean => {
      // Detarmines whether the given node is aggregate or accounts node.
      const isAggregateOrAccounts =
        this.isNodeType(BALANCE_SHEET_NODE_TYPE.AGGREGATE)(node) ||
        this.isNodeType(BALANCE_SHEET_NODE_TYPE.ACCOUNTS)(node);

      // Retrieve the schema node of the given id.
      const schemaNode = this.getSchemaNodeById(node.id);

      // Detarmines if the schema node is always should show.
      const isSchemaAlwaysShow = get(schemaNode, 'alwaysShow', false);

      return isAggregateOrAccounts && !isSchemaAlwaysShow
        ? this.isNodeHasChildren(node as any)
        : true;
    };

    /**
     * Filters aggregate none-children nodes.
     * @param   {IBalanceSheetDataNode[]} nodes
     * @returns {IBalanceSheetDataNode[]}
     */
    private aggregateNoneChildrenFilter = (
      nodes: IBalanceSheetDataNode[],
    ): IBalanceSheetDataNode[] => {
      return this.filterNodesDeep2(
        this.aggregateNoneChildrenFilterDetarminer,
        nodes,
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
      nodes: IBalanceSheetDataNode[],
    ): IBalanceSheetDataNode[] => {
      return flow(
        this.accountsNoneZeroNodesFilter,
        this.aggregateNoneChildrenFilter,
      )(nodes);
    };

    /**
     * Filters none-transactions nodes.
     * @param   {IBalanceSheetDataNode[]} nodes
     * @returns {IBalanceSheetDataNode[]}
     */
    private filterNoneTransNodesCompose = (
      nodes: IBalanceSheetDataNode[],
    ): IBalanceSheetDataNode[] => {
      return flow(
        this.accountsNoneTransactionsNodesFilter,
        this.aggregateNoneChildrenFilter,
      )(nodes);
    };

    /**
     * Supress nodes when accounts transactions ledger is empty.
     * @param   {IBalanceSheetDataNode[]} nodes
     * @returns {IBalanceSheetDataNode[]}
     */
    private supressNodesWhenAccountsTransactionsEmpty = (
      nodes: IBalanceSheetDataNode[],
    ): IBalanceSheetDataNode[] => {
      return this.repository.totalAccountsLedger.isEmpty() ? [] : nodes;
    };

    /**
     * Compose report nodes filtering.
     * @param   {IBalanceSheetDataNode[]} nodes
     * @returns {IBalanceSheetDataNode[]}
     */
    protected reportFilterPlugin = (nodes: IBalanceSheetDataNode[]) => {
      return flow(
        when(
          constant(this.query.noneTransactions),
          this.filterNoneTransNodesCompose,
        ),
        when(constant(this.query.noneZero), this.filterNoneZeroNodesCompose),
        this.supressNodesWhenAccountsTransactionsEmpty,
      )(nodes);
    };
  };
