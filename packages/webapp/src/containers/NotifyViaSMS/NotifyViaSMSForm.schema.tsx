// @ts-nocheck
import intl from 'react-intl-universal';
import * as Yup from 'yup';
import { DATATYPES_LENGTH } from '@/constants/dataTypes';

const Schema = Yup.object().shape({
  customerName: Yup.string().required(),
  customerPhoneNumber: Yup.number(),
  smsMessage: Yup.string().required().trim().max(DATATYPES_LENGTH.TEXT),
});

export const CreateNotifyViaSMSFormSchema = Schema;
