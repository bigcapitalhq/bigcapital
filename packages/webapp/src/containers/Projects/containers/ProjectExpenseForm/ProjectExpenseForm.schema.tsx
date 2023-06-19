// @ts-nocheck
import * as Yup from 'yup';
import intl from 'react-intl-universal';

const Schema = Yup.object().shape({
  expenseName: Yup.string().label(
    intl.get('project_expense.schema.label.expense_name'),
  ),
  estimatedExpense: Yup.number().label(
    intl.get('project_expense.schema.label.estimated_expense'),
  ),
  expenseDate: Yup.date(),
  expenseQuantity: Yup.number().label(
    intl.get('project_expense.schema.label.quantity'),
  ),
  expenseUnitPrice: Yup.number().label(
    intl.get('project_expense.schema.label.unitPrice'),
  ),
  expenseTotal: Yup.number(),
  expenseCharge: Yup.string(),
});

export const CreateProjectExpenseFormSchema = Schema;
