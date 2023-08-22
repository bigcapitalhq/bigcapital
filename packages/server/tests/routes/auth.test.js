import { request, expect, createUser } from '~/testInit';
import { hashPassword } from 'utils';
import knex from '@/database/knex';
import {
  tenantWebsite,
  tenantFactory,
  systemFactory,
  loginRes
} from '~/dbInit';
import TenantUser from 'models/TenantUser';
import PasswordReset from '@/system/models/PasswordReset';
import SystemUser from '@/system/models/SystemUser';


describe('routes: /auth/', () => {
  describe('POST `/api/auth/login`', () => {
    it('Should `crediential` be required.', async () => {
      const res = await request().post('/api/auth/login').send({});
      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');

      const paramsErrors = res.body.errors.map((error) => error.param);
      expect(paramsErrors).to.include('crediential');
    });

    it('Should `password` be required.', async () => {
      const res = await request().post('/api/auth/login').send();
      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');

      const paramsErrors = res.body.errors.map((error) => error.param);
      expect(paramsErrors).to.include('password');
    });

    it('Should the min length of the `password` be 5 ch.', async () => {
      const res = await request().post('/api/auth/login').send({
        crediential: 'admin@admin.com',
        password: 'test',
      });

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');

      const paramsErrors = res.body.errors.map((error) => error.param);
      expect(paramsErrors).to.include('password');
    });

    it('Should be a valid email format in crediential attribute.', async () => {
      const res = await request().post('/api/auth/login').send({
        crediential: 'admin',
        password: 'test',
      });

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');

      const paramsErrors = res.body.errors.map((error) => error.param);
      expect(paramsErrors).to.include('password');
    });

    it('Should not authenticate with wrong user email and password.', async () => {
      const res = await request().post('/api/auth/login').send({
        crediential: 'admin@admin.com',
        password: 'admin',
      });
      expect(res.body.errors).include.something.that.deep.equals({
        type: 'INVALID_DETAILS', code: 100,
      });
    });

    it('Should not authenticate in case user was not active.', async () => {
      const user = await createUser(tenantWebsite, {
        active: false,
        email: 'admin@admin.com',
      });

      const res = await request().post('/api/auth/login').send({
        crediential: 'admin@admin.com',
        password: 'admin',
      });
      expect(res.status).equals(400);
      expect(res.body.errors).include.something.that.deep.equals({
        type: 'USER_INACTIVE', code: 110,
      });
    });

    it('Should authenticate with correct email and password and active user.', async () => {
      const user = await createUser(tenantWebsite, {
        email: 'admin@admin.com',
      });
      const res = await request().post('/api/auth/login').send({
        crediential: user.email,
        password: 'admin',
      });
      expect(res.status).equals(200);
    });

    it('Should authenticate success with correct phone number and password.', async () => {
      const password = await hashPassword('admin');
      const user = await createUser(tenantWebsite, {
        phone_number: '0920000000',
        password,
      });
      const res = await request().post('/api/auth/login').send({
        crediential: user.email,
        password: 'admin',
      });

      expect(res.status).equals(200);
    });

    it('Should last login date be saved after success login.', async () => {
      const user = await createUser(tenantWebsite, {
        email: 'admin@admin.com',
      });
      const res = await request().post('/api/auth/login').send({
        crediential: user.email,
        password: 'admin',
      });
      const foundUserAfterUpdate = await TenantUser.tenant().query()
        .where('email', user.email)
        .where('first_name', user.first_name)
        .first();
 
      expect(res.status).equals(200);
      expect(foundUserAfterUpdate.lastLoginAt).to.not.be.null;
    });
  });

  describe('POST: `/auth/send_reset_password`', () => {
    it('Should `email` be required.', async () => {
      const res = await request().post('/api/auth/send_reset_password').send();

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');
    });

    it('Should response unproccessable if the email address was invalid.', async () => {
      const res = await request().post('/api/auth/send_reset_password').send({
        email: 'invalid_email',
      });

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');
    });

    it('Should response unproccessable if the email address was not exist.', async () => {
      const res = await request().post('/api/auth/send_reset_password').send({
        email: 'admin@admin.com',
      });

      expect(res.status).equals(400);
      expect(res.body.errors).include.something.that.deep.equals({
        type: 'EMAIL.NOT.REGISTERED', code: 200,
      });
    });

    it('Should delete all already tokens that associate to the given email.', async () => {
      const user = await createUser(tenantWebsite);
      const token = '123123';

      await knex('password_resets').insert({ email: user.email, token });

      await request().post('/api/auth/send_reset_password').send({
        email: user.email,
      });

      const oldPasswordToken = await knex('password_resets').where('token', token);

      expect(oldPasswordToken).to.have.lengthOf(0);
    });

    it('Should store new token associate with the given email.', async () => {
      const user = await createUser(tenantWebsite);
      await request().post('/api/auth/send_reset_password').send({
        email: user.email,
      });

      const token = await knex('password_resets').where('email', user.email);

      expect(token).to.have.lengthOf(1);
    });

    it('Should response success if the email was exist.', async () => {
      const user = await createUser(tenantWebsite);
      const res = await request().post('/api/auth/send_reset_password').send({
        email: user.email,
      });

      expect(res.status).equals(200);
    });
  });

  describe('POST: `/auth/reset/:token`', () => {
    // it('Should response forbidden if the token was invalid.', () => {

    // });

    it('Should response forbidden if the token was expired.', () => {

    });

    it('Should `password` be required.', async () => {
      const user = await createUser(tenantWebsite);
      const passwordReset = await systemFactory.create('password_reset', {
        email: user.email,
      });

      const res = await request()
        .post(`/api/auth/reset/${passwordReset.token}`)
        .send();

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');

      const paramsErrors = res.body.errors.map((error) => error.param);
      expect(paramsErrors).to.include('password');
    });

    it('Should password and confirm_password be equal.', async () => {
      const user = await createUser(tenantWebsite);
      const passwordReset = await systemFactory.create('password_reset', {
        email: user.email,
      });

      const res = await request()
        .post(`/api/auth/reset/${passwordReset.token}`)
        .send({
          password: '123123',
        });

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');

      const paramsErrors = res.body.errors.map((error) => error.param);
      expect(paramsErrors).to.include('password');
    });

    it('Should response success with correct data form.', async () => {
      const user = await createUser(tenantWebsite);
      const passwordReset = await systemFactory.create('password_reset', {
        email: user.email,
      });

      const res = await request()
        .post(`/api/auth/reset/${passwordReset.token}`)
        .send({
          password: '123123',
          confirm_password: '123123',
        });
      expect(res.status).equals(200);
    });

    it('Should token be deleted after success response.', async () => {
      const user = await createUser(tenantWebsite);
      const passwordReset = await systemFactory.create('password_reset', {
        email: user.email,
      });
      await request()
        .post(`/api/auth/reset/${passwordReset.token}`)
        .send({
          password: '123123',
          confirm_password: '123123',
        });

      const foundTokens = await PasswordReset.query().where('email', passwordReset.email);

      expect(foundTokens).to.have.lengthOf(0);
    });

    it('Should password be updated after success response.', async () => {
      const user = await createUser(tenantWebsite);
      const passwordReset = await systemFactory.create('password_reset', {
        email: user.email,
      });

      const res = await request().post(`/api/auth/reset/${passwordReset.token}`).send({
        password: '123123',
        confirm_password: '123123',
      });
      const systemUserPasswordUpdated = await SystemUser.query()
        .where('id', user.id).first();

      expect(systemUserPasswordUpdated.id).equals(user.id);
      expect(systemUserPasswordUpdated.password).not.equals(user.password);
    });
  });
});
