import * as R from 'ramda';
import { IProfitLossSheetQuery } from '@/interfaces/ProfitLossSheet';
import FinancialSheet from '../FinancialSheet';
import { FinancialSheetStructure } from '../FinancialSheetStructure';
import {
  ProfitLossNodeType,
  IProfitLossSheetEquationNode,
  IProfitLossEquationSchemaNode,
  IProfitLossSheetAccountsNode,
  IProfitLossAccountsSchemaNode,
  IProfitLossSchemaNode,
  IProfitLossSheetNode,
  IAccount,
  IProfitLossSheetAccountNode,
} from '@/interfaces';
import { ProfitLossShema } from './ProfitLossSchema';
import { ProfitLossSheetPercentage } from './ProfitLossSheetPercentage';
import { ProfitLossSheetQuery } from './ProfitLossSheetQuery';
import { ProfitLossSheetRepository } from './ProfitLossSheetRepository';
import { ProfitLossSheetBase } from './ProfitLossSheetBase';
import { ProfitLossSheetDatePeriods } from './ProfitLossSheetDatePeriods';
import { FinancialEvaluateEquation } from '../FinancialEvaluateEquation';
import { ProfitLossSheetPreviousYear } from './ProfitLossSheetPreviousYear';
import { ProfitLossSheetPreviousPeriod } from './ProfitLossSheetPreviousPeriod';
import { FinancialDateRanges } from '../FinancialDateRanges';
import { ProfitLossSheetFilter } from './ProfitLossSheetFilter';

