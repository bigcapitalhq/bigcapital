export default {
  defaultFilterField: 'displayName',
  defaultSort: {
    sortOrder: 'DESC',
    sortField: 'created_at',
  },
  importable: true,
  fields: {
    first_name: {
      name: 'vendor.field.first_name',
      column: 'first_name',
      fieldType: 'text',
    },
    last_name: {
      name: 'vendor.field.last_name',
      column: 'last_name',
      fieldType: 'text',
    },
    display_name: {
      name: 'vendor.field.display_name',
      column: 'display_name',
      fieldType: 'text',
    },
    email: {
      name: 'vendor.field.email',
      column: 'email',
      fieldType: 'text',
    },
    work_phone: {
      name: 'vendor.field.work_phone',
      column: 'work_phone',
      fieldType: 'text',
    },
    personal_phone: {
      name: 'vendor.field.personal_pone',
      column: 'personal_phone',
      fieldType: 'text',
    },
    company_name: {
      name: 'vendor.field.company_name',
      column: 'company_name',
      fieldType: 'text',
    },
    website: {
      name: 'vendor.field.website',
      column: 'website',
      fieldType: 'text',
    },
    created_at: {
      name: 'vendor.field.created_at',
      column: 'created_at',
      fieldType: 'date',
    },
    balance: {
      name: 'vendor.field.balance',
      column: 'balance',
      fieldType: 'number',
    },
    opening_balance: {
      name: 'vendor.field.opening_balance',
      column: 'opening_balance',
      fieldType: 'number',
    },
    opening_balance_at: {
      name: 'vendor.field.opening_balance_at',
      column: 'opening_balance_at',
      fieldType: 'date',
    },
    currency_code: {
      name: 'vendor.field.currency',
      column: 'currency_code',
      fieldType: 'text',
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
    },
  },
  fields2: {
    firstName: {
      name: 'vendor.field.first_name',
      column: 'first_name',
      fieldType: 'text',
    },
    lastName: {
      name: 'vendor.field.last_name',
      column: 'last_name',
      fieldType: 'text',
    },
    displayName: {
      name: 'vendor.field.display_name',
      column: 'display_name',
      fieldType: 'text',
      required: true,
    },
    email: {
      name: 'vendor.field.email',
      column: 'email',
      fieldType: 'text',
    },
    workPhone: {
      name: 'vendor.field.work_phone',
      column: 'work_phone',
      fieldType: 'text',
    },
    personalPhone: {
      name: 'vendor.field.personal_phone',
      column: 'personal_phone',
      fieldType: 'text',
    },
    companyName: {
      name: 'vendor.field.company_name',
      column: 'company_name',
      fieldType: 'text',
    },
    website: {
      name: 'vendor.field.website',
      column: 'website',
      fieldType: 'text',
    },
    openingBalance: {
      name: 'vendor.field.opening_balance',
      column: 'opening_balance',
      fieldType: 'number',
    },
    openingBalanceAt: {
      name: 'vendor.field.opening_balance_at',
      column: 'opening_balance_at',
      fieldType: 'date',
    },
    openingBalanceExchangeRate: {
      name: 'Opening Balance Ex. Rate',
      column: 'opening_balance_exchange_rate',
      fieldType: 'number',
    },
    currencyCode: {
      name: 'vendor.field.currency',
      column: 'currency_code',
      fieldType: 'text',
    },
    note: {
      name: 'Note',
      column: 'note',
      fieldType: 'text',
    },
    active: {
      name: 'Active',
      column: 'active',
      fieldType: 'boolean',
    },
    // Billing Address
    billingAddress1: {
      name: 'Billing Address 1',
      column: 'billing_address1',
      fieldType: 'text',
    },
    billingAddress2: {
      name: 'Billing Address 2',
      column: 'billing_address2',
      fieldType: 'text',
    },
    billingAddressCity: {
      name: 'Billing Address City',
      column: 'billing_address_city',
      fieldType: 'text',
    },
    billingAddressCountry: {
      name: 'Billing Address Country',
      column: 'billing_address_country',
      fieldType: 'text',
    },
    billingAddressPostcode: {
      name: 'Billing Address Postcode',
      column: 'billing_address_postcode',
      fieldType: 'text',
    },
    billingAddressState: {
      name: 'Billing Address State',
      column: 'billing_address_state',
      fieldType: 'text',
    },
    billingAddressPhone: {
      name: 'Billing Address Phone',
      column: 'billing_address_phone',
      fieldType: 'text',
    },
    // Shipping Address
    shippingAddress1: {
      name: 'Shipping Address 1',
      column: 'shipping_address1',
      fieldType: 'text',
    },
    shippingAddress2: {
      name: 'Shipping Address 2',
      column: 'shipping_address2',
      fieldType: 'text',
    },
    shippingAddressCity: {
      name: 'Shipping Address City',
      column: 'shipping_address_city',
      fieldType: 'text',
    },
    shippingAddressCountry: {
      name: 'Shipping Address Country',
      column: 'shipping_address_country',
      fieldType: 'text',
    },
    shippingAddressPostcode: {
      name: 'Shipping Address Postcode',
      column: 'shipping_address_postcode',
      fieldType: 'text',
    },
    shippingAddressState: {
      name: 'Shipping Address State',
      column: 'shipping_address_state',
      fieldType: 'text',
    },
    shippingAddressPhone: {
      name: 'Shipping Address Phone',
      column: 'shipping_address_phone',
      fieldType: 'text',
    },
  },
};
