import * as R from 'ramda';
import * as moment from 'moment';
import { sumBy } from 'lodash';
import { GConstructor } from '@/common/types/Constructor';
import { FinancialSheet } from '../../common/FinancialSheet';
import { BudgetVsActualRepository } from './BudgetVsActualRepository';
import {
  IBudgetVsActualAccountNode,
  IBudgetVsActualAggregateNode,
  IBudgetVsActualEquationNode,
  IBudgetVsActualDatePeriodPercentage,
} from './BudgetVsActual.types';

type BudgetVsActualDatePeriodsContext = FinancialSheet & {
  repository: BudgetVsActualRepository;
  query: any;
  isProfitAndLoss: () => boolean;
  getVariance: (actual: number, budget: number) => number;
  getVariancePercentage: (actual: number, budget: number) => number;
  getDateRanges: (fromDate: Date | string, toDate: Date | string, unit: moment.unitOfTime.StartOf) => Array<{ fromDate: Date; toDate: Date }>;
  getDatePeriodTotalMeta: (total: number, fromDate: Date, toDate: Date) => any;
  getDateMeta: (date: moment.MomentInput, format?: string) => { date: Date; formattedDate: string };
  formatPercentage: (amount: number) => string;
  getNodesTableForEvaluating: (path: string, nodes: any[]) => Record<string, number>;
  evaluateEquation: (equation: string, scope: Record<string, number>) => number;
};

