import { flow } from 'fp-ts/function';
import { when } from '@/common/fp';
import { ModelObject } from 'objection';
import { I18nService } from 'nestjs-i18n';
import {
  ProfitLossNodeType,
  IProfitLossSheetEquationNode,
  IProfitLossEquationSchemaNode,
  IProfitLossSheetAccountsNode,
  IProfitLossAccountsSchemaNode,
  IProfitLossSchemaNode,
  IProfitLossSheetNode,
  IProfitLossSheetAccountNode,
  IProfitLossSheetQuery,
} from './ProfitLossSheet.types';
import { ProfitLossShema } from './ProfitLossSchema';
import { ProfitLossSheetPercentage } from './ProfitLossSheetPercentage';
import { ProfitLossSheetQuery } from './ProfitLossSheetQuery';
import { ProfitLossSheetRepository } from './ProfitLossSheetRepository';
import { ProfitLossSheetBase } from './ProfitLossSheetBase';
import { ProfitLossSheetDatePeriods } from './ProfitLossSheetDatePeriods';
import { ProfitLossSheetPreviousYear } from './ProfitLossSheetPreviousYear';
import { ProfitLossSheetPreviousPeriod } from './ProfitLossSheetPreviousPeriod';
import { ProfitLossSheetFilter } from './ProfitLossSheetFilter';
import { FinancialDateRanges } from '../../common/FinancialDateRanges';
import { FinancialEvaluateEquation } from '../../common/FinancialEvaluateEquation';
import { FinancialSheetStructure } from '../../common/FinancialSheetStructure';
import { FinancialSheet } from '../../common/FinancialSheet';
import { Account } from '@/modules/Accounts/models/Account.model';
import { flatToNestedArray } from '@/utils/flat-to-nested-array';
import {
  IFinancialReportMeta,
  DEFAULT_REPORT_META,
} from '../../types/Report.types';

