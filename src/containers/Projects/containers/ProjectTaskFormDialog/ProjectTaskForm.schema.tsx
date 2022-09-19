// @ts-nocheck
import * as Yup from 'yup';
import intl from 'react-intl-universal';

const Schema = Yup.object().shape({
  name: Yup.string()
    .label(intl.get('project_task.schema.label.task_name'))
    .required(),
  charge_type: Yup.string()
    .label(intl.get('project_task.schema.label.charge_type'))
    .required(),
  rate: Yup.number()
    .label(intl.get('project_task.schema.label.rate'))
    .required(),
  cost_estimate: Yup.number().required(),
  estimate_minutes: Yup.string().label(
    intl.get('project_task.schema.label.task_house'),
  ),
});

export const CreateProjectTaskFormSchema = Schema;
