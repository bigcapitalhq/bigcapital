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
    phone_number: faker.phone.phoneNumber(),
    active: 1,
    password: hashedPassword,
  };
});

factory.define('account', 'accounts', async () => ({
  name: faker.lorem.word(),
  type: faker.lorem.word(),
  description: faker.lorem.paragraph(),
}));

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

export default factory;
