import * as Yup from 'yup';
import intl from 'react-intl-universal';
import { DATATYPES_LENGTH } from 'common/dataTypes';

const Schema = Yup.object().shape({
  contact: Yup.string().label(intl.get('project.schema.label.contact')),
  projectName: Yup.string()
    .label(intl.get('project.schema.label.project_name'))
    .required(),
  projectDeadline: Yup.date()
    .label(intl.get('project.schema.label.deadline'))
    .required(),
    published: Yup.boolean().label(
    intl.get('project.schema.label.project_state'),
  ),
  projectCost: Yup.number().label(
    intl.get('project.schema.label.project_cost'),
  ),
});

export const CreateProjectFormSchema = Schema;
