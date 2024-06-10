import * as R from 'ramda';
import { FinancialSheetStructure } from '../FinancialSheetStructure';
import {
  BALANCE_SHEET_SCHEMA_NODE_TYPE,
  IBalanceSheetAggregateNode,
  IBalanceSheetDataNode,
  IBalanceSheetSchemaAggregateNode,
  IBalanceSheetSchemaNode,
  INumberFormatQuery,
} from '@/interfaces';
import { BalanceSheetDatePeriods } from './BalanceSheetDatePeriods';
import { BalanceSheetComparsionPreviousPeriod } from './BalanceSheetComparsionPreviousPeriod';
import { BalanceSheetComparsionPreviousYear } from './BalanceSheetComparsionPreviousYear';
import { BalanceSheetPercentage } from './BalanceSheetPercentage';
import { BalanceSheetSchema } from './BalanceSheetSchema';
import { BalanceSheetBase } from './BalanceSheetBase';
import { BalanceSheetQuery } from './BalanceSheetQuery';

export const BalanceSheetAggregators = (Base: any) =>
  class extends R.compose(
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
     * Sets total amount that calculated from node children.
     * @param {IBalanceSheetSection} node
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
     * Mappes the aggregate schema node type.
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
        type: BALANCE_SHEET_SCHEMA_NODE_TYPE.AGGREGATE,
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
     * Mappes the given report schema node.
     * @param  {IBalanceSheetSchemaNode} node - Schema node.
     * @return {IBalanceSheetDataNode}
     */
    private reportAggregateSchemaParser = (
      node: IBalanceSheetSchemaNode
    ): IBalanceSheetDataNode => {
      return R.compose(
        R.when(
          this.isSchemaNodeType(BALANCE_SHEET_SCHEMA_NODE_TYPE.AGGREGATE),
          this.schemaAggregateNodeCompose
        ),
        R.when(
          this.isSchemaNodeType(BALANCE_SHEET_SCHEMA_NODE_TYPE.ACCOUNTS),
          this.schemaAggregateNodeCompose
        )
      )(node);
    };

    /**
     * Mappes the report schema nodes.
     * @param  {IBalanceSheetSchemaNode[]} nodes -
     * @return {IBalanceSheetStructureSection[]}
     */
    public aggregatesSchemaParser = (
      nodes: (IBalanceSheetSchemaNode | IBalanceSheetDataNode)[]
    ): (IBalanceSheetDataNode | IBalanceSheetSchemaNode)[] => {
      return this.mapNodesDeepReverse(nodes, this.reportAggregateSchemaParser);
    };
  };
