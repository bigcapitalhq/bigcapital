import { DRAWERS } from '@/constants/drawers';
import { index as ExpenseDrawer } from '@/containers/Drawers/ExpenseDrawer';

export function ExpensesListDrawers() {
  return (
    <>
      <ExpenseDrawer name={DRAWERS.EXPENSE_DETAILS} />
    </>
  );
}
