import type { useSettingEditSMSNotification } from '@/hooks/query';

export interface SMSNotification {
  key: string;
  smsMessage?: string;
  defaultSmsMessage?: string;
  allowedVariables?: Array<{ variable: string; description: string }>;
  [key: string]: unknown;
}

export interface SMSMessageFormValues {
  notificationKey: string;
  isNotificationEnabled: boolean;
  messageText: string;
  [key: string]: unknown;
}

export type SMSMessageDialogPayload = {
  notificationkey?: string;
};

export type SMSMessageDialogContextValue = {
  dialogName: string;
  smsNotification: SMSNotification;
  editSMSNotificationMutate: ReturnType<
    typeof useSettingEditSMSNotification
  >['mutateAsync'];
};
