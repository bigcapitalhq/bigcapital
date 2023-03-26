import knex from '@/database/knex';
import {
  request,
  expect,
} from '~/testInit';
import {
  tenantWebsite,
  tenantFactory,
  loginRes
} from '~/dbInit';


describe('routes: `/routes`', () => {
  describe('GET: `/users`', () => {
    it('Should response unauthorized if the user was not authorized.', async () => {
      const res = await request().get('/api/users');

      expect(res.status).equals(401);
      expect(res.body.message).equals('Unauthorized');
    });

    it('Should retrieve the stored users with pagination meta.', async () => {
      await tenantFactory.create('user');

      const res = await request()
        .get('/api/users')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.body.users.results.length).equals(2);
      expect(res.body.users.total).equals(2);
    });
  });

  describe('POST: `/users/:id`', () => {
    it('Should create a new user if the user was not authorized.', async () => {
      const user = await tenantFactory.create('user');
      const res = await request()
        .post(`/api/users/${user.id}`);

      expect(res.status).equals(401);
      expect(res.body.message).equals('Unauthorized');
    });

    it('Should `first_name` be required.', async () => {
      const user = await  tenantFactory.create('user');
      const res = await request()
        .post(`/api/users/${user.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(422);

      const foundFirstNameParam = res.body.errors.find((error) => error.param === 'first_name');
      expect(!!foundFirstNameParam).equals(true);
    });

    it('Should `last_name` be required.', async () => {
      const user = await tenantFactory.create('user');
      const res = await request()
        .post(`/api/users/${user.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(422);

      const foundFirstNameParam = res.body.errors.find((error) => error.param === 'last_name');
      expect(!!foundFirstNameParam).equals(true);
    });

    it('Should `email` be required.', async () => {
      const user = await tenantFactory.create('user');
      const res = await request()
        .post(`/api/users/${user.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(422);

      const foundEmailParam = res.body.errors.find((error) => error.param === 'email');
      expect(!!foundEmailParam).equals(true);
    });

    it('Should be `email` be valid format.', async () => {
      const user = await tenantFactory.create('user');
      const res = await request()
        .post(`/api/users/${user.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
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
      const user = tenantFactory.create('user');
      const res = await request()
        .post(`/api/users/${user.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
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
  });

  describe('GET: `/users/:id`', () => {
    it('Should not success if the user was not authorized.', async () => {
      const res = await request().get('/api/users/1');

      expect(res.status).equals(401);
      expect(res.body.message).equals('Unauthorized');
    });

    it('Should response not found if the user was not exist.', async () => {
      const res = await request()
        .get('/api/users/10')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(404);
    });

    it('Should response success if the user was exist.', async () => {
      const user = await tenantFactory.create('user');
      const res = await request()
        .get(`/api/users/${user.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(200);
    });
  });

  describe('DELETE: `/users/:id`', () => {
    it('Should not success if the user was not authorized.', async () => {
      const res = await request().delete('/api/users/1');

      expect(res.status).equals(401);
      expect(res.body.message).equals('Unauthorized');
    });

    it('Should response not found if the user was not exist.', async () => {
      const res = await request()
        .delete('/api/users/10')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(404);
      expect(res.body.errors).include.something.that.deep.equals({
        type: 'USER_NOT_FOUND', code: 100,
      });
    });

    it('Should response success if the user was exist.', async () => {
      const user = await tenantFactory.create('user');
      const res = await request()
        .delete(`/api/users/${user.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(200);      
    });

    it('Should delete the give user from the storage.', async () => {
      const user = await tenantFactory.create('user');
      await request()
        .delete(`/api/users/${user.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      const storedUsers = await knex('users').where('id', user.id);
      expect(storedUsers).to.have.lengthOf(0);
    });
  });
});
