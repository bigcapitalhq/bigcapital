import intl from 'react-intl-universal';
import * as Yup from 'yup';

const Schema = Yup.object().shape({
  email: Yup.string().email().required().label(intl.get('email')),
  firstName: Yup.string().required().label(intl.get('first_name_')),
  lastName: Yup.string().required().label(intl.get('last_name_')),
  roleId: Yup.string().required().label(intl.get('roles.label.role_name_')),
});

export const UserFormSchema = Schema;
