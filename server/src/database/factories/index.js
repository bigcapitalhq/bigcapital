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
}));

factory.define('account', 'accounts', async () => {
  const accountType = await factory.create('account_type');
  return {
    name: faker.lorem.word(),
    account_type_id: accountType.id,
    description: faker.lorem.paragraph(),
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

export default factory;
