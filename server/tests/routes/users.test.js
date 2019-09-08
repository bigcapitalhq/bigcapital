import knex from '@/database/knex';
import {
  request,
  expect,
  create,
  make,
} from '~/testInit';

describe('routes: `/routes`', () => {
  describe('POST: `/routes`', () => {
    it('Should create a new user if the user was not authorized.', () => {

    });

    it('Should `first_name` be required.', async () => {
      const res = await request().post('/api/users');

      expect(res.status).equals(422);

      const foundFirstNameParam = res.body.errors.find((error) => error.param === 'first_name');
      expect(!!foundFirstNameParam).equals(true);
    });

    it('Should `last_name` be required.', async () => {
      const res = await request().post('/api/users');

      expect(res.status).equals(422);

      const foundFirstNameParam = res.body.errors.find((error) => error.param === 'last_name');
      expect(!!foundFirstNameParam).equals(true);
    });

    it('Should `email` be required.', async () => {
      const res = await request().post('/api/users');

      expect(res.status).equals(422);

      const foundEmailParam = res.body.errors.find((error) => error.param === 'email');
      expect(!!foundEmailParam).equals(true);
    });

    it('Should be `email` be valid format.', async () => {
      const user = make('user');
      const res = await request().post('/api/users').send({
        first_name: user.first_name,
        last_name: user.last_name,
        email: 'email',
        phone_number: user.phone_number,
        status: 1,
      });

      expect(res.status).equals(422);

      const foundEmailParam = res.body.errors.find((error) => error.param === 'email');
      expect(!!foundEmailParam).equals(true);
    });

    it('Should `phone_number` be valid format.', async () => {
      const user = make('user');
      const res = await request().post('/api/users').send({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone_number: 'phone_number',
        status: 1,
      });

      expect(res.status).equals(422);

      const phoneNumberParam = res.body.errors.find((error) => error.param === 'phone_number');
      expect(!!phoneNumberParam).equals(true);
    });

    it('Should `password` be required.', async () => {
      const res = await request().post('/api/users').send();

      expect(res.status).equals(422);

      const passwordParam = res.body.errors.find((error) => error.param === 'password');
      expect(!!passwordParam).equals(true);
    });

    it('Should password be equals confirm_password.', async () => {
      const res = await request().post('/api/users').send({
        password: '123123',
      });

      expect(res.status).equals(422);

      const passwordParam = res.body.errors.find((error) => error.param === 'password');
      expect(!!passwordParam).equals(true);
    });

    it('Should `status` be boolean', async () => {
      const res = await request().post('/api/users').send({
        status: 'not_boolean',
      });

      expect(res.status).equals(422);

      const statusParam = res.body.errors.find((error) => error.param === 'status');
      expect(!!statusParam).equals(true);
    });

    it('Should response bad request in case email was already exist.', async () => {
      const user = await create('user');
      const res = await request().post('/api/users').send({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone_number: user.phone_number,
        password: '123123123',
        confirm_password: '123123123',
        status: 1,
      });

      expect(res.status).equals(400);
      expect(res.body.errors).include.something.that.deep.equals({
        type: 'EMAIL_ALREADY_EXIST', code: 100,
      });
    });

    it('Should response bad request in case phone number was already exist.', async () => {
      const user = await create('user');
      const res = await request().post('/api/users').send({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone_number: user.phone_number,
        password: user.password,
        confirm_password: user.password,
        status: 1,
      });

      expect(res.status).equals(400);
      expect(res.body.errors).include.something.that.deep.equals({
        type: 'PHONE_NUMBER_ALREADY_EXIST', code: 120,
      });
    });

    it('Should response success with correct data type.', async () => {
      const user = await make('user');
      const res = await request().post('/api/users').send({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone_number: user.phone_number,
        password: user.password,
        confirm_password: user.password,
        status: 1,
      });

      expect(res.status).equals(200);
    });
  });

  describe('POST: `/users/:id`', () => {
    it('Should create a new user if the user was not authorized.', () => {

    });

    it('Should `first_name` be required.', async () => {
      const user = await create('user');
      const res = await request().post(`/api/users/${user.id}`);

      expect(res.status).equals(422);

      const foundFirstNameParam = res.body.errors.find((error) => error.param === 'first_name');
      expect(!!foundFirstNameParam).equals(true);
    });

    it('Should `last_name` be required.', async () => {
      const user = await create('user');
      const res = await request().post(`/api/users/${user.id}`);

      expect(res.status).equals(422);

      const foundFirstNameParam = res.body.errors.find((error) => error.param === 'last_name');
      expect(!!foundFirstNameParam).equals(true);
    });

    it('Should `email` be required.', async () => {
      const user = await create('user');
      const res = await request().post(`/api/users/${user.id}`);

      expect(res.status).equals(422);

      const foundEmailParam = res.body.errors.find((error) => error.param === 'email');
      expect(!!foundEmailParam).equals(true);
    });

    it('Should be `email` be valid format.', async () => {
      const user = await create('user');
      const res = await request().post(`/api/users/${user.id}`).send({
        first_name: user.first_name,
        last_name: user.last_name,
        email: 'email',
        phone_number: user.phone_number,
        status: 1,
      });

      expect(res.status).equals(422);

      const foundEmailParam = res.body.errors.find((error) => error.param === 'email');
      expect(!!foundEmailParam).equals(true);
    });

    it('Should `phone_number` be valid format.', async () => {
      const user = create('user');
      const res = await request().post(`/api/users/${user.id}`).send({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone_number: 'phone_number',
        status: 1,
      });

      expect(res.status).equals(422);

      const phoneNumberParam = res.body.errors.find((error) => error.param === 'phone_number');
      expect(!!phoneNumberParam).equals(true);
    });

    it('Should `password` be required.', async () => {
      const user = create('user');
      const res = await request().post(`/api/users/${user.id}`).send();

      expect(res.status).equals(422);

      const passwordParam = res.body.errors.find((error) => error.param === 'password');
      expect(!!passwordParam).equals(true);
    });

    it('Should password be equals confirm_password.', async () => {
      const user = create('user');
      const res = await request().post(`/api/users/${user.id}`).send({
        password: '123123',
      });

      expect(res.status).equals(422);

      const passwordParam = res.body.errors.find((error) => error.param === 'password');
      expect(!!passwordParam).equals(true);
    });

    it('Should `status` be boolean', async () => {
      const user = create('user');
      const res = await request().post(`/api/users/${user.id}`).send({
        status: 'not_boolean',
      });

      expect(res.status).equals(422);

      const statusParam = res.body.errors.find((error) => error.param === 'status');
      expect(!!statusParam).equals(true);
    });
  });

  describe('GET: `/users/:id`', () => {
    it('Should not success if the user was not authorized.', () => {

    });

    it('Should response not found if the user was not exist.', async () => {
      const res = await request().get('/api/users/10').send();

      expect(res.status).equals(404);
    });

    it('Should response success if the user was exist.', async () => {
      const user = await create('user');
      const res = await request().get(`/api/users/${user.id}`).send();

      expect(res.status).equals(200);
    });
  });

  describe('DELETE: `/users/:id`', () => {
    it('Should not success if the user was not authorized.', () => {

    });

    it('Should response not found if the user was not exist.', async () => {
      const res = await request().delete('/api/users/10').send();

      expect(res.status).equals(404);
    });

    it('Should response success if the user was exist.', async () => {
      const user = await create('user');
      const res = await request().delete(`/api/users/${user.id}`).send();

      expect(res.status).equals(200);
    });

    it('Should delete the give user from the storage.', async () => {
      const user = await create('user');
      await request().delete(`/api/users/${user.id}`).send();

      const storedUsers = await knex('users').where('id', user.id);

      expect(storedUsers).to.have.lengthOf(0);
    });
  });
});
