// @ts-nocheck
import * as Yup from 'yup';

const Schema = Yup.object().shape({
  name: Yup.string().required().label('Rule name'),
  applyIfAccountId: Yup.number().required().label(''),
  applyIfTransactionType: Yup.string().required().label(''),
  conditionsType: Yup.string().required(),
  assignCategory: Yup.string().required(),
  assignAccountId: Yup.string().required(),
});

export const CreateRuleFormSchema = Schema;
