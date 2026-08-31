import { TenantSeeder } from '@/libs/migration-seed/TenantSeeder';

export default class SeedSettings extends TenantSeeder {
  /**
   *
   * @returns
   */
  up() {
    const settings = [
      // Orgnization settings.
      { group: 'organization', key: 'accounting_basis', value: 'accrual' },

      // Accounts settings.
      { group: 'accounts', key: 'account_code_unique', value: true },

      // Manual journals settings.
      { group: 'manual_journals', key: 'next_number', value: '00001' },
      { group: 'manual_journals', key: 'number_prefix', value: 'J-' },
      { group: 'manual_journals', key: 'auto_increment', value: true },

      // Sale invoices settings.
      { group: 'sales_invoices', key: 'next_number', value: '00001' },
      { group: 'sales_invoices', key: 'number_prefix', value: 'INV-' },
      { group: 'sales_invoices', key: 'auto_increment', value: true },

      // Sale receipts settings.
      { group: 'sales_receipts', key: 'next_number', value: '00001' },
      { group: 'sales_receipts', key: 'number_prefix', value: 'REC-' },
      { group: 'sales_receipts', key: 'auto_increment', value: true },

      // Sale estimates settings.
      { group: 'sales_estimates', key: 'next_number', value: '00001' },
      { group: 'sales_estimates', key: 'number_prefix', value: 'EST-' },
      { group: 'sales_estimates', key: 'auto_increment', value: true },

      // Payment receives settings.
      { group: 'payment_receives', key: 'number_prefix', value: 'PAY-' },
      { group: 'payment_receives', key: 'next_number', value: '00001' },
      { group: 'payment_receives', key: 'auto_increment', value: true },

      // Cashflow settings.
      { group: 'cashflow', key: 'number_prefix', value: 'CF-' },
      { group: 'cashflow', key: 'next_number', value: '00001' },
      { group: 'cashflow', key: 'auto_increment', value: true },

      // warehouse transfers settings.
      { group: 'warehouse_transfers', key: 'next_number', value: '00001' },
      { group: 'warehouse_transfers', key: 'number_prefix', value: 'WT-' },
      { group: 'warehouse_transfers', key: 'auto_increment', value: true },

      // SMS integration settings.
      { group: 'sms-integration', key: 'twilio_account_sid', value: '' },
      { group: 'sms-integration', key: 'twilio_auth_token', value: '' },
      { group: 'sms-integration', key: 'twilio_from_number', value: '' },

      // SMS notification settings.
      {
        group: 'sms-notification',
        key: 'sms-notification-enable.sale-invoice-details',
        value: false,
      },
      {
        group: 'sms-notification',
        key: 'sms-notification-enable.sale-invoice-reminder',
        value: false,
      },
      {
        group: 'sms-notification',
        key: 'sms-notification-enable.sale-estimate-details',
        value: false,
      },
      {
        group: 'sms-notification',
        key: 'sms-notification-enable.sale-receipt-details',
        value: false,
      },
      {
        group: 'sms-notification',
        key: 'sms-notification-enable.payment-receive-details',
        value: false,
      },
      {
        group: 'sms-notification',
        key: 'sms-notification-enable.customer-balance',
        value: false,
      },

      {
        group: 'sms-notification',
        key: 'sms-message.sale-invoice-details',
        value:
          'Hi {CustomerName}, invoice {InvoiceNumber} is due on {DueDate}. Amount due: {DueAmount}. - {CompanyName}',
      },
      {
        group: 'sms-notification',
        key: 'sms-message.sale-invoice-reminder',
        value:
          'Reminder: Invoice {InvoiceNumber} is due on {DueDate}. Amount: {DueAmount}. - {CompanyName}',
      },
      {
        group: 'sms-notification',
        key: 'sms-message.sale-estimate-details',
        value:
          'Hi {CustomerName}, estimate {EstimateNumber} for {Amount}. - {CompanyName}',
      },
      {
        group: 'sms-notification',
        key: 'sms-message.sale-receipt-details',
        value:
          'Hi {CustomerName}, receipt {ReceiptNumber} for {Amount}. - {CompanyName}',
      },
      {
        group: 'sms-notification',
        key: 'sms-message.payment-receive-details',
        value:
          'Hi {CustomerName}, payment {PaymentNumber} of {Amount} received. Invoices: {InvoiceNumber}. - {CompanyName}',
      },
      {
        group: 'sms-notification',
        key: 'sms-message.customer-balance',
        value: 'Hi {CustomerName}, your balance is {Balance}. - {CompanyName}',
      },
    ];
    return this.knex('settings').insert(settings);
  }
}
