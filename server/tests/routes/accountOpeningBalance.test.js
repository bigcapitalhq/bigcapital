import { request, expect } from '~/testInit';

describe('routes: `/accountOpeningBalance`', () => {
  describe('POST `/accountOpeningBalance`', () => {
    it('Should `accounts` be array type.', async () => {
      const res = await request().post('/api/accountOpeningBalance').send({
        accounts: 1000,
      });

      expect(res.status).equals(422);
      expect(res.body.code).equals('VALIDATION_ERROR');
    });

    it('Should `accounts.*.id` be integer', async () => {
      const res = await request().post('/api/accountOpeningBalance').send({
        accounts: 1000,
      });

      expect(res.status).equals(422);
      expect(res.body.code).equals('VALIDATION_ERROR');
    });

    it('Should `accounts.*.debit` be numeric.', async () => {
      const res = await request().post('/api/accountOpeningBalance').send({
        accounts: [{ id: 'id' }],
      });

      expect(res.status).equals(422);
    });

    it('Should `accounts.*.id` be exist in the storage.', async () => {
      const res = await request().post('/api/accountOpeningBalance').send({
        accounts: [
          { id: 100, credit: 100, debit: 100 },
        ],
      });

      expect(res.status).equals(422);
      expect(res.body.errors).include.something.that.deep.equals({
        type: 'NOT_FOUND_ACCOUNT', code: 100, ids: [100],
      });
    });
  });
});
