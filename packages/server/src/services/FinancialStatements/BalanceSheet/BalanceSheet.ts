import * as R from 'ramda';
import { defaultTo, isEmpty, sumBy } from 'lodash';
import FinancialSheet from '../FinancialSheet';
import {
  IBalanceSheetAggregateNode,
  IBalanceSheetAccountNode,
  BALANCE_SHEET_SCHEMA_NODE_TYPE,
  IBalanceSheetQuery,
  INumberFormatQuery,
  IAccount,
  IBalanceSheetSchemaNode,
  IBalanceSheetSchemaAggregateNode,
  IBalanceSheetDataNode,
  IBalanceSheetSchemaAccountNode,
  IBalanceSheetCommonNode,
} from '../../../interfaces';
import { BalanceSheetSchema } from './BalanceSheetSchema';
import { BalanceSheetPercentage } from './BalanceSheetPercentage';
import { BalanceSheetComparisonPreviousPeriod } from './BalanceSheetComparisonPreviousPeriod';
import { BalanceSheetComparisonPreviousYear } from './BalanceSheetComparisonPreviousYear';
import { BalanceSheetDatePeriods } from './BalanceSheetDatePeriods';
import { BalanceSheetBase } from './BalanceSheetBase';
import { FinancialSheetStructure } from '../FinancialSheetStructure';
import BalanceSheetRepository from './BalanceSheetRepository';
import { BalanceSheetQuery } from './BalanceSheetQuery';
import { BalanceSheetFiltering } from './BalanceSheetFiltering';

