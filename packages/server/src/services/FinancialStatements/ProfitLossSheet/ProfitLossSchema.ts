import * as R from 'ramda';
import { ACCOUNT_TYPE } from '@/data/AccountTypes';
import {
  ProfitLossAggregateNodeId,
  ProfitLossNodeType,
  IProfitLossSchemaNode,
} from '@/interfaces';
import { FinancialSchema } from '../FinancialSchema';

export const ProfitLossShema = (Base) =>
  class extends R.compose(FinancialSchema)(Base) {
    /**
     * Retrieves the report schema.
     * @returns {IProfitLossSchemaNode[]}
     */
    getSchema = (): IProfitLossSchemaNode[] => {
      return getProfitLossSheetSchema();
    };
  };

/**
 * Retrieves P&L sheet schema.
 * @returns {IProfitLossSchemaNode}
 */
export const getProfitLossSheetSchema = (): IProfitLossSchemaNode[] => [
  {
    id: ProfitLossAggregateNodeId.INCOME,
    name: 'profit_loss_sheet.income',
    nodeType: ProfitLossNodeType.ACCOUNTS,
    accountsTypes: [ACCOUNT_TYPE.INCOME],
    alwaysShow: true,
  },
  {
    id: ProfitLossAggregateNodeId.COS,
    name: 'profit_loss_sheet.cost_of_sales',
    nodeType: ProfitLossNodeType.ACCOUNTS,
    accountsTypes: [ACCOUNT_TYPE.COST_OF_GOODS_SOLD],
  },
  {
    id: ProfitLossAggregateNodeId.GROSS_PROFIT,
    name: 'profit_loss_sheet.gross_profit',
    nodeType: ProfitLossNodeType.EQUATION,
    equation: `${ProfitLossAggregateNodeId.INCOME} - ${ProfitLossAggregateNodeId.COS}`,
  },
  {
    id: ProfitLossAggregateNodeId.EXPENSES,
    name: 'profit_loss_sheet.expenses',
    nodeType: ProfitLossNodeType.ACCOUNTS,
    accountsTypes: [ACCOUNT_TYPE.EXPENSE],
    alwaysShow: true,
  },
  {
    id: ProfitLossAggregateNodeId.NET_OPERATING_INCOME,
    name: 'profit_loss_sheet.net_operating_income',
    nodeType: ProfitLossNodeType.EQUATION,
    equation: `${ProfitLossAggregateNodeId.GROSS_PROFIT} - ${ProfitLossAggregateNodeId.EXPENSES}`,
  },
  {
    id: ProfitLossAggregateNodeId.OTHER_INCOME,
    name: 'profit_loss_sheet.other_income',
    nodeType: ProfitLossNodeType.ACCOUNTS,
    accountsTypes: [ACCOUNT_TYPE.OTHER_INCOME],
  },
  {
    id: ProfitLossAggregateNodeId.OTHER_EXPENSES,
    name: 'profit_loss_sheet.other_expenses',
    nodeType: ProfitLossNodeType.ACCOUNTS,
    accountsTypes: [ACCOUNT_TYPE.OTHER_EXPENSE],
  },
  {
    id: ProfitLossAggregateNodeId.NET_INCOME,
    name: 'profit_loss_sheet.net_income',
    nodeType: ProfitLossNodeType.EQUATION,
    equation: `${ProfitLossAggregateNodeId.NET_OPERATING_INCOME} + ${ProfitLossAggregateNodeId.OTHER_INCOME} - ${ProfitLossAggregateNodeId.OTHER_EXPENSES}`,
  },
];