export default class ProfitLossSheet extends R.compose(
  ProfitLossSheetPreviousYear,
  ProfitLossSheetPreviousPeriod,
  ProfitLossSheetPercentage,
  ProfitLossSheetDatePeriods,
  ProfitLossSheetFilter,
  ProfitLossShema,
  ProfitLossSheetBase,
  FinancialDateRanges,
  FinancialEvaluateEquation,
  FinancialSheetStructure
)(FinancialSheet) {
  /**
   * Profit/Loss sheet query.
   * @param {ProfitLossSheetQuery}
   */
  readonly query: ProfitLossSheetQuery;
  /**
   * @param {string}
   */
  readonly comparatorDateType: string;

  /**
   * Organization's base currency.
   * @param {string}
   */
  readonly baseCurrency: string;

  /**
   * Profit/Loss repository.
   * @param {ProfitLossSheetRepository}
   */
  readonly repository: ProfitLossSheetRepository;

  /**
   * Constructor method.
   * @param {IProfitLossSheetQuery} query -
   * @param {IAccount[]} accounts -
   * @param {IJournalPoster} transactionsJournal -
   */
  constructor(
    repository: ProfitLossSheetRepository,
    query: IProfitLossSheetQuery,
    baseCurrency: string,
    i18n: any
  ) {
    super();

    this.query = new ProfitLossSheetQuery(query);
    this.repository = repository;
    this.numberFormat = this.query.query.numberFormat;
    this.baseCurrency = baseCurrency;
    this.i18n = i18n;
  }

  /**
   * Retrieve the sheet account node from the given account.
   * @param   {IAccount} account
   * @returns {IProfitLossSheetAccountNode}
   */
  private accountNodeMapper = (
    account: IAccount
  ): IProfitLossSheetAccountNode => {
    const total = this.repository.totalAccountsLedger
      .whereAccountId(account.id)
      .getClosingBalance();

    return {
      id: account.id,
      name: account.name,
      nodeType: ProfitLossNodeType.ACCOUNT,
      total: this.getAmountMeta(total),
    };
  };

  /**
   * Compose account node.
   * @param   {IAccount} node
   * @returns {IProfitLossSheetAccountNode}
   */
  private accountNodeCompose = (
    account: IAccount
  ): IProfitLossSheetAccountNode => {
    return R.compose(
      R.when(
        this.query.isPreviousPeriodActive,
        this.previousPeriodAccountNodeCompose
      ),
      R.when(
        this.query.isPreviousYearActive,
        this.previousYearAccountNodeCompose
      ),
      R.when(
        this.query.isDatePeriodsColumnsType,
        this.assocAccountNodeDatePeriod
      ),
      this.accountNodeMapper
    )(account);
  };

  /**
   * Retrieve report accounts nodes by the given accounts types.
   * @param   {string[]} types
   * @returns {IBalanceSheetAccountNode}
   */
  private getAccountsNodesByTypes = (
    types: string[]
  ): IProfitLossSheetAccountNode[] => {
    return R.compose(
      R.map(this.accountNodeCompose),
      R.flatten,
      R.map(this.repository.getAccountsByType)
    )(types);
  };

  /**
   * Maps the accounts schema node to report node.
   * @param   {IProfitLossSchemaNode} node
   * @returns {IProfitLossSheetNode}
   */
  private accountsSchemaNodeMapper = (
    node: IProfitLossAccountsSchemaNode
  ): IProfitLossSheetNode => {
    // Retrieve accounts node by the given types.
    const children = this.getAccountsNodesByTypes(node.accountsTypes);

    // Retrieve the total of the given nodes.
    const total = this.getTotalOfNodes(children);

    return {
      id: node.id,
      name: this.i18n.__(node.name),
      nodeType: ProfitLossNodeType.ACCOUNTS,
      total: this.getTotalAmountMeta(total),
      children,
    };
  };

  /**
   * Accounts schema node composer.
   * @param   {IProfitLossSchemaNode} node
   * @returns {IProfitLossSheetAccountsNode}
   */
  private accountsSchemaNodeCompose = (
    node: IProfitLossSchemaNode
  ): IProfitLossSheetAccountsNode => {
    return R.compose(
      R.when(
        this.query.isPreviousPeriodActive,
        this.previousPeriodAggregateNodeCompose
      ),
      R.when(
        this.query.isPreviousYearActive,
        this.previousYearAggregateNodeCompose
      ),
      R.when(
        this.query.isDatePeriodsColumnsType,
        this.assocAggregateDatePeriod
      ),
      this.accountsSchemaNodeMapper
    )(node);
  };

  /**
   * Equation schema node parser.
   * @param {(IProfitLossSchemaNode | IProfitLossSheetNode)[]} accNodes -
   * @param {IProfitLossEquationSchemaNode} node -
   * @param {IProfitLossSheetEquationNode}
   */
  private equationSchemaNodeParser = R.curry(
    (
      accNodes: (IProfitLossSchemaNode | IProfitLossSheetNode)[],
      node: IProfitLossEquationSchemaNode
    ): IProfitLossSheetEquationNode => {
      const tableNodes = this.getNodesTableForEvaluating(
        'total.amount',
        accNodes
      );
      // Evaluate the given equation.
      const total = this.evaluateEquation(node.equation, tableNodes);

      return {
        id: node.id,
        name: this.i18n.__(node.name),
        nodeType: ProfitLossNodeType.EQUATION,
        total: this.getTotalAmountMeta(total),
      };
    }
  );

  /**
   * Equation schema node composer.
   * @param   {(IProfitLossSchemaNode | IProfitLossSheetNode)[]} accNodes -
   * @param   {IProfitLossSchemaNode} node -
   * @returns {IProfitLossSheetEquationNode}
   */
  private equationSchemaNodeCompose = R.curry(
    (
      accNodes: (IProfitLossSchemaNode | IProfitLossSheetNode)[],
      node: IProfitLossEquationSchemaNode
    ): IProfitLossSheetEquationNode => {
      return R.compose(
        R.when(
          this.query.isPreviousPeriodActive,
          this.previousPeriodEquationNodeCompose(accNodes, node.equation)
        ),
        R.when(
          this.query.isPreviousYearActive,
          this.previousYearEquationNodeCompose(accNodes, node.equation)
        ),
        R.when(
          this.query.isDatePeriodsColumnsType,
          this.assocEquationNodeDatePeriod(accNodes, node.equation)
        ),
        this.equationSchemaNodeParser(accNodes)
      )(node);
    }
  );

  /**
   * Parses accounts schema node to report node.
   * @param   {IProfitLossSchemaNode} schemaNode
   * @returns {IProfitLossSheetNode | IProfitLossSchemaNode}
   */
  private accountsSchemaNodeMap = (
    schemaNode: IProfitLossSchemaNode
  ): IProfitLossSheetNode | IProfitLossSchemaNode => {
    return R.compose(
      R.when(
        this.isNodeType(ProfitLossNodeType.ACCOUNTS),
        this.accountsSchemaNodeCompose
      )
    )(schemaNode);
  };

  /**
   * Composes schema equation node to report node.
   * @param   {IProfitLossSheetNode | IProfitLossSchemaNode} node
   * @param   {number} key
   * @param   {IProfitLossSheetNode | IProfitLossSchemaNode} parentValue
   * @param   {(IProfitLossSheetNode | IProfitLossSchemaNode)[]} accNodes
   * @param   context
   * @returns {IProfitLossSheetEquationNode}
   */
  private reportSchemaEquationNodeCompose = (
    node: IProfitLossSheetNode | IProfitLossSchemaNode,
    key: number,
    parentValue: IProfitLossSheetNode | IProfitLossSchemaNode,
    accNodes: (IProfitLossSheetNode | IProfitLossSchemaNode)[],
    context
  ): IProfitLossSheetEquationNode => {
    return R.compose(
      R.when(
        this.isNodeType(ProfitLossNodeType.EQUATION),
        this.equationSchemaNodeCompose(accNodes)
      )
    )(node);
  };

  /**
   * Parses schema accounts nodes.
   * @param   {IProfitLossSchemaNode[]}
   * @returns {(IProfitLossSheetNode | IProfitLossSchemaNode)[]}
   */
  private reportSchemaAccountsNodesCompose = (
    schemaNodes: IProfitLossSchemaNode[]
  ): (IProfitLossSheetNode | IProfitLossSchemaNode)[] => {
    return this.mapNodesDeep(schemaNodes, this.accountsSchemaNodeMap);
  };

  /**
   * Parses schema equation nodes.
   * @param   {(IProfitLossSheetNode | IProfitLossSchemaNode)[]} nodes
   * @returns {(IProfitLossSheetNode | IProfitLossSchemaNode)[]}
   */
  private reportSchemaEquationNodesCompose = (
    nodes: (IProfitLossSheetNode | IProfitLossSchemaNode)[]
  ): (IProfitLossSheetNode | IProfitLossSchemaNode)[] => {
    return this.mapAccNodesDeep(nodes, this.reportSchemaEquationNodeCompose);
  };

  /**
   * Retrieve profit/loss report data.
   * @return {IProfitLossSheetStatement}
   */
  public reportData = (): IProfitLossSheetNode => {
    const schema = this.getSchema();

    return R.compose(
      this.reportFilterPlugin,
      this.reportRowsPercentageCompose,
      this.reportColumnsPerentageCompose,
      this.reportSchemaEquationNodesCompose,
      this.reportSchemaAccountsNodesCompose
    )(schema);
  };
}
