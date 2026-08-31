/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  const settings = [
    // SMS integration credentials.
    { group: 'sms-integration', key: 'twilio_account_sid', value: '' },
    { group: 'sms-integration', key: 'twilio_auth_token', value: '' },
    { group: 'sms-integration', key: 'twilio_from_number', value: '' },

    // SMS notification enable flags.
    {
      group: 'sms-notification',
      key: 'sms-notification-enable.sale-invoice-details',
      value: '0',
    },
    {
      group: 'sms-notification',
      key: 'sms-notification-enable.sale-invoice-reminder',
      value: '0',
    },
    {
      group: 'sms-notification',
      key: 'sms-notification-enable.sale-estimate-details',
      value: '0',
    },
    {
      group: 'sms-notification',
      key: 'sms-notification-enable.sale-receipt-details',
      value: '0',
    },
    {
      group: 'sms-notification',
      key: 'sms-notification-enable.payment-receive-details',
      value: '0',
    },
    {
      group: 'sms-notification',
      key: 'sms-notification-enable.customer-balance',
      value: '0',
    },

    // Default SMS message templates.
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

  const inserts = settings
    .map((s) => `('${s.group}', '${s.key}', '${s.value.replace(/'/g, "''")}')`)
    .join(', ');

  return knex.raw(
    `INSERT IGNORE INTO settings (\`group\`, \`key\`, \`value\`) VALUES ${inserts}`,
  );
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return Promise.resolve();
};
