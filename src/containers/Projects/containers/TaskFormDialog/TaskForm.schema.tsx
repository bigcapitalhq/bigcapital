import * as Yup from 'yup';
import intl from 'react-intl-universal';
import { DATATYPES_LENGTH } from 'common/dataTypes';

const Schema = Yup.object().shape({
  taskName: Yup.string()
    .label(intl.get('task.schema.label.task_name'))
    .required(),
  taskHouse: Yup.string().label(intl.get('task.schema.label.task_house')),
  taskCharge: Yup.string().label(intl.get('task.schema.label.charge')).required(),
  taskamount: Yup.number().label(intl.get('task.schema.label.amount')),
});

export const CreateTaskFormSchema = Schema;