export default class ProfitLossSheet extends ProfitLossSheetPreviousYear(
  flow(
    ProfitLossSheetPreviousPeriod,
    ProfitLossSheetPercentage,
    ProfitLossSheetDatePeriods,
    ProfitLossSheetFilter,
    ProfitLossShema,
    ProfitLossSheetBase,
    FinancialDateRanges,
    FinancialEvaluateEquation,
    FinancialSheetStructure,
  )(FinancialSheet),
) {
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
   * I18n service.
   * @param {I18nService}
   */
  readonly i18n: I18nService;

  /**
   * Constructor method.
   * @param {ProfitLossSheetRepository} repository -
   * @param {IProfitLossSheetQuery} query -
   * @param {I18nService} i18n -
   * @param {IFinancialReportMeta} meta -
   */
  constructor(
    repository: ProfitLossSheetRepository,
    query: IProfitLossSheetQuery,
    i18n: I18nService,
    meta: IFinancialReportMeta,
  ) {
    super();

    this.query = new ProfitLossSheetQuery(query);
    this.repository = repository;
    this.baseCurrency = meta.baseCurrency;
    this.numberFormat = this.query.query.numberFormat;
    this.dateFormat = meta.dateFormat || DEFAULT_REPORT_META.dateFormat;
    this.i18n = i18n;
  }

  /**
   * Retrieve the sheet account node from the given account.
   * @param {ModelObject<Account>} account
   * @returns {IProfitLossSheetAccountNode}
   */
  private accountNodeMapper = (
    account: ModelObject<Account>,
  ): IProfitLossSheetAccountNode => {
    // Retrieves the account ids including its children account ids.
    const accountIds = this.repository.getAccountsIdsIncludingChildren(
      account.id,
    );

    // Retrieves the closing balance of the account included children accounts.
    const total = this.repository.totalAccountsLedger
      .whereAccountsIds(accountIds)
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
   * @param {ModelObject<Account>} node
   * @returns {IProfitLossSheetAccountNode}
   */
  private accountNodeCompose = (
    account: ModelObject<Account>,
  ): IProfitLossSheetAccountNode => {
    return flow(
      this.accountNodeMapper,
      when(
        this.query.isDatePeriodsColumnsType,
        this.assocAccountNodeDatePeriod,
      ),
      when(
        this.query.isPreviousYearActive,
        this.previousYearAccountNodeCompose,
      ),
      when(
        this.query.isPreviousPeriodActive,
        this.previousPeriodAccountNodeCompose,
      ),
    )(account);
  };

  /**
   * Retrieves report accounts nodes by the given accounts types.
   * @param {string[]} types
   * @returns {IBalanceSheetAccountNode}
   */
  private getAccountsNodesByTypes = (
    types: string[],
  ): IProfitLossSheetAccountNode[] => {
    const accounts = this.repository.getAccountsByType(types);
    const accountsTree = flatToNestedArray(accounts, {
      id: 'id',
      parentId: 'parentAccountId',
    });
    return this.mapNodesDeep(accountsTree, this.accountNodeCompose);
  };

  /**
   * Mapps the accounts schema node to report node.
   * @param {IProfitLossSchemaNode} node
   * @returns {IProfitLossSheetNode}
   */
  private accountsSchemaNodeMapper = (
    node: IProfitLossAccountsSchemaNode,
  ): IProfitLossSheetAccountsNode => {
    // Retrieve accounts node by the given types.
    const children = this.getAccountsNodesByTypes(node.accountsTypes);

    // Retrieve the total of the given nodes.
    const total = this.getTotalOfNodes(children);

    return {
      id: node.id,
      name: this.i18n.t(node.name),
      nodeType: ProfitLossNodeType.ACCOUNTS,
      total: this.getTotalAmountMeta(total),
      children,
    };
  };

  /**
   * Accounts schema node composer.
   * @param {IProfitLossSchemaNode} node
   * @returns {IProfitLossSheetAccountsNode}
   */
  private accountsSchemaNodeCompose = (
    node: IProfitLossSchemaNode,
  ): IProfitLossSheetAccountsNode => {
    return flow(
      (aggregateNode: IProfitLossSchemaNode) =>
        this.accountsSchemaNodeMapper(
          aggregateNode as IProfitLossAccountsSchemaNode,
        ),
      when(this.query.isDatePeriodsColumnsType, this.assocAggregateDatePeriod),
      when(
        this.query.isPreviousYearActive,
        this.previousYearAggregateNodeCompose,
      ),
      when(
        this.query.isPreviousPeriodActive,
        this.previousPeriodAggregateNodeCompose,
      ),
    )(node) as IProfitLossSheetAccountsNode;
  };

  /**
   * Equation schema node parser.
   * @param {(IProfitLossSchemaNode | IProfitLossSheetNode)[]} accNodes -
   * @param {IProfitLossEquationSchemaNode} node -
   * @param {IProfitLossSheetEquationNode}
   */
  private equationSchemaNodeParser =
    (accNodes: (IProfitLossSchemaNode | IProfitLossSheetNode)[]) =>
    (node: IProfitLossEquationSchemaNode): IProfitLossSheetEquationNode => {
      const tableNodes = this.getNodesTableForEvaluating(
        'total.amount',
        accNodes,
      );
      // Evaluate the given equation.
      const total = this.evaluateEquation(node.equation, tableNodes);

      return {
        id: node.id,
        name: this.i18n.t(node.name),
        nodeType: ProfitLossNodeType.EQUATION,
        total: this.getTotalAmountMeta(total),
      };
    };

  /**
   * Equation schema node composer.
   * @param {(IProfitLossSchemaNode | IProfitLossSheetNode)[]} accNodes -
   * @param {IProfitLossSchemaNode} node -
   * @returns {IProfitLossSheetEquationNode}
   */
  private equationSchemaNodeCompose =
    (accNodes: (IProfitLossSchemaNode | IProfitLossSheetNode)[]) =>
    (node: IProfitLossEquationSchemaNode): IProfitLossSheetEquationNode => {
      return flow(
        this.equationSchemaNodeParser(accNodes),
        when(
          this.query.isDatePeriodsColumnsType,
          this.assocEquationNodeDatePeriod(accNodes, node.equation),
        ),
        when(
          this.query.isPreviousYearActive,
          this.previousYearEquationNodeCompose(accNodes, node.equation),
        ),
        when(
          this.query.isPreviousPeriodActive,
          this.previousPeriodEquationNodeCompose(accNodes, node.equation),
        ),
      )(node) as IProfitLossSheetEquationNode;
    };

  /**
   * Parses accounts schema node to report node.
   * @param {IProfitLossSchemaNode} schemaNode
   * @returns {IProfitLossSheetNode | IProfitLossSchemaNode}
   */
  private accountsSchemaNodeMap = (
    schemaNode: IProfitLossSchemaNode,
  ): IProfitLossSheetNode | IProfitLossSchemaNode => {
    return when<IProfitLossSheetNode | IProfitLossSchemaNode>(
      this.isNodeType(ProfitLossNodeType.ACCOUNTS),
      this.accountsSchemaNodeCompose,
    )(schemaNode);
  };

  /**
   * Composes schema equation node to report node.
   * @param {IProfitLossSheetNode | IProfitLossSchemaNode} node
   * @param {number} key
   * @param {IProfitLossSheetNode | IProfitLossSchemaNode} parentValue
   * @param {(IProfitLossSheetNode | IProfitLossSchemaNode)[]} accNodes
   * @param context
   * @returns {IProfitLossSheetEquationNode}
   */
  private reportSchemaEquationNodeCompose = (
    node: IProfitLossSheetNode | IProfitLossSchemaNode,
    key: number,
    parentValue: IProfitLossSheetNode | IProfitLossSchemaNode,
    accNodes: (IProfitLossSheetNode | IProfitLossSchemaNode)[],
    _context,
  ): IProfitLossSheetEquationNode => {
    return when<IProfitLossSheetNode | IProfitLossSchemaNode>(
      this.isNodeType(ProfitLossNodeType.EQUATION),
      this.equationSchemaNodeCompose(accNodes),
    )(node) as IProfitLossSheetEquationNode;
  };

  /**
   * Parses schema accounts nodes.
   * @param {IProfitLossSchemaNode[]}
   * @returns {(IProfitLossSheetNode | IProfitLossSchemaNode)[]}
   */
  private reportSchemaAccountsNodesCompose = (
    schemaNodes: IProfitLossSchemaNode[],
  ): (IProfitLossSheetNode | IProfitLossSchemaNode)[] => {
    return this.mapNodesDeep(schemaNodes, this.accountsSchemaNodeMap);
  };

  /**
   * Parses schema equation nodes.
   * @param {(IProfitLossSheetNode | IProfitLossSchemaNode)[]} nodes
   * @returns {IProfitLossSheetNode[]}
   */
  private reportSchemaEquationNodesCompose = (
    nodes: (IProfitLossSheetNode | IProfitLossSchemaNode)[],
  ): IProfitLossSheetNode[] => {
    return this.mapAccNodesDeep(nodes, this.reportSchemaEquationNodeCompose);
  };

  /**
   * Retrieve profit/loss report data.
   * @return {IProfitLossSheetStatement}
   */
  public reportData = (): Array<IProfitLossSheetNode> => {
    const schema = this.getSchema();

    return flow(
      this.reportSchemaAccountsNodesCompose,
      this.reportSchemaEquationNodesCompose,
      this.reportColumnsPerentageCompose,
      this.reportRowsPercentageCompose,
      this.reportFilterPlugin,
    )(schema);
  };
}
