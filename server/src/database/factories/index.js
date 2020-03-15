import knexFactory from 'knex-factory';
import faker from 'faker';
import knex from '@/database/knex';
import { hashPassword } from '@/utils';

const factory = knexFactory(knex);

factory.define('user', 'users', async () => {
  const hashedPassword = await hashPassword('admin');
  return {
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    email: faker.internet.email(),
    phone_number: faker.phone.phoneNumberFormat().replace('-', ''),
    active: 1,
    password: hashedPassword,
  };
});

factory.define('password_reset', 'password_resets', async () => {
  const user = await faker.create('user');
  return {
    user_id: user.id,
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
    reference: faker.random.number(),
    amount: faker.random.number(),
    // date: faker.random,
    user_id: user.id,
  };
});

factory.define('item_category', 'items_categories', () => ({
  label: faker.name.firstName(),
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
  const account = await factory.create('account');
  return {
    name: faker.lorem.word(),
    note: faker.lorem.paragraph(),
    cost_price: faker.random.number(),
    sell_price: faker.random.number(),
    cost_account_id: account.id,
    sell_account_id: account.id,
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

factory.define('expense', 'expenses', async () => {
  const paymentAccount = await factory.create('account');
  const expenseAccount = await factory.create('account');
  const user = await factory.create('user');

  return {
    payment_account_id: paymentAccount.id,
    expense_account_id: expenseAccount.id,
    user_id: user.id,
    amount: faker.random.number(),
    currency_code: 'USD',
  };
});

factory.define('option', 'options', async () => {
  return {
    key: faker.lorem.slug(),
    value: faker.lorem.slug(),
    group: faker.lorem.slug(),
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

export default factory;
