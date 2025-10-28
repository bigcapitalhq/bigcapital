// @ts-nocheck
import * as Yup from 'yup';

const Schema = Yup.object().shape({
  name: Yup.string().required().label('Rule name'),
  applyIfAccountId: Yup.number().required().label('Apply to account'),
  applyIfTransactionType: Yup.string()
    .required()
    .label('Apply to transaction type'),
  conditionsType: Yup.string().required().label('Condition type'),
  assignCategory: Yup.string().required().label('Assign to category'),
  assignAccountId: Yup.string().required().label('Assign to account'),
  conditions: Yup.array().of(
    Yup.object().shape({
      value: Yup.string().required().label('Value'),
      comparator: Yup.string().required().label('Comparator'),
      field: Yup.string().required().label('Field'),
    }),
  ),
});

export const CreateRuleFormSchema = Schema;
