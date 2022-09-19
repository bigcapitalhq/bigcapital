// @ts-nocheck
import * as Yup from 'yup';
import intl from 'react-intl-universal';
import { DATATYPES_LENGTH } from '@/constants/dataTypes';

const Schema = Yup.object().shape({
  date: Yup.date()
    .label(intl.get('project_time_entry.schema.label.date'))
    .required(),
  description: Yup.string().nullable().max(DATATYPES_LENGTH.TEXT),
  duration: Yup.string()
    .label(intl.get('project_time_entry.schema.label.duration'))
    .required(),
});

export const CreateProjectTimeEntryFormSchema = Schema;
