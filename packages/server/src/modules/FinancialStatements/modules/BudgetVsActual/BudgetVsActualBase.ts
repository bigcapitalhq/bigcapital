import * as R from 'ramda';
import { sumBy } from 'lodash';
import { GConstructor } from '@/common/types/Constructor';
import { BUDGET_VS_ACTUAL_NODE_TYPE } from './constants';

interface IBudgetVsActualBaseContext {
  repository: { budget: { budgetType: string } };
  query: any;
}

export const BudgetVsActualBase = <T extends GConstructor<any>>(
  Base: T,
) =>
  class extends Base {
    public isNodeType = R.curry((type: string, node: { nodeType: string }): boolean => {
      return node.nodeType === type;
    });

    public isSchemaNodeType = R.curry((type: string, node: { nodeType?: string; type?: string }): boolean => {
      return node.nodeType === type || node.type === type;
    });

    public isAccountNode = (node: { nodeType: string }): boolean => {
      return node.nodeType === BUDGET_VS_ACTUAL_NODE_TYPE.ACCOUNT;
    };

    public isAccountsNode = (node: { nodeType?: string; type?: string }): boolean => {
      return (
        node.nodeType === BUDGET_VS_ACTUAL_NODE_TYPE.ACCOUNTS ||
        node.nodeType === BUDGET_VS_ACTUAL_NODE_TYPE.AGGREGATE ||
        node.type === BUDGET_VS_ACTUAL_NODE_TYPE.ACCOUNTS ||
        node.type === BUDGET_VS_ACTUAL_NODE_TYPE.AGGREGATE
      );
    };

    public isEquationNode = (node: { nodeType: string }): boolean => {
      return node.nodeType === BUDGET_VS_ACTUAL_NODE_TYPE.EQUATION;
    };

    public isNetIncomeNode = (node: { nodeType: string }): boolean => {
      return node.nodeType === BUDGET_VS_ACTUAL_NODE_TYPE.NET_INCOME;
    };

    public isProfitAndLoss = (): boolean => {
      const ctx = this as unknown as IBudgetVsActualBaseContext;
      return ctx.repository.budget.budgetType === 'profit_and_loss';
    };

    public isBalanceSheet = (): boolean => {
      const ctx = this as unknown as IBudgetVsActualBaseContext;
      return ctx.repository.budget.budgetType === 'balance_sheet';
    };

    protected getVariance = (actual: number, budget: number): number => {
      return actual - budget;
    };

    protected getVariancePercentage = (
      actual: number,
      budget: number,
    ): number => {
      if (budget === 0) return 0;
      return (actual - budget) / Math.abs(budget);
    };

    protected getBudgetOfNodes = (nodes: Array<{ budget: { amount: number } }>): number => {
      return sumBy(nodes, 'budget.amount');
    };

    protected getActualOfNodes = (nodes: Array<{ actual: { amount: number } }>): number => {
      return sumBy(nodes, 'actual.amount');
    };
  };
