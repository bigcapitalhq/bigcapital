// @ts-nocheck
import * as Yup from 'yup';
import intl from 'react-intl-universal';

const Schema = Yup.object().shape({
  name: Yup.string()
    .label(intl.get('project_task.schema.label.task_name'))
    .required(),
  rate: Yup.number()
    .label(intl.get('project_task.schema.label.rate'))
    .required(),
  estimate_hours: Yup.string()
    .label(intl.get('project_task.schema.label.estimate_hours'))
    .nullable(),
});

export const CreateProjectTaskFormSchema = Schema;
