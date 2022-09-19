// @ts-nocheck
import * as Yup from 'yup';
import intl from 'react-intl-universal';
import { DATATYPES_LENGTH } from '@/constants/dataTypes';

const Schema = Yup.object().shape({
  customer_name: Yup.string().required(),
  customer_phone_number: Yup.number(),
  sms_message: Yup.string().required().trim().max(DATATYPES_LENGTH.TEXT),
});

export const CreateNotifyViaSMSFormSchema = Schema;
