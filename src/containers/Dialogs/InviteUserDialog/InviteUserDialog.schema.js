import * as Yup from 'yup';
import intl from 'react-intl-universal';

const Schema = Yup.object().shape({
  email: Yup.string()
    .email()
    .required()
    .label(intl.get('email')),
});

export const InviteUserFormSchema = Schema;