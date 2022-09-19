// @ts-nocheck
import * as Yup from 'yup';
import intl from 'react-intl-universal';
import { DATATYPES_LENGTH } from '@/constants/dataTypes';

const Schema = Yup.object().shape({
  role_name: Yup.string().required().label(intl.get('roles.label.role_name_')),
  role_description: Yup.string().nullable().max(DATATYPES_LENGTH.TEXT),
  permissions: Yup.object().shape({
    subject: Yup.string(),
    ability: Yup.string(),
    value: Yup.boolean(),
  }),
});

export const CreateRolesFormSchema = Schema;
export const EditRolesFormSchema = Schema;
