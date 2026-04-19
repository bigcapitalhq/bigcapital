import { GConstructor } from '@/common/types/Constructor';
import { FinancialSheet } from '../../common/FinancialSheet';
import { FinancialSchema } from '../../common/FinancialSchema';
import { BUDGET_TYPE } from './constants';
import { getProfitLossSheetSchema } from '../ProfitLossSheet/ProfitLossSchema';
import { getBalanceSheetSchema } from '../BalanceSheet/BalanceSheetSchema';

interface IBudgetVsActualSchemaContext {
  repository: { budget: { budgetType: string } };
}

export const BudgetVsActualSchema = <T extends GConstructor<any>>(
  Base: T,
) =>
  class extends FinancialSchema(Base) {
    getSchema = () => {
      const ctx = this as unknown as IBudgetVsActualSchemaContext;
      if (ctx.repository.budget.budgetType === BUDGET_TYPE.PROFIT_AND_LOSS) {
        return getProfitLossSheetSchema();
      }
      return getBalanceSheetSchema();
    };
  };
