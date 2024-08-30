export default {
  importable: true,
  exportable: true,
  defaultFilterField: 'displayName',
  defaultSort: {
    sortOrder: 'DESC',
    sortField: 'created_at',
  },
  print: {
    pageTitle: 'Customers',
  },
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
  columns: {
    customerType: {
      name: 'Customer Type',
      type: 'text',
      accessor: 'formattedCustomerType',
    },
    firstName: {
      name: 'vendor.field.first_name',
      type: 'text',
    },
    lastName: {
      name: 'vendor.field.last_name',
      type: 'text',
    },
    displayName: {
      name: 'vendor.field.display_name',
      type: 'text',
    },
    email: {
      name: 'vendor.field.email',
      type: 'text',
    },
    workPhone: {
      name: 'vendor.field.work_phone',
      type: 'text',
    },
    personalPhone: {
      name: 'vendor.field.personal_phone',
      type: 'text',
    },
    companyName: {
      name: 'vendor.field.company_name',
      type: 'text',
    },
    website: {
      name: 'vendor.field.website',
      type: 'text',
    },
    balance: {
      name: 'vendor.field.balance',
      type: 'number',
      accessor: 'formattedBalance',
    },
    openingBalance: {
      name: 'vendor.field.opening_balance',
      type: 'number',
      printable: false,
    },
    openingBalanceAt: {
      name: 'vendor.field.opening_balance_at',
      type: 'date',
      printable: false,
      accessor: 'formattedOpeningBalanceAt'
    },
    currencyCode: {
      name: 'vendor.field.currency',
      type: 'text',
      printable: false,
    },
    status: {
      name: 'vendor.field.status',
      printable: false,
    },
    note: {
      name: 'vendor.field.note',
      printable: false,
    },
    // Billing Address
    billingAddress1: {
      name: 'Billing Address 1',
      column: 'billing_address1',
      type: 'text',
      printable: false,
    },
    billingAddress2: {
      name: 'Billing Address 2',
      column: 'billing_address2',
      type: 'text',
      printable: false,
    },
    billingAddressCity: {
      name: 'Billing Address City',
      column: 'billing_address_city',
      type: 'text',
      printable: false,
    },
    billingAddressCountry: {
      name: 'Billing Address Country',
      column: 'billing_address_country',
      type: 'text',
      printable: false,
    },
    billingAddressPostcode: {
      name: 'Billing Address Postcode',
      column: 'billing_address_postcode',
      type: 'text',
      printable: false,
    },
    billingAddressState: {
      name: 'Billing Address State',
      column: 'billing_address_state',
      type: 'text',
      printable: false,
    },
    billingAddressPhone: {
      name: 'Billing Address Phone',
      column: 'billing_address_phone',
      type: 'text',
      printable: false,
    },
    // Shipping Address
    shippingAddress1: {
      name: 'Shipping Address 1',
      column: 'shipping_address1',
      type: 'text',
      printable: false,
    },
    shippingAddress2: {
      name: 'Shipping Address 2',
      column: 'shipping_address2',
      type: 'text',
      printable: false,
    },
    shippingAddressCity: {
      name: 'Shipping Address City',
      column: 'shipping_address_city',
      type: 'text',
      printable: false,
    },
    shippingAddressCountry: {
      name: 'Shipping Address Country',
      column: 'shipping_address_country',
      type: 'text',
      printable: false,
    },
    shippingAddressPostcode: {
      name: 'Shipping Address Postcode',
      column: 'shipping_address_postcode',
      type: 'text',
      printable: false,
    },
    shippingAddressPhone: {
      name: 'Shipping Address Phone',
      column: 'shipping_address_phone',
      type: 'text',
      printable: false,
    },
    shippingAddressState: {
      name: 'Shipping Address State',
      column: 'shipping_address_state',
      type: 'text',
      printable: false,
    },
    createdAt: {
      name: 'vendor.field.created_at',
      type: 'date',
      printable: false,
    },
  },
  fields2: {
    customerType: {
      name: 'Customer Type',
      fieldType: 'enumeration',
      options: [
        { key: 'business', label: 'Business' },
        { key: 'individual', label: 'Individual' },
      ],
      required: true,
    },
    firstName: {
      name: 'customer.field.first_name',
      column: 'first_name',
      fieldType: 'text',
    },
    lastName: {
      name: 'customer.field.last_name',
      column: 'last_name',
      fieldType: 'text',
    },
    displayName: {
      name: 'customer.field.display_name',
      column: 'display_name',
      fieldType: 'text',
      required: true,
    },
    email: {
      name: 'customer.field.email',
      column: 'email',
      fieldType: 'text',
    },
    workPhone: {
      name: 'customer.field.work_phone',
      column: 'work_phone',
      fieldType: 'text',
    },
    personalPhone: {
      name: 'customer.field.personal_phone',
      column: 'personal_phone',
      fieldType: 'text',
    },
    companyName: {
      name: 'customer.field.company_name',
      column: 'company_name',
      fieldType: 'text',
    },
    website: {
      name: 'customer.field.website',
      column: 'website',
      fieldType: 'url',
    },
    openingBalance: {
      name: 'customer.field.opening_balance',
      column: 'opening_balance',
      fieldType: 'number',
    },
    openingBalanceAt: {
      name: 'customer.field.opening_balance_at',
      column: 'opening_balance_at',
      filterable: false,
      fieldType: 'date',
    },
    openingBalanceExchangeRate: {
      name: 'Opening Balance Ex. Rate',
      column: 'opening_balance_exchange_rate',
      fieldType: 'number',
    },
    currencyCode: {
      name: 'customer.field.currency',
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
    shippingAddressPhone: {
      name: 'Shipping Address Phone',
      column: 'shipping_address_phone',
      fieldType: 'text',
    },
    shippingAddressState: {
      name: 'Shipping Address State',
      column: 'shipping_address_state',
      fieldType: 'text',
    },
  },
};

function statusFieldFilterQuery(query, role) {
  switch (role.value) {
    case 'overdue':
      query.modify('overdue');
      break;
    case 'unpaid':
      query.modify('unpaid');
      break;
  }
}