export default class BalanceSheet extends R.compose(
  BalanceSheetFiltering,
  BalanceSheetDatePeriods,
  BalanceSheetComparisonPreviousPeriod,
  BalanceSheetComparisonPreviousYear,
  BalanceSheetPercentage,
  BalanceSheetSchema,
  BalanceSheetBase,
  FinancialSheetStructure
)(FinancialSheet) {
  /**
   * Balance sheet query.
   * @param {BalanceSheetQuery}
   */
  readonly query: BalanceSheetQuery;

  /**
   * Balance sheet number format query.
   * @param {INumberFormatQuery}
   */
  readonly numberFormat: INumberFormatQuery;

  /**
   * Base currency of the organization.
   * @param {string}
   */
  readonly baseCurrency: string;

  readonly i18n: any;

  /**
   * Constructor method.
   * @param {IBalanceSheetQuery} query -
   * @param {IAccount[]} accounts -
   * @param {string} baseCurrency -
   */
  constructor(
    query: IBalanceSheetQuery,
    repository: BalanceSheetRepository,
    baseCurrency: string,
    i18n
  ) {
    super();

    this.query = new BalanceSheetQuery(query);
    this.repository = repository;
    this.baseCurrency = baseCurrency;
    this.numberFormat = this.query.query.numberFormat;
    this.i18n = i18n;
  }

  /**
   * Retrieve the accounts node of accounts types.
   * @param   {string} accountsTypes
   * @returns {IAccount[]}
   */
  private getAccountsByAccountTypes = (accountsTypes: string[]): IAccount[] => {
    const mapAccountsByTypes = R.map((accountType) =>
      defaultTo(this.repository.accountsByType.get(accountType), [])
    );
    return R.compose(R.flatten, mapAccountsByTypes)(accountsTypes);
  };

  /**
   * Maps the aggregate schema node type.
   * @param  {IBalanceSheetSchemaAggregateNode} node - Schema node.
   * @return {IBalanceSheetAggregateNode}
   */
  private reportSchemaAggregateNodeMapper = (
    node: IBalanceSheetSchemaAggregateNode
  ): IBalanceSheetAggregateNode => {
    const total = this.getTotalOfNodes(node.children);

    return {
      name: this.i18n.__(node.name),
      id: node.id,
      nodeType: BALANCE_SHEET_SCHEMA_NODE_TYPE.AGGREGATE,
      total: this.getTotalAmountMeta(total),
      children: node.children,
    };
  };

  /**
   * Compose shema aggregate node of balance sheet schema.
   * @param   {IBalanceSheetSchemaAggregateNode} node
   * @returns {IBalanceSheetSchemaAggregateNode}
   */
  private schemaAggregateNodeCompose = (
    node: IBalanceSheetSchemaAggregateNode
  ) => {
    return R.compose(
      this.aggregateNodeTotalMapper,
      this.reportSchemaAggregateNodeMapper
    )(node);
  };

  /**
   * Maps the account model to report account node.
   * @param   {IAccount} account
   * @returns {IBalanceSheetAccountNode}
   */
  private reportSchemaAccountNodeMapper = (
    account: IAccount
  ): IBalanceSheetAccountNode => {
    const total = this.repository.totalAccountsLedger
      .whereAccountId(account.id)
      .getClosingBalance();

    return {
      id: account.id,
      index: account.index,
      name: account.name,
      code: account.code,
      total: this.getAmountMeta(total),
      nodeType: BALANCE_SHEET_SCHEMA_NODE_TYPE.ACCOUNT,
    };
  };

  /**
   *
   * @param   {IAccount} account
   * @returns {IBalanceSheetAccountNode}
   */
  private reportSchemaAccountNodeComposer = (
    account: IAccount
  ): IBalanceSheetAccountNode => {
    return R.compose(
      R.when(
        this.query.isPreviousYearActive,
        this.previousYearAccountNodeComposer
      ),
      R.when(
        this.query.isPreviousPeriodActive,
        this.previousPeriodAccountNodeComposer
      ),
      R.when(
        this.query.isDatePeriodsColumnsType,
        this.assocAccountNodeDatePeriods
      ),
      this.reportSchemaAccountNodeMapper
    )(account);
  };

  /**
   * Retrieve the total of the given nodes.
   * @param   {IBalanceSheetCommonNode[]} nodes
   * @returns {number}
   */
  private getTotalOfNodes = (nodes: IBalanceSheetCommonNode[]) => {
    return sumBy(nodes, 'total.amount');
  };

  /**
   * Retrieve the report accounts node by the given accounts types.
   * @param   {string[]} accountsTypes
   * @returns {}
   */
  private getAccountsNodesByAccountTypes = (accountsTypes: string[]) => {
    const accounts = this.getAccountsByAccountTypes(accountsTypes);

    return R.compose(R.map(this.reportSchemaAccountNodeComposer))(accounts);
  };

  /**
   * Maps the accounts schema node type.
   * @param   {IBalanceSheetSchemaNode} node - Schema node.
   * @returns {IBalanceSheetAccountNode}
   */
  private reportSchemaAccountsNodeMapper = (
    node: IBalanceSheetSchemaAccountNode
  ): IBalanceSheetAccountNode => {
    const accounts = this.getAccountsNodesByAccountTypes(node.accountsTypes);
    const total = this.getTotalOfNodes(accounts);

    return {
      id: node.id,
      name: this.i18n.__(node.name),
      type: node.type,
      nodeType: BALANCE_SHEET_SCHEMA_NODE_TYPE.ACCOUNTS,
      children: accounts,
      total: this.getTotalAmountMeta(total),
    };
  };

  /**
   * Compose account schema node to report node.
   * @param   {IBalanceSheetSchemaAccountNode} node
   * @returns {IBalanceSheetAccountNode}
   */
  private reportSchemaAccountsNodeComposer = (
    node: IBalanceSheetSchemaAccountNode
  ): IBalanceSheetAccountNode => {
    return R.compose(
      R.when(
        this.query.isPreviousYearActive,
        this.previousYearAggregateNodeComposer
      ),
      R.when(
        this.query.isPreviousPeriodActive,
        this.previousPeriodAggregateNodeComposer
      ),
      R.when(
        this.query.isDatePeriodsColumnsType,
        this.assocAccountsNodeDatePeriods
      ),
      this.reportSchemaAccountsNodeMapper
    )(node);
  };

  /**
   * Maps the given report schema node.
   * @param  {IBalanceSheetSchemaNode} node - Schema node.
   * @return {IBalanceSheetDataNode}
   */
  private reportSchemaNodeMapper = (
    schemaNode: IBalanceSheetSchemaNode
  ): IBalanceSheetDataNode => {
    return R.compose(
      R.when(
        this.isSchemaNodeType(BALANCE_SHEET_SCHEMA_NODE_TYPE.AGGREGATE),
        this.schemaAggregateNodeCompose
      ),
      R.when(
        this.isSchemaNodeType(BALANCE_SHEET_SCHEMA_NODE_TYPE.ACCOUNTS),
        this.reportSchemaAccountsNodeComposer
      )
    )(schemaNode);
  };

  /**
   * Maps the report schema nodes.
   * @param  {IBalanceSheetSchemaNode[]} nodes -
   * @return {IBalanceSheetStructureSection[]}
   */
  private reportSchemaAccountNodesMapper = (
    schemaNodes: IBalanceSheetSchemaNode[]
  ): IBalanceSheetDataNode[] => {
    return this.mapNodesDeepReverse(schemaNodes, this.reportSchemaNodeMapper);
  };

  /**
   * Sets total amount that calculated from node children.
   * @param   {IBalanceSheetSection} node
   * @returns {IBalanceSheetDataNode}
   */
  private aggregateNodeTotalMapper = (
    node: IBalanceSheetDataNode
  ): IBalanceSheetDataNode => {
    return R.compose(
      R.when(
        this.query.isPreviousYearActive,
        this.previousYearAggregateNodeComposer
      ),
      R.when(
        this.query.isPreviousPeriodActive,
        this.previousPeriodAggregateNodeComposer
      ),
      R.when(
        this.query.isDatePeriodsColumnsType,
        this.assocAggregateNodeDatePeriods
      )
    )(node);
  };

  /**
   * Retrieve the report statement data.
   * @returns {IBalanceSheetDataNode[]}
   */
  public reportData = () => {
    const balanceSheetSchema = this.getSchema();

    return R.compose(
      this.reportFilterPlugin,
      this.reportPercentageCompose,
      this.reportSchemaAccountNodesMapper
    )(balanceSheetSchema);
  };
}
