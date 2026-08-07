import intl from 'react-intl-universal';
import * as Yup from 'yup';

const Schema = Yup.object().shape({
  email: Yup.string().email().required().label(intl.get('email')),
  roleId: Yup.string().required().label(intl.get('roles.label.role_name_')),
});

export const InviteUserFormSchema = Schema;
