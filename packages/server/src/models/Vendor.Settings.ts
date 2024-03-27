export default {
  defaultFilterField: 'displayName',
  defaultSort: {
    sortOrder: 'DESC',
    sortField: 'createdAt',
  },
  importable: true,
  fields: {
    firstName: {
      name: 'vendor.field.first_name',
      column: 'first_name',
      fieldType: 'text',
      importable: true,
    },
    lastName: {
      name: 'vendor.field.last_name',
      column: 'last_name',
      fieldType: 'text',
      importable: true,
    },
    displayName: {
      name: 'vendor.field.display_name',
      column: 'display_name',
      fieldType: 'text',
      required: true,
      importable: true,
    },
    email: {
      name: 'vendor.field.email',
      column: 'email',
      fieldType: 'text',
      importable: true,
    },
    workPhone: {
      name: 'vendor.field.work_phone',
      column: 'work_phone',
      fieldType: 'text',
      importable: true,
    },
    personalPhone: {
      name: 'vendor.field.personal_pone',
      column: 'personal_phone',
      fieldType: 'text',
      importable: true,
    },
    companyName: {
      name: 'vendor.field.company_name',
      column: 'company_name',
      fieldType: 'text',
      importable: true,
    },
    website: {
      name: 'vendor.field.website',
      column: 'website',
      fieldType: 'text',
      importable: true,
    },
    balance: {
      name: 'vendor.field.balance',
      column: 'balance',
      fieldType: 'number',
    },
    openingBalance: {
      name: 'vendor.field.opening_balance',
      column: 'opening_balance',
      fieldType: 'number',
      importable: true,
    },
    openingBalanceAt: {
      name: 'vendor.field.opening_balance_at',
      column: 'opening_balance_at',
      fieldType: 'date',
      importable: true,
    },
    openingBalanceExchangeRate: {
      name: 'Opening Balance Ex. Rate',
      column: 'opening_balance_exchange_rate',
      fieldType: 'number',
      importable: true,
    },
    currencyCode: {
      name: 'vendor.field.currency',
      column: 'currency_code',
      fieldType: 'text',
      importable: true,
    },
    status: {
      name: 'vendor.field.status',
      type: 'enumeration',
      options: [
        { key: 'overdue', label: 'vendor.field.status.overdue' },
        { key: 'unpaid', label: 'vendor.field.status.unpaid' },
      ],
      filterCustomQuery: (query, role) => {
        switch (role.value) {
          case 'overdue':
            query.modify('overdue');
            break;
          case 'unpaid':
            query.modify('unpaid');
            break;
        }
      },
      importable: true,
    },
    // Billing Address
    billingAddress1: {
      name: 'Billing Address 1',
      column: 'billing_address1',
      fieldType: 'text',
      importable: true,
    },
    billingAddress2: {
      name: 'Billing Address 2',
      column: 'billing_address2',
      fieldType: 'text',
      importable: true,
    },
    billingAddressCity: {
      name: 'Billing Address City',
      column: 'billing_address_city',
      fieldType: 'text',
      importable: true,
    },
    billingAddressCountry: {
      name: 'Billing Address Country',
      column: 'billing_address_country',
      fieldType: 'text',
      importable: true,
    },
    billingAddressPostcode: {
      name: 'Billing Address Postcode',
      column: 'billing_address_postcode',
      fieldType: 'text',
      importable: true,
    },
    billingAddressState: {
      name: 'Billing Address State',
      column: 'billing_address_state',
      fieldType: 'text',
      importable: true,
    },
    billingAddressPhone: {
      name: 'Billing Address Phone',
      column: 'billing_address_phone',
      fieldType: 'text',
      importable: true,
    },
    // Shipping Address
    shippingAddress1: {
      name: 'Shipping Address 1',
      column: 'shipping_address1',
      fieldType: 'text',
      importable: true,
    },
    shippingAddress2: {
      name: 'Shipping Address 2',
      column: 'shipping_address2',
      fieldType: 'text',
      importable: true,
    },
    shippingAddressCity: {
      name: 'Shipping Address City',
      column: 'shipping_address_city',
      fieldType: 'text',
      importable: true,
    },
    shippingAddressCountry: {
      name: 'Shipping Address Country',
      column: 'shipping_address_country',
      fieldType: 'text',
      importable: true,
    },
    shippingAddressPostcode: {
      name: 'Shipping Address Postcode',
      column: 'shipping_address_postcode',
      fieldType: 'text',
      importable: true,
    },
    shippingAddressState: {
      name: 'Shipping Address State',
      column: 'shipping_address_state',
      fieldType: 'text',
      importable: true,
    },
    shippingAddressPhone: {
      name: 'Shipping Address Phone',
      column: 'shipping_address_phone',
      fieldType: 'text',
      importable: true,
    },
    createdAt: {
      name: 'vendor.field.created_at',
      column: 'created_at',
      fieldType: 'date',
    },
  },
};
