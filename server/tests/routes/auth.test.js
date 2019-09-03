import { request, expect, create } from '~/testInit';
import { hashPassword } from '@/utils';

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
      const user = await create('user', {
        active: false,
      });
      const res = await request().post('/api/auth/login').send({
        crediential: user.email,
        password: 'admin',
      });

      expect(res.status).equals(400);
      expect(res.body.errors).include.something.that.deep.equals({
        type: 'INCORRECT_PASSWORD', code: 120,
      });
    });

    it('Should authenticate with correct email and password and active user.', async () => {
      const user = await create('user', {
        password: hashPassword('admin'),
      });
      const res = await request().post('/api/auth/login').send({
        crediential: user.email,
      });

      expect(res.status).equals(200);
    });

    it('Should autheticate success with correct phone number and password.', async () => {
      const password = hashPassword('admin');
      const user = await create('user', {
        phone_number: '0920000000',
        password,
      });
      const res = await request().post('/api/auth/login').send({
        crediential: user.phone_number,
        password,
      });

      expect(res.status).equals(200);
    });

    it('Should last login date be saved after success login.', async () => {
      const user = await create('user', {
        password: hashPassword('admin'),
      });
      const res = await request().post('/api/auth/login').send({
        crediential: user.email,
        password: 'admin',
      });

      expect(res.status).equals(200);
    });
  });

  // describe('POST: `auth/send_reset_password`', () => {

  //   it('Should `email` be required.', () => {

  //   });

  //   it('Should response unproccessable if the email address was invalid.', () => {

  //   });

  //   it('Should response unproccessable if the email address was not exist.', () => {

  //   });

  //   it('Should delete all already tokens that associate to the given email.', () => {

  //   });

  //   it('Should store new token associate with the given email.', () => {

  //   });

  //   it('Should response success if the email was exist.', () => {

  //   });

  //   it('Should token be stored to the table after success request.', () => {

  //   });
  // });

  // describe('POST: `/auth/reset/:token`', () => {

  //   it('Should response forbidden if the token was invalid.', () => {

  //   });

  //   it('Should response forbidden if the token was expired.', () => {

  //   });

  //   it('Should password be required.', () => {

  //   });

  //   it('Should password and confirm_password be equal.', () => {

  //   });

  //   it('Should token be deleted after success response.', () => {

  //   });

  //   it('Should password be updated after success response.', () => {

  //   })
  // });
});
