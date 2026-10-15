import * as Yup from 'yup';

const Schema = Yup.object().shape({
  name: Yup.string().required().label('Rule name'),
  // A `null` value means the rule applies to all accounts, while a number
  // refers to the account the rule should be applied to.
  applyIfAccountId: Yup.mixed()
    .test(
      'account-required',
      'Apply to account is a required field',
      (value) =>
        value === null || (typeof value === 'number' && !Number.isNaN(value)),
    )
    .label('Apply to account'),
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
