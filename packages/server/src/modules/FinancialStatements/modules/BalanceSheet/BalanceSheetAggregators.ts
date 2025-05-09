// @ts-nocheck
import * as R from 'ramda';
import { I18nService } from 'nestjs-i18n';
import {
  BALANCE_SHEET_SCHEMA_NODE_TYPE,
  IBalanceSheetAggregateNode,
  IBalanceSheetDataNode,
  IBalanceSheetSchemaAggregateNode,
  IBalanceSheetSchemaNode,
} from './BalanceSheet.types';
import { BalanceSheetDatePeriods } from './BalanceSheetDatePeriods';
import { BalanceSheetComparsionPreviousPeriod } from './BalanceSheetComparsionPreviousPeriod';
import { BalanceSheetComparsionPreviousYear } from './BalanceSheetComparsionPreviousYear';
import { BalanceSheetPercentage } from './BalanceSheetPercentage';
import { BalanceSheetSchema } from './BalanceSheetSchema';
import { BalanceSheetBase } from './BalanceSheetBase';
import { BalanceSheetQuery } from './BalanceSheetQuery';
import { FinancialSheetStructure } from '../../common/FinancialSheetStructure';
import { GConstructor } from '@/common/types/Constructor';
import { INumberFormatQuery } from '../../types/Report.types';
import { FinancialSheet } from '../../common/FinancialSheet';

export const BalanceSheetAggregators = <T extends GConstructor<FinancialSheet>>(
  Base: T,
) =>
  class extends R.pipe(
    BalanceSheetDatePeriods,
    BalanceSheetComparsionPreviousPeriod,
    BalanceSheetComparsionPreviousYear,
    BalanceSheetPercentage,
    BalanceSheetSchema,
    FinancialSheetStructure,
    BalanceSheetBase,
  )(Base) {
    public readonly i18n: I18nService;

    /**
     * Balance sheet query.
     * @param {BalanceSheetQuery}
     */
    public readonly query: BalanceSheetQuery;

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
    public aggregateNodeTotalMapper = (
      node: IBalanceSheetDataNode,
    ): IBalanceSheetDataNode => {
      return R.compose(
        R.when(
          this.query.isPreviousYearActive,
          this.previousYearAggregateNodeComposer,
        ),
        R.when(
          this.query.isPreviousPeriodActive,
          this.previousPeriodAggregateNodeComposer,
        ),
        R.when(
          this.query.isDatePeriodsColumnsType,
          this.assocAggregateNodeDatePeriods,
        ),
      )(node);
    };

    /**
     * Mappes the aggregate schema node type.
     * @param  {IBalanceSheetSchemaAggregateNode} node - Schema node.
     * @return {IBalanceSheetAggregateNode}
     */
    public reportSchemaAggregateNodeMapper = (
      node: IBalanceSheetSchemaAggregateNode,
    ): IBalanceSheetAggregateNode => {
      const total = this.getTotalOfNodes(node.children);

      return {
        name: this.i18n.t(node.name),
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
    public schemaAggregateNodeCompose = (
      node: IBalanceSheetSchemaAggregateNode,
    ) => {
      return R.compose(
        this.aggregateNodeTotalMapper,
        this.reportSchemaAggregateNodeMapper,
      )(node);
    };

    /**
     * Mappes the given report schema node.
     * @param  {IBalanceSheetSchemaNode} node - Schema node.
     * @return {IBalanceSheetDataNode}
     */
    public reportAggregateSchemaParser = (
      node: IBalanceSheetSchemaNode,
    ): IBalanceSheetDataNode => {
      return R.compose(
        R.when(
          this.isSchemaNodeType(BALANCE_SHEET_SCHEMA_NODE_TYPE.AGGREGATE),
          this.schemaAggregateNodeCompose,
        ),
        R.when(
          this.isSchemaNodeType(BALANCE_SHEET_SCHEMA_NODE_TYPE.ACCOUNTS),
          this.schemaAggregateNodeCompose,
        ),
      )(node);
    };

    /**
     * Mappes the report schema nodes.
     * @param  {IBalanceSheetSchemaNode[]} nodes -
     * @return {IBalanceSheetStructureSection[]}
     */
    public aggregatesSchemaParser = (
      nodes: (IBalanceSheetSchemaNode | IBalanceSheetDataNode)[],
    ): (IBalanceSheetDataNode | IBalanceSheetSchemaNode)[] => {
      return this.mapNodesDeepReverse(nodes, this.reportAggregateSchemaParser);
    };
  };
