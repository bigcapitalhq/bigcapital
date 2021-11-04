import * as Yup from 'yup';
import intl from 'react-intl-universal';
import { DATATYPES_LENGTH } from 'common/dataTypes';

const Schema = Yup.object().shape({
  customer_id: Yup.string().required(),
  phone: Yup.number().required(),
  note: Yup.string().required().trim().max(DATATYPES_LENGTH.TEXT),
});

export const CreateNotifyContactViaSMSFormSchema = Schema;
