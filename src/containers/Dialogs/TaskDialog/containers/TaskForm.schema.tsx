import * as Yup from 'yup';
import intl from 'react-intl-universal';
import { DATATYPES_LENGTH } from 'common/dataTypes';

const Schema = Yup.object().shape({
  taks_name: Yup.string(),
  task_house: Yup.string(),
  change: Yup.string(),
  amount: Yup.number(),
});

export const CreateTaskFormSchema = Schema;
