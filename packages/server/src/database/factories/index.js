import KnexFactory from '@/lib/KnexFactory';
import faker from 'faker';
import { hashPassword } from 'utils';


export default (tenantDb) => {
  const factory = new KnexFactory(tenantDb);

  factory.define('user', 'users', async () => {
    // const hashedPassword = await hashPassword('admin');

    return {
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      email: faker.internet.email(),
      phone_number: faker.phone.phoneNumberFormat().replace('-', ''),
      active: 1,
      // password: hashedPassword,
    };
  });

  factory.define('password_reset', 'password_resets', async () => {
    return {
      user_id: null,
      token: faker.lorem.slug,
    };
  });

  factory.define('account_type', 'account_types', async () => ({
    name: faker.lorem.words(2),
    normal: 'debit',
  }));

  factory.define('account_balance', 'account_balances', async () => {
    const account = await factory.create('account');

    return {
      account_id: account.id,
      amount: faker.random.number(),
      currency_code: 'USD',
    };
  });

  factory.define('account', 'accounts', async () => {
    const accountType = await factory.create('account_type');
    return {
      name: faker.lorem.word(),
      code: faker.random.number(),
      account_type_id: accountType.id,
      description: faker.lorem.paragraph(),
    };
  });

  factory.define('account_transaction', 'accounts_transactions', async () => {
    const account = await factory.create('account');
    const user = await factory.create('user');

    return {
      account_id: account.id,
      credit: faker.random.number(),
      debit: 0,
      user_id: user.id,
    };
  });

  factory.define('manual_journal', 'manual_journals', async () => {
    const user = await factory.create('user');

    return {
      journal_number: faker.random.number(),
      transaction_type: '',
      amount: faker.random.number(),
      date: faker.date.future,
      status: 1,
      user_id: user.id,
    };
  });

  factory.define('item_category', 'items_categories', () => ({
    name: faker.name.firstName(),
    description: faker.lorem.text(),
    parent_category_id: null,
  }));

  factory.define('item_metadata', 'items_metadata', async () => {
    const item = await factory.create('item');

    return {
      key: faker.lorem.slug(),
      value: faker.lorem.word(),
      item_id: item.id,
    };
  });

  factory.define('item', 'items', async () => {
    const category = await factory.create('item_category');
    const costAccount = await factory.create('account');
    const sellAccount = await factory.create('account');
    const inventoryAccount = await factory.create('account');

    return {
      name: faker.lorem.word(),
      note: faker.lorem.paragraph(),
      cost_price: faker.random.number(),
      sell_price: faker.random.number(),
      cost_account_id: costAccount.id,
      sell_account_id: sellAccount.id,
      inventory_account_id: inventoryAccount.id,
      category_id: category.id,
    };
  });

  factory.define('setting', 'settings', async () => {
    const user = await factory.create('user');
    return {
      key: faker.lorem.slug(),
      user_id: user.id,
      type: 'string',
      value: faker.lorem.words(),
      group: 'default',
    };
  });

  factory.define('role', 'roles', async () => ({
    name: faker.lorem.word(),
    description: faker.lorem.words(),
    predefined: false,
  }));

  factory.define('user_has_role', 'user_has_roles', async () => {
    const user = await factory.create('user');
    const role = await factory.create('role');

    return {
      user_id: user.id,
      role_id: role.id,
    };
  });

  factory.define('permission', 'permissions', async () => {
    const permissions = ['create', 'edit', 'delete', 'view', 'owner'];
    const randomPermission = permissions[Math.floor(Math.random() * permissions.length)];

    return {
      name: randomPermission,
    };
  });

  factory.define('role_has_permission', 'role_has_permissions', async () => {
    const permission = await factory.create('permission');
    const role = await factory.create('role');
    const resource = await factory.create('resource');

    return {
      role_id: role.id,
      permission_id: permission.id,
      resource_id: resource.id,
    };
  });

  factory.define('resource', 'resources', () => ({
    name: faker.lorem.word(),
  }));

  factory.define('view', 'views', async () => {
    const resource = await factory.create('resource');
    return {
      name: faker.lorem.word(),
      resource_id: resource.id,
      predefined: false,
    };
  });

  factory.define('resource_field', 'resource_fields', async () => {
    const resource = await factory.create('resource');
    const dataTypes = ['select', 'date', 'text'];

    return {
      label_name: faker.lorem.words(),
      key: faker.lorem.slug(),
      data_type: dataTypes[Math.floor(Math.random() * dataTypes.length)],
      help_text: faker.lorem.words(),
      default: faker.lorem.word(),
      resource_id: resource.id,
      active: true,
      columnable: true,
      predefined: false,
    };
  });

  factory.define('resource_custom_field_metadata', 'resource_custom_fields_metadata', async () => {
    const resource = await factory.create('resource');

    return {
      resource_id: resource.id,
      resource_item_id: 1,
      key: faker.lorem.words(),
      value: faker.lorem.words(),
    };
  });

  factory.define('view_role', 'view_roles', async () => {
    const view = await factory.create('view');
    const field = await factory.create('resource_field');

    return {
      view_id: view.id,
      index: faker.random.number(),
      field_id: field.id,
      value: '',
      comparator: '',
    };
  });

  factory.define('view_column', 'view_has_columns', async () => {
    const view = await factory.create('view');
    const field = await factory.create('resource_field');

    return {
      field_id: field.id,
      view_id: view.id,
      // index: 1,
    };
  });

  factory.define('expense', 'expenses_transactions', async () => {
    const paymentAccount = await factory.create('account');
    const expenseAccount = await factory.create('account');
    const user = await factory.create('user');

    return {
      total_amount: faker.random.number(),
      currency_code: 'USD',
      description: '',
      reference_no: faker.random.number(),
      payment_account_id: paymentAccount.id,
      published: true,
      user_id: user.id,
    };
  });

  factory.define('expense_category', 'expense_transaction_categories', async () => {
    const expense = await factory.create('expense');

    return {
      expense_account_id: expense.id,
      description: '',
      amount: faker.random.number(),
      expense_id: expense.id,
    };
  });

  factory.define('option', 'options', async () => {
    return {
      key: faker.lorem.slug(),
      value: faker.lorem.slug(),
      group: faker.lorem.slug(),
    };
  });

  factory.define('currency', 'currencies', async () => {
    return {
      currency_name: faker.lorem.slug(),
      currency_code: 'USD',
    };
  });

  factory.define('exchange_rate', 'exchange_rates', async () => {
    return {
      date: '2020-02-02',
      currency_code: 'USD',
      exchange_rate: faker.random.number(),
    };
  });

  factory.define('budget', 'budgets', async () => {
    return {
      name: faker.lorem.slug(),
      fiscal_year: '2020',
      period: 'month',
      account_types: 'profit_loss',
    };
  });

  factory.define('budget_entry', 'budget_entries', async () => {
    const budget = await factory.create('budget');
    const account = await factory.create('account');

    return {
      account_id: account.id,
      budget_id: budget.id,
      amount: 1000,
      order: 1,
    };
  });

  factory.define('customer', 'customers', async () => {
    return {
      customer_type: 'business',
    };
  });

  factory.define('vendor', 'vendors', async () => {
    return {
      customer_type: 'business',
    };
  });

  factory.define('sale_estimate', 'sales_estimates', async () => {
    const customer = await factory.create('customer');

    return {
      customer_id: customer.id,
      estimate_date: faker.date.past,
      expiration_date: faker.date.future,
      reference: '',
      estimate_number: faker.random.number,
      note: '',
      terms_conditions: '',
    };
  });

  factory.define('sale_estimate_entry', 'sales_estimate_entries', async () => {
    const estimate = await factory.create('sale_estimate');
    const item = await factory.create('item');

    return {
      estimate_id: estimate.id,
      item_id: item.id,
      description: '',
      discount: faker.random.number,
      quantity: faker.random.number,
      rate: faker.random.number,
    };
  });

  factory.define('sale_receipt', 'sales_receipts', async () => {
    const depositAccount = await factory.create('account');
    const customer = await factory.create('customer');

    return {
      deposit_account_id: depositAccount.id,
      customer_id: customer.id,
      reference_no: faker.random.number,
      receipt_date: faker.date.past,
    };
  });

  factory.define('sale_receipt_entry', 'sales_receipt_entries', async () => {
    const saleReceipt = await factory.create('sale_receipt');
    const item = await factory.create('item');

    return {
      sale_receipt_id: saleReceipt.id,
      item_id: item.id,
      rate: faker.random.number,
      quantity: faker.random.number,
    };
  });

  factory.define('sale_invoice', 'sales_invoices', async () => {

    return {

    };
  });

  factory.define('sale_invoice_entry', 'sales_invoices_entries', async () => {
    return {

    };
  });

  factory.define('payment_receive', 'payment_receives', async () => {

  });

  factory.define('payment_receive_entry', 'payment_receives_entries', async () => {

  });


  factory.define('bill', 'bills', async () => {
    return {
      
    }
  });

  return factory;
}
