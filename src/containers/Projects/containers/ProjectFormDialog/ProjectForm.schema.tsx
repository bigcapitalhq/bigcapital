// @ts-nocheck
import * as Yup from 'yup';
import intl from 'react-intl-universal';

const Schema = Yup.object().shape({
  contact_id: Yup.string().label(intl.get('project.schema.label.contact')),
  name: Yup.string()
    .label(intl.get('project.schema.label.project_name'))
    .required(),
  deadline: Yup.date()
    .label(intl.get('project.schema.label.deadline'))
    .required(),
  published: Yup.boolean().label(
    intl.get('project.schema.label.project_state'),
  ),
  cost_estimate: Yup.number().label(
    intl.get('project.schema.label.project_cost'),
  ),
});

export const CreateProjectFormSchema = Schema;
