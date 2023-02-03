import { ISmsNotificationDefined, SMS_NOTIFICATION_KEY } from '@/interfaces';

export default [
  {
    notificationLabel: 'sms_notification.invoice_details.label',
    notificationDescription: 'sms_notification.invoice_details.description',
    key: SMS_NOTIFICATION_KEY.SALE_INVOICE_DETAILS,
    module: 'sale-invoice',
    moduleFormatted: 'module.sale_invoices.label',
    allowedVariables: [
      {
        variable: 'InvoiceNumber',
        description: 'sms_notification.invoice.var.invoice_number',
      },
      {
        variable: 'ReferenceNumber',
        description: 'sms_notification.invoice.var.reference_number',
      },
      {
        variable: 'CustomerName',
        description: 'sms_notification.invoice.var.customer_name',
      },
      {
        variable: 'DueAmount',
        description: 'sms_notification.invoice.var.due_amount',
      },
      {
        variable: 'DueDate',
        description: 'sms_notification.invoice.var.due_date',
      },
      {
        variable: 'Amount',
        description: 'sms_notification.invoice.var.amount',
      },
      {
        variable: 'CompanyName',
        description: 'sms_notification.invoice.var.company_name',
      },
    ],
    defaultSmsMessage: 'sms_notification.invoice_details.default_message',
    defaultIsNotificationEnabled: true,
  },
  {
    notificationLabel: 'sms_notification.invoice_reminder.label',
    notificationDescription: 'sms_notification.invoice_reminder.description',
    key: SMS_NOTIFICATION_KEY.SALE_INVOICE_REMINDER,
    module: 'sale-invoice',
    moduleFormatted: 'module.sale_invoices.label',
    allowedVariables: [
      {
        variable: 'InvoiceNumber',
        description: 'sms_notification.invoice.var.invoice_number',
      },
      {
        variable: 'ReferenceNumber',
        description: 'sms_notification.invoice.var.reference_number',
      },
      {
        variable: 'CustomerName',
        description: 'sms_notification.invoice.var.customer_name',
      },
      {
        variable: 'DueAmount',
        description: 'sms_notification.invoice.var.due_amount',
      },
      {
        variable: 'DueDate',
        description: 'sms_notification.invoice.var.due_date',
      },
      {
        variable: 'Amount',
        description: 'sms_notification.invoice.var.amount',
      },
      {
        variable: 'CompanyName',
        description: 'sms_notification.invoice.var.company_name',
      },
    ],
    defaultSmsMessage: 'sms_notification.invoice_reminder.default_message',
    defaultIsNotificationEnabled: true,
  },
  {
    notificationLabel: 'sms_notification.receipt_details.label',
    notificationDescription: 'sms_notification.receipt_details.description',
    key: SMS_NOTIFICATION_KEY.SALE_RECEIPT_DETAILS,
    module: 'sale-receipt',
    moduleFormatted: 'module.sale_receipts.label',
    allowedVariables: [
      {
        variable: 'CustomerName',
        description: 'sms_notification.receipt.var.customer_name',
      },
      {
        variable: 'ReceiptNumber',
        description: 'sms_notification.receipt.var.receipt_number',
      },
      {
        variable: 'ReferenceNumber',
        description: 'sms_notification.receipt.var.reference_number',
      },
      {
        variable: 'Amount',
        description: 'sms_notification.receipt.var.amount',
      },
      {
        variable: 'CompanyName',
        description: 'sms_notification.receipt.var.company_name',
      },
    ],
    defaultSmsMessage: 'sms_notification.receipt_details.default_message',
  },
  {
    notificationLabel: 'sms_notification.sale_estimate_details.label',
    notificationDescription: 'sms_notification.estimate_details.description',
    key: SMS_NOTIFICATION_KEY.SALE_ESTIMATE_DETAILS,
    module: 'sale-estimate',
    moduleFormatted: 'module.sale_estimates.label',
    allowedVariables: [
      {
        variable: 'EstimateNumber',
        description: 'sms_notification.estimate.var.estimate_number',
      },
      {
        variable: 'EstimateDate',
        description: 'sms_notification.estimate.var.estimate_date',
      },
      {
        variable: 'ExpirationDate',
        description: 'sms_notification.estimate.var.expiration_date'
      },
      {
        variable: 'ReferenceNumber',
        description: 'sms_notification.estimate.var.reference_number',
      },
      {
        variable: 'CustomerName',
        description: 'sms_notification.estimate.var.customer_name',
      },
      {
        variable: 'Amount',
        description: 'sms_notification.estimate.var.amount',
      },
      {
        variable: 'CompanyName',
        description: 'sms_notification.estimate.var.company_name',
      },
    ],
    defaultSmsMessage: 'sms_notification.estimate.default_message',
  },
  {
    notificationLabel: 'sms_notification.payment_receive_details.label',
    notificationDescription: 'sms_notification.payment_receive.description',
    key: SMS_NOTIFICATION_KEY.PAYMENT_RECEIVE_DETAILS,
    module: 'payment-receive',
    moduleFormatted: 'module.payment_receives.label',
    allowedVariables: [
      {
        variable: 'PaymentNumber',
        description: 'sms_notification.payment.var.payment_number',
      },
      {
        variable: 'ReferenceNumber',
        description: 'sms_notification.payment.var.reference_number',
      },
      {
        variable: 'CustomerName',
        description: 'sms_notification.payment.var.customer_name',
      },
      {
        variable: 'Amount',
        description: 'sms_notification.payment.var.amount',
      },
      {
        variable: 'InvoiceNumber',
        description: 'sms_notification.payment.var.invoice_number',
      },
      {
        variable: 'CompanyName',
        description: 'sms_notification.payment.company_name',
      },
    ],
    defaultSmsMessage: 'sms_notification.payment_receive.default_message',
    defaultIsNotificationEnabled: true,
  },
  {
    notificationLabel: 'sms_notification.customer_balance.label',
    notificationDescription: 'sms_notification.customer_balance.description',
    key: SMS_NOTIFICATION_KEY.CUSTOMER_BALANCE,
    module: 'customer',
    moduleFormatted: 'module.customers.label',
    defaultSmsMessage: 'sms_notification.customer_balance.default_message',
    allowedVariables: [
      {
        variable: 'CustomerName',
        description: 'sms_notification.customer.var.customer_name',
      },
      {
        variable: 'Balance',
        description: 'sms_notification.customer.var.balance',
      },
      {
        variable: 'CompanyName',
        description: 'sms_notification.customer.var.company_name',
      },
    ],
  },
] as ISmsNotificationDefined[];