export const BudgetVsActualDatePeriods = <T extends GConstructor<any>>(
  Base: T,
) =>
  class extends Base {
    public assocAccountNodeDatePeriods = (node: IBudgetVsActualAccountNode): IBudgetVsActualAccountNode => {
      const ctx = this as unknown as BudgetVsActualDatePeriodsContext;
      const fromDate = ctx.query.fromDate || ctx.repository.budget.startDate;
      const toDate = ctx.query.toDate || ctx.repository.budget.endDate;
      const periodsUnit = ctx.query.getPeriodsUnit();

      const dateRanges = ctx.getDateRanges(fromDate, toDate, periodsUnit);

      const horizontalBudgets: any[] = [];
      const horizontalActuals: any[] = [];
      const horizontalVariances: any[] = [];
      const horizontalVariancePercentages: IBudgetVsActualDatePeriodPercentage[] = [];

      dateRanges.forEach((dateRange) => {
        const periodKey = `${moment(dateRange.fromDate).format('YYYY-MM-DD')}_${moment(dateRange.toDate).format('YYYY-MM-DD')}`;

        const childrenAccountIds: number[] = ctx.repository.accountsGraph.dependenciesOf(
          node.id,
        );
        const accountIds = R.uniq(R.append(node.id, childrenAccountIds));

        let budgetPeriodAmount = 0;
        const periodBudgetMap = ctx.repository.budgetPeriodsByAccount?.get(periodKey);
        if (periodBudgetMap) {
          accountIds.forEach((id: number) => {
            budgetPeriodAmount += periodBudgetMap.get(id) || 0;
          });
        }

        let actualPeriodAmount = 0;
        if (ctx.isProfitAndLoss()) {
          const periodLedger = ctx.repository.periodsAccountsLedger
            ?.whereAccountsIds(accountIds)
            ?.whereFromDate(dateRange.fromDate)
            ?.whereToDate(dateRange.toDate);
          actualPeriodAmount = periodLedger?.getClosingBalance() || 0;
        } else {
          const closingToDate = ctx.repository.periodsAccountsLedger
            ?.whereAccountsIds(accountIds)
            ?.whereToDate(dateRange.toDate);
          const openingToDate = ctx.repository.periodsOpeningAccountLedger
            ?.whereAccountsIds(accountIds)
            ?.whereToDate(dateRange.fromDate);

          const closing = closingToDate?.getClosingBalance() || 0;
          const opening = openingToDate?.getClosingBalance() || 0;
          actualPeriodAmount = closing - opening;
        }

        const variance = ctx.getVariance(actualPeriodAmount, budgetPeriodAmount);
        const variancePct = ctx.getVariancePercentage(actualPeriodAmount, budgetPeriodAmount);

        horizontalBudgets.push(
          ctx.getDatePeriodTotalMeta(budgetPeriodAmount, dateRange.fromDate, dateRange.toDate),
        );
        horizontalActuals.push(
          ctx.getDatePeriodTotalMeta(actualPeriodAmount, dateRange.fromDate, dateRange.toDate),
        );
        horizontalVariances.push(
          ctx.getDatePeriodTotalMeta(variance, dateRange.fromDate, dateRange.toDate),
        );
        horizontalVariancePercentages.push({
          fromDate: ctx.getDateMeta(dateRange.fromDate),
          toDate: ctx.getDateMeta(dateRange.toDate),
          amount: variancePct,
          formattedAmount: ctx.formatPercentage(variancePct),
        });
      });

      return {
        ...node,
        horizontalBudgets,
        horizontalActuals,
        horizontalVariances,
        horizontalVariancePercentages,
      };
    };

    public assocAggregateDatePeriod = (node: IBudgetVsActualAggregateNode): IBudgetVsActualAggregateNode => {
      if (!node.children || node.children.length === 0) return node;

      const ctx = this as unknown as BudgetVsActualDatePeriodsContext;
      const fromDate = ctx.query.fromDate || ctx.repository.budget.startDate;
      const toDate = ctx.query.toDate || ctx.repository.budget.endDate;
      const periodsUnit = ctx.query.getPeriodsUnit();
      const dateRanges = ctx.getDateRanges(fromDate, toDate, periodsUnit);

      const horizontalBudgets: any[] = [];
      const horizontalActuals: any[] = [];
      const horizontalVariances: any[] = [];
      const horizontalVariancePercentages: IBudgetVsActualDatePeriodPercentage[] = [];

      dateRanges.forEach((dateRange, index) => {
        const budgetPeriodAmount = sumBy(
          node.children as any[],
          `horizontalBudgets.${index}.total.amount`,
        );
        const actualPeriodAmount = sumBy(
          node.children as any[],
          `horizontalActuals.${index}.total.amount`,
        );
        const variance = ctx.getVariance(actualPeriodAmount, budgetPeriodAmount);
        const variancePct = ctx.getVariancePercentage(actualPeriodAmount, budgetPeriodAmount);

        horizontalBudgets.push(
          ctx.getDatePeriodTotalMeta(budgetPeriodAmount, dateRange.fromDate, dateRange.toDate),
        );
        horizontalActuals.push(
          ctx.getDatePeriodTotalMeta(actualPeriodAmount, dateRange.fromDate, dateRange.toDate),
        );
        horizontalVariances.push(
          ctx.getDatePeriodTotalMeta(variance, dateRange.fromDate, dateRange.toDate),
        );
        horizontalVariancePercentages.push({
          fromDate: ctx.getDateMeta(dateRange.fromDate),
          toDate: ctx.getDateMeta(dateRange.toDate),
          amount: variancePct,
          formattedAmount: ctx.formatPercentage(variancePct),
        });
      });

      return {
        ...node,
        horizontalBudgets,
        horizontalActuals,
        horizontalVariances,
        horizontalVariancePercentages,
      };
    };

    public assocEquationNodeDatePeriod = R.curry(
      (
        accNodes: any[],
        equation: string,
        node: IBudgetVsActualEquationNode,
      ): IBudgetVsActualEquationNode => {
        const ctx = this as unknown as BudgetVsActualDatePeriodsContext;
        const fromDate = ctx.query.fromDate || ctx.repository.budget.startDate;
        const toDate = ctx.query.toDate || ctx.repository.budget.endDate;
        const periodsUnit = ctx.query.getPeriodsUnit();
        const dateRanges = ctx.getDateRanges(fromDate, toDate, periodsUnit);

        const horizontalBudgets: any[] = [];
        const horizontalActuals: any[] = [];
        const horizontalVariances: any[] = [];
        const horizontalVariancePercentages: IBudgetVsActualDatePeriodPercentage[] = [];

        dateRanges.forEach((dateRange, index) => {
          const budgetTable = ctx.getNodesTableForEvaluating(
            `horizontalBudgets.${index}.total.amount`,
            accNodes,
          ) as Record<string, number>;
          const budgetPeriodAmount = ctx.evaluateEquation(equation, budgetTable);

          const actualTable = ctx.getNodesTableForEvaluating(
            `horizontalActuals.${index}.total.amount`,
            accNodes,
          ) as Record<string, number>;
          const actualPeriodAmount = ctx.evaluateEquation(equation, actualTable);

          const variance = ctx.getVariance(actualPeriodAmount, budgetPeriodAmount);
          const variancePct = ctx.getVariancePercentage(actualPeriodAmount, budgetPeriodAmount);

          horizontalBudgets.push(
            ctx.getDatePeriodTotalMeta(budgetPeriodAmount, dateRange.fromDate, dateRange.toDate),
          );
          horizontalActuals.push(
            ctx.getDatePeriodTotalMeta(actualPeriodAmount, dateRange.fromDate, dateRange.toDate),
          );
          horizontalVariances.push(
            ctx.getDatePeriodTotalMeta(variance, dateRange.fromDate, dateRange.toDate),
          );
          horizontalVariancePercentages.push({
            fromDate: ctx.getDateMeta(dateRange.fromDate),
            toDate: ctx.getDateMeta(dateRange.toDate),
            amount: variancePct,
            formattedAmount: ctx.formatPercentage(variancePct),
          });
        });

        return {
          ...node,
          horizontalBudgets,
          horizontalActuals,
          horizontalVariances,
          horizontalVariancePercentages,
        };
      },
    );
  };
