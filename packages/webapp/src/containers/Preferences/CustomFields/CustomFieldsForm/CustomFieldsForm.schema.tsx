// @ts-nocheck
import * as Yup from 'yup';
import intl from 'react-intl-universal';
import { DATATYPES_LENGTH } from '@/constants/dataTypes';

export const CustomFieldsFormSchema = Yup.object().shape({
  resourceName: Yup.string().required().label(intl.get('custom_fields.label.resource')),
  fieldName: Yup.string().required().max(DATATYPES_LENGTH.STRING).label(intl.get('custom_fields.label.field_name')),
  label: Yup.string().required().max(DATATYPES_LENGTH.STRING).label(intl.get('custom_fields.label.label')),
  fieldType: Yup.string().required().label(intl.get('custom_fields.label.type')),
  required: Yup.boolean(),
  order: Yup.number().integer().min(0),
  active: Yup.boolean(),
  defaultValue: Yup.string().nullable().max(DATATYPES_LENGTH.STRING),
});
