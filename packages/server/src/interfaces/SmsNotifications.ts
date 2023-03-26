export interface ISmsNotificationAllowedVariable {
  variable: string;
  description: string;
}
export interface ISmsNotificationDefined {
  notificationLabel: string;
  notificationDescription: string;
  key: string;
  module: string;
  moduleFormatted: string;
  allowedVariables: ISmsNotificationAllowedVariable[];

  defaultSmsMessage: string;
  defaultIsNotificationEnabled: boolean;
}

export interface ISmsNotificationMeta {
  notificationLabel: string;
  notificationDescription: string;
  key: string;
  module: string;
  moduleFormatted: string;
  allowedVariables: ISmsNotificationAllowedVariable[];
  smsMessage: string;
  isNotificationEnabled: boolean;
}

export interface IEditSmsNotificationDTO {
  notificationKey: string;
  messageText: string;
  isNotificationEnabled: boolean;
}

export interface ISaleInvoiceSmsDetailsDTO {
  notificationKey: 'details' | 'reminder';
}

export interface ISaleInvoiceSmsDetails {
  customerName: string;
  customerPhoneNumber: string;
  smsMessage: string;
}

export enum SMS_NOTIFICATION_KEY {
  SALE_INVOICE_DETAILS = 'sale-invoice-details',
  SALE_INVOICE_REMINDER = 'sale-invoice-reminder',
  SALE_ESTIMATE_DETAILS = 'sale-estimate-details',
  SALE_RECEIPT_DETAILS = 'sale-receipt-details',
  PAYMENT_RECEIVE_DETAILS = 'payment-receive-details',
  CUSTOMER_BALANCE = 'customer-balance',
}
