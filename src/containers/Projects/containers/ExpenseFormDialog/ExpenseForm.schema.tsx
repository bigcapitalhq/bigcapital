import * as Yup from 'yup';
import intl from 'react-intl-universal';
import { DATATYPES_LENGTH } from 'common/dataTypes';

const Schema = Yup.object().shape({
  expenseName: Yup.string().label(
    intl.get('expense.schema.label.expense_name'),
  ),
  estimatedExpense: Yup.number().label(
    intl.get('expense.schema.label.estimated_expense'),
  ),
  expemseDate: Yup.date(),
  expenseQuantity: Yup.number().label(intl.get('expense.schema.label.quantity')),
  expenseUnitPrice: Yup.number().label(
    intl.get('expense.schema.label.unitPrice'),
  ),
  expenseTotal: Yup.number(),
  expenseCharge: Yup.string(),
});

export const CreateExpenseFormSchema = Schema;
