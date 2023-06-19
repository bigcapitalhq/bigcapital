import knex from '@/database/knex';
import {
  request,
  expect,
  createUser,
} from '~/testInit';
import {
  tenantWebsite,
  tenantFactory,
  loginRes
} from '~/dbInit';
import Invite from '@/system/models/Invite'
import TenantUser from 'models/TenantUser';
import SystemUser from '@/system/models/SystemUser';

describe('routes: `/api/invite_users`', () => {
  describe('POST: `/api/invite_users/send`', () => {
    it('Should response unauthorized if the user was not authorized.', async () => {
      const res = await request().get('/api/invite_users/send');

      expect(res.status).equals(401);
      expect(res.body.message).equals('Unauthorized');
    });

    it('Should email be required.', async () => {
      const res = await request()
        .post('/api/invite/send')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(422);
      expect(res.body.errors).include.something.deep.equals({
        msg: 'Invalid value', param: 'email', location: 'body',
      });
    });

    it('Should email not be already registered in the system database.', async () => {
      const user = await createUser(tenantWebsite, {
        active: false,
        email: 'admin@admin.com',
      });
      
      const res = await request()
        .post('/api/invite/send')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          email: 'admin@admin.com',
        });

      expect(res.status).equals(400);
      expect(res.body.errors).include.something.deep.equals({
        type: 'USER.EMAIL.ALREADY.REGISTERED', code: 100,
      });
    });

    it('Should invite token be inserted to the master database.', async () => {
      const res = await request()
        .post('/api/invite/send')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          email: 'admin@admin.com'
        });

      const foundInviteToken = await Invite.query()
        .where('email', 'admin@admin.com').first();
      
      expect(foundInviteToken).is.not.null;
      expect(foundInviteToken.token).is.not.null;
    });

    it('Should invite email be inserted to users tenant database.', async () => {
      const res = await request()
        .post('/api/invite/send')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          email: 'admin@admin.com'
        });
    
      const foundTenantUser = await TenantUser.tenant().query()
        .where('email', 'admin@admin.com').first();

      expect(foundTenantUser).is.not.null;
      expect(foundTenantUser.email).equals('admin@admin.com');
      expect(foundTenantUser.firstName).equals('admin@admin.com');
      expect(foundTenantUser.createdAt).is.not.null;
    });
  });

  describe('POST: `/api/invite/accept/:token`', () => {
    let sendInviteRes; 
    let inviteUser;

    beforeEach(async () => {
      sendInviteRes = await request()
        .post('/api/invite/send')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          email: 'admin@admin.com'
        });

      inviteUser = await Invite.query()
        .where('email', 'admin@admin.com')
        .first();
    });

    it('Should the given token be valid.', async () => {
      const res = await request()
        .post('/api/invite/accept/invalid_token')
        .send({
          first_name: 'Ahmed',
          last_name: 'Bouhuolia',
          password: 'hard-password',
          phone_number: '0927918381',
        });

      expect(res.status).equals(404);
      expect(res.body.errors).include.something.deep.equals({
        type: 'INVITE.TOKEN.NOT.FOUND', code: 300,
      });
    });

    it('Should first_name be required.', async () => {
      const res = await request()
        .post(`/api/invite/accept/${inviteUser.token}`)
        .send();

      expect(res.status).equals(422);
      expect(res.body.errors).include.something.deep.equals({
        msg: 'Invalid value', param: 'first_name', location: 'body'
      });
    });

    it('Should last_name be required.', async () => {
      const res = await request()
        .post(`/api/invite/accept/${inviteUser.token}`)
        .send();

      expect(res.status).equals(422);
      expect(res.body.errors).include.something.deep.equals({
        msg: 'Invalid value', param: 'last_name', location: 'body'
      });
    });

    it('Should phone_number be required.', async () => {
      const res = await request()
        .post(`/api/invite/accept/${inviteUser.token}`)
        .send();

      expect(res.status).equals(422);
      expect(res.body.errors).include.something.deep.equals({
        msg: 'Invalid value', param: 'phone_number', location: 'body'
      });
    });

    it('Should password be required.', async () => {
      const res = await request()
      .post(`/api/invite/accept/${inviteUser.token}`)
      .send();

      expect(res.status).equals(422);
      expect(res.body.errors).include.something.deep.equals({
        msg: 'Invalid value', param: 'password', location: 'body'
      });
    });

    it('Should phone number not be already registered.', async () => {
      const user = await createUser(tenantWebsite);
      const res = await request()
        .post(`/api/invite/accept/${inviteUser.token}`)
        .send({
          first_name: 'Ahmed',
          last_name: 'Bouhuolia',
          password: 'hard-password',
          phone_number: user.phone_number,
        })
      
      expect(res.status).equals(400);
      expect(res.body.errors).include.something.deep.equals({
        type: 'PHONE_MUMNER.ALREADY.EXISTS', code: 400,
      });
    });

    it('Should tenant user details updated after invite accept.', async () => {
      const user = await createUser(tenantWebsite);
      const res = await request()
        .post(`/api/invite/accept/${inviteUser.token}`)
        .send({
          first_name: 'Ahmed',
          last_name: 'Bouhuolia',
          password: 'hard-password',
          phone_number: '0927918381',
        });

      const foundTenantUser = await TenantUser.tenant().query()
        .where('email', 'admin@admin.com').first();

      expect(foundTenantUser).is.not.null;
      expect(foundTenantUser.id).is.not.null;
      expect(foundTenantUser.email).equals('admin@admin.com');
      expect(foundTenantUser.firstName).equals('Ahmed');
      expect(foundTenantUser.lastName).equals('Bouhuolia');
      expect(foundTenantUser.active).equals(1);
      expect(foundTenantUser.inviteAcceptedAt).is.not.null;
      expect(foundTenantUser.createdAt).is.not.null;
      expect(foundTenantUser.updatedAt).is.not.null;
    });

    it('Should user details be inserted to the system database', async () => {
      const user = await createUser(tenantWebsite);
      const res = await request()
        .post(`/api/invite/accept/${inviteUser.token}`)
        .send({
          first_name: 'Ahmed',
          last_name: 'Bouhuolia',
          password: 'hard-password',
          phone_number: '0927918381',
        });

      const foundSystemUser = await SystemUser.query()
        .where('email', 'admin@admin.com').first();

      expect(foundSystemUser).is.not.null;
      expect(foundSystemUser.id).is.not.null;
      expect(foundSystemUser.tenantId).equals(inviteUser.tenantId);
      expect(foundSystemUser.email).equals('admin@admin.com');
      expect(foundSystemUser.firstName).equals('Ahmed');
      expect(foundSystemUser.lastName).equals('Bouhuolia');
      expect(foundSystemUser.active).equals(1);
      expect(foundSystemUser.lastLoginAt).is.null;
      expect(foundSystemUser.createdAt).is.not.null;
      expect(foundSystemUser.updatedAt).is.null;
    });

    it('Should invite token be deleted after invite accept.', async () => {
      const res = await request()
        .post(`/api/invite/accept/${inviteUser.token}`)
        .send({
          first_name: 'Ahmed',
          last_name: 'Bouhuolia',
          password: 'hard-password',
          phone_number: '0927918381',
        });
      
      const foundInviteToken = await Invite.query().where('token', inviteUser.token);
      expect(foundInviteToken.length).equals(0);
    });
  });

  describe('GET: `/api/invite_users/:token`', () => {
    it('Should response token invalid.', () => {

    });
  });
});