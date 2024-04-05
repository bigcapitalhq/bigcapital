export default {
  importable: true,
  defaultFilterField: 'displayName',
  defaultSort: {
    sortOrder: 'DESC',
    sortField: 'createdAt',
  },
  fields: {
    customerType: {
      name: 'Customer Type',
      column: 'contact_type',
      fieldType: 'enumeration',
      options: [
        { key: 'business', label: 'Business' },
        { key: 'individual', label: 'Individual' },
      ],
      importable: true,
      required: true,
    },
    firstName: {
      name: 'customer.field.first_name',
      column: 'first_name',
      fieldType: 'text',
      importable: true,
    },
    lastName: {
      name: 'customer.field.last_name',
      column: 'last_name',
      fieldType: 'text',
      importable: true,
    },
    displayName: {
      name: 'customer.field.display_name',
      column: 'display_name',
      fieldType: 'text',
      required: true,
      importable: true,
    },
    email: {
      name: 'customer.field.email',
      column: 'email',
      fieldType: 'text',
      importable: true,
    },
    workPhone: {
      name: 'customer.field.work_phone',
      column: 'work_phone',
      fieldType: 'text',
      importable: true,
    },
    personalPhone: {
      name: 'customer.field.personal_phone',
      column: 'personal_phone',
      fieldType: 'text',
      importable: true,
    },
    companyName: {
      name: 'customer.field.company_name',
      column: 'company_name',
      fieldType: 'text',
      importable: true,
    },
    website: {
      name: 'customer.field.website',
      column: 'website',
      fieldType: 'url',
      importable: true,
    },
    balance: {
      name: 'customer.field.balance',
      column: 'balance',
      fieldType: 'number',
    },
    openingBalance: {
      name: 'customer.field.opening_balance',
      column: 'opening_balance',
      fieldType: 'number',
      importable: true,
    },
    openingBalanceAt: {
      name: 'customer.field.opening_balance_at',
      column: 'opening_balance_at',
      filterable: false,
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
      name: 'customer.field.currency',
      column: 'currency_code',
      fieldType: 'text',
      importable: true,
    },
    note: {
      name: 'Note',
      column: 'note',
      fieldType: 'text',
      importable: true,
    },
    active: {
      name: 'Active',
      column: 'active',
      fieldType: 'boolean',
      importable: true,
    },
    status: {
      name: 'customer.field.status',
      fieldType: 'enumeration',
      options: [
        { key: 'active', label: 'customer.field.status.active' },
        { key: 'inactive', label: 'customer.field.status.inactive' },
        { key: 'overdue', label: 'customer.field.status.overdue' },
        { key: 'unpaid', label: 'customer.field.status.unpaid' },
      ],
      filterCustomQuery: statusFieldFilterQuery,
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
    shippingAddressPhone: {
      name: 'Shipping Address Phone',
      column: 'shipping_address_phone',
      fieldType: 'text',
      importable: true,
    },
    shippingAddressState: {
      name: 'Shipping Address State',
      column: 'shipping_address_state',
      fieldType: 'text',
      importable: true,
    },
    //
    createdAt: {
      name: 'customer.field.created_at',
      column: 'created_at',
      fieldType: 'date',
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
