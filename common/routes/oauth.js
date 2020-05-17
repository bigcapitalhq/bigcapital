import { request, expect } from '~/testInit';

describe('routes: /oauth2/', () => {
  describe('POST `/api/oauth/token`', () => {
    it('Should `crediential` be required.', async () => {
      const res = await request().post('/api/oauth2/token').send({});
      expect(res.status).equals(200);
    });
  });
});
