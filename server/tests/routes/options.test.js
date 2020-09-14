import {
  request,
  expect,
} from '~/testInit';
import Option from 'models/Option';
import {
  tenantWebsite,
  tenantFactory,
  loginRes
} from '~/dbInit';


describe('routes: `/options`', () => {
  describe('POST: `/options/`', () => {
    it('Should response unauthorized if the user was not logged in.', async () => {
      const res = await request()
        .post('/api/options')
        .send();

      expect(res.status).equals(401);
      expect(res.body.message).equals('Unauthorized');
    });

    it('Should response the options key and group is not defined.', async () => {
      const res = await request()
        .post('/api/options')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          options: [
            {
              key: 'key',
              value: 'hello world',
              group: 'group',
            },
          ],
        });

      expect(res.status).equals(400);
      expect(res.body.errors).include.something.that.deep.equals({
        type: 'OPTIONS.KEY.NOT.DEFINED',
        code: 200,
        keys: [
          { key: 'key', group: 'group' },
        ],
      });
    });

    it('Should save options to the storage.', async () => {
      const res = await request()
        .post('/api/options')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          options: [{
            key: 'name',
            group: 'organization',
            value: 'hello world', 
          }],
        });
      expect(res.status).equals(200);

      const storedOptions = await Option.tenant().query()
        .where('group', 'organization')
        .where('key', 'name');

      expect(storedOptions.metadata.length).equals(1);
    });
  });

  describe('GET: `/options`', () => {
    it('Should response unauthorized if the user was not unauthorized.', async () => {
      const res = await request()
        .get('/api/options')
        .query({
          group: 'organization',
        })
        .send();

      expect(res.status).equals(401);
      expect(res.body.message).equals('Unauthorized');
    });

    it('Should retrieve options the associated to the given group.', async () => {
      await tenantFactory.create('option', { group: 'organization', key: 'name' });
      await tenantFactory.create('option', { group: 'organization', key: 'base_currency' });

      const res = await request()
        .get('/api/options')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .query({
          group: 'organization',
        })
        .send();

      expect(res.status).equals(200);
      expect(res.body.options).is.an('array');
      expect(res.body.options.length).equals(2);
    });

    it('Should retrieve options that associated to the given key.', async () => {
      await tenantFactory.create('option', { group: 'organization', key: 'base_currency' });
      await tenantFactory.create('option', { group: 'organization', key: 'name' });

      const res = await request()
        .get('/api/options')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .query({
          key: 'name',
        })
        .send();

      expect(res.status).equals(200);
      expect(res.body.options).is.an('array');
      expect(res.body.options.length).equals(1);
    });
  });
});