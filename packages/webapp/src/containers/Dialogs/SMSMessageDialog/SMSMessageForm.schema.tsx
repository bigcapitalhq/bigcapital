import * as Yup from 'yup';
import { DATATYPES_LENGTH } from '@/constants/dataTypes';

const Schema = Yup.object().shape({
  notificationKey: Yup.string().required(),
  isNotificationEnabled: Yup.boolean(),
  messageText: Yup.string().min(3).max(DATATYPES_LENGTH.TEXT),
});

export const CreateSMSMessageFormSchema = Schema;
