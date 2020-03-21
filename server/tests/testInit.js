import chai from 'chai';
import chaiHttp from 'chai-http';
import chaiThings from 'chai-things';

import knex from '@/database/knex';
import '@/models';
import app from '@/app';
import factory from '@/database/factories';
import dbManager from '@/database/manager';
// import { hashPassword } from '@/utils';

const request = () => chai.request(app);
const { expect } = chai;

const login = async (givenUser) => {
  const user = !givenUser ? await factory.create('user') : givenUser;

  const response = request()
    .post('/api/auth/login')
    .send({
      crediential: user.email,
      password: 'admin',
    });
  return response;
};

before(async () => {
  await dbManager.closeKnex();
  await dbManager.close();
  // await dbManager.dropDb();
  // await dbManager.createDb();
});

beforeEach(async () => {
  await knex.migrate.rollback();
  await knex.migrate.latest();
});

after(async () => {
});

chai.use(chaiHttp);
chai.use(chaiThings);

const create = async (name, data) => factory.create(name, data);
const make = async (name, data) => factory.build(name, data);

export {
  login,
  create,
  make,
  expect,
  request,
};
