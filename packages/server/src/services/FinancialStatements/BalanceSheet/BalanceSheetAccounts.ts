import * as R from 'ramda';
import { defaultTo, toArray } from 'lodash';
import { FinancialSheetStructure } from '../FinancialSheetStructure';
import {
  BALANCE_SHEET_SCHEMA_NODE_TYPE,
  IAccount,
  IBalanceSheetAccountNode,
  IBalanceSheetAccountsNode,
  IBalanceSheetDataNode,
  IBalanceSheetSchemaAccountNode,
  IBalanceSheetSchemaNode,
  INumberFormatQuery,
} from '@/interfaces';
import { BalanceSheetNetIncome } from './BalanceSheetNetIncome';
import { BalanceSheetFiltering } from './BalanceSheetFiltering';
import { BalanceSheetDatePeriods } from './BalanceSheetDatePeriods';
import { BalanceSheetComparsionPreviousPeriod } from './BalanceSheetComparsionPreviousPeriod';
import { BalanceSheetComparsionPreviousYear } from './BalanceSheetComparsionPreviousYear';
import { BalanceSheetPercentage } from './BalanceSheetPercentage';
import { BalanceSheetSchema } from './BalanceSheetSchema';
import { BalanceSheetBase } from './BalanceSheetBase';
import { BalanceSheetQuery } from './BalanceSheetQuery';
import { flatToNestedArray } from '@/utils';
import BalanceSheetRepository from './BalanceSheetRepository';

export const BalanceSheetAccounts = (Base: any) =>
  class extends R.compose(
    BalanceSheetNetIncome,
    BalanceSheetFiltering,
    BalanceSheetDatePeriods,
    BalanceSheetComparsionPreviousPeriod,
    BalanceSheetComparsionPreviousYear,
    BalanceSheetPercentage,
    BalanceSheetSchema,
    BalanceSheetBase,
    FinancialSheetStructure
  )(Base) {
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

    /**
     * Localization.
     */
    readonly i18n: any;

    /**
     * Balance sheet repository.
     */
    readonly repository: BalanceSheetRepository;

    /**
     * Retrieve the accounts node of accounts types.
     * @param   {string} accountsTypes
     * @returns {IAccount[]}
     */
    private getAccountsByAccountTypes = (
      accountsTypes: string[]
    ): IAccount[] => {
      const mapAccountsByTypes = R.map((accountType) =>
        defaultTo(this.repository.accountsByType.get(accountType), [])
      );
      return R.compose(R.flatten, mapAccountsByTypes)(accountsTypes);
    };

    /**
     * Mappes the account model to report account node.
     * @param   {IAccount} account
     * @returns {IBalanceSheetAccountNode}
     */
    private reportSchemaAccountNodeMapper = (
      account: IAccount
    ): IBalanceSheetAccountNode => {
      const childrenAccountsIds = this.repository.accountsGraph.dependenciesOf(
        account.id
      );
      const accountIds = R.uniq(R.append(account.id, childrenAccountsIds));
      const total = this.repository.totalAccountsLedger
        .whereAccountsIds(accountIds)
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
     * Mappes the given account model to the balance sheet account node.
     * @param {IAccount} account
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

    // -----------------------------
    // - Accounts Node Praser
    // -----------------------------
    /**
     * Retrieve the report accounts node by the given accounts types.
     * @param {string[]} accountsTypes
     * @returns {IBalanceSheetAccountNode[]}
     */
    private getAccountsNodesByAccountTypes = (
      accountsTypes: string[]
    ): IBalanceSheetAccountNode[] => {
      // Retrieves accounts from the given defined node account types.
      const accounts = this.getAccountsByAccountTypes(accountsTypes);

      // Converts the flatten accounts to tree.
      const accountsTree = flatToNestedArray(accounts, {
        id: 'id',
        parentId: 'parentAccountId',
      });
      // Maps over the accounts tree.
      return this.mapNodesDeep(
        accountsTree,
        this.reportSchemaAccountNodeComposer
      );
    };

    /**
     * Mappes the accounts schema node type.
     * @param   {IBalanceSheetSchemaNode} node - Schema node.
     * @returns {IBalanceSheetAccountNode}
     */
    private reportSchemaAccountsNodeMapper = (
      node: IBalanceSheetSchemaAccountNode
    ): IBalanceSheetAccountsNode => {
      const accounts = this.getAccountsNodesByAccountTypes(node.accountsTypes);
      const children = toArray(node?.children);

      return {
        id: node.id,
        name: this.i18n.__(node.name),
        nodeType: BALANCE_SHEET_SCHEMA_NODE_TYPE.ACCOUNTS,
        type: BALANCE_SHEET_SCHEMA_NODE_TYPE.ACCOUNTS,
        children: [...accounts, ...children],
        total: this.getTotalAmountMeta(0),
      };
    };

    /**
     * Mappes the given report schema node.
     * @param {IBalanceSheetSchemaNode | IBalanceSheetDataNode} node - Schema node.
     * @return {IBalanceSheetSchemaNode | IBalanceSheetDataNode}
     */
    private reportAccountSchemaParser = (
      node: IBalanceSheetSchemaNode | IBalanceSheetDataNode
    ): IBalanceSheetSchemaNode | IBalanceSheetDataNode => {
      return R.compose(
        R.when(
          this.isSchemaNodeType(BALANCE_SHEET_SCHEMA_NODE_TYPE.ACCOUNTS),
          this.reportSchemaAccountsNodeMapper
        )
      )(node);
    };

    /**
     * Parses the report accounts schema nodes.
     * @param {IBalanceSheetSchemaNode[]} nodes -
     * @return {IBalanceSheetStructureSection[]}
     */
    public accountsSchemaParser = (
      nodes: (IBalanceSheetSchemaNode | IBalanceSheetDataNode)[]
    ): (IBalanceSheetDataNode | IBalanceSheetSchemaNode)[] => {
      return this.mapNodesDeepReverse(nodes, this.reportAccountSchemaParser);
    };
  };
