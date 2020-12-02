import * as Yup from 'yup';
import { formatMessage } from 'services/intl';

const Schema = Yup.object().shape({
  email: Yup.string()
    .email()
    .required()
    .label(formatMessage({ id: 'email' })),
});

export const InviteUserFormSchema = Schema;