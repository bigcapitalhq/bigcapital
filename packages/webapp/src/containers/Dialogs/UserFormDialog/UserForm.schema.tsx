// @ts-nocheck
import * as Yup from 'yup';
import intl from 'react-intl-universal';

const Schema = Yup.object().shape({
  email: Yup.string().email().required().label(intl.get('email')),
  first_name: Yup.string().required().label(intl.get('first_name_')),
  last_name: Yup.string().required().label(intl.get('last_name_')),
  role_id: Yup.string().required().label(intl.get('roles.label.role_name_')),
});

export const UserFormSchema = Schema;
