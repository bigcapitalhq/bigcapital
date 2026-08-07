// @ts-nocheck
import intl from 'react-intl-universal';
import * as Yup from 'yup';

const Schema = Yup.object().shape({
  estimatedExpense: Yup.number().label(
    intl.get('estimated_expense.schema.label.estimated_expense'),
  ),
  quantity: Yup.number().label(
    intl.get('estimated_expense.schema.label.quantity'),
  ),
  unitPrice: Yup.number().label(
    intl.get('estimated_expense.schema.label.unit_price'),
  ),
  expenseTotal: Yup.number(),
  charge: Yup.string(),
});

export const CreateEstimatedExpenseFormSchema = Schema;
