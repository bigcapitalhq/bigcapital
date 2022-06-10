import * as Yup from 'yup';
import intl from 'react-intl-universal';
import { DATATYPES_LENGTH } from 'common/dataTypes';

const Schema = Yup.object().shape({
  contact: Yup.string(),
  project_name: Yup.string(),
  project_deadline: Yup.date(),
  project_state: Yup.boolean(),
  project_cost: Yup.number(),
});

export const CreateProjectFormSchema = Schema;
