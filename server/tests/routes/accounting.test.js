import { request, expect, create, login } from '~/testInit';

let loginRes;

describe('routes: /accounting', () => {
  beforeEach(async () => {
    loginRes = await login();
  });
  afterEach(() => {
    loginRes = null;
  });

  describe('route: `/accounting/make-journal-entries`', async () => {
    it('Should sumation of credit or debit does not equal zero.', async () => {
      const account = await create('account');
      const res = await request()
        .post('/api/accounting/make-journal-entries')
        .set('x-access-token', loginRes.body.token)
        .send({
          date: new Date().toISOString(),
          reference: 'ASC',
          entries: [
            {
              credit: 0,
              debit: 0,
              account_id: account.id,
            },
            {
              credit: 0,
              debit: 0,
              account_id: account.id,
            },
          ],
        });
      expect(res.status).equals(400);
      expect(res.body.errors).include.something.that.deep.equal({
        type: 'CREDIT.DEBIT.SUMATION.SHOULD.NOT.EQUAL.ZERO',
        code: 400,
      });
    });

    it('Should all credit entries equal debit.', async () => {
      const account = await create('account');
      const res = await request()
        .post('/api/accounting/make-journal-entries')
        .set('x-access-token', loginRes.body.token)
        .send({
          date: new Date().toISOString(),
          reference: 'ASC',
          entries: [
            {
              credit: 1000,
              debit: 0,
              account_id: account.id,
            },
            {
              credit: 0,
              debit: 500,
              account_id: account.id,
            },
          ],
        });

      expect(res.status).equals(400);
      expect(res.body.errors).include.something.that.deep.equal({
        type: 'CREDIT.DEBIT.NOT.EQUALS',
        code: 100,
      });
    });

    it('Should journal reference be not exists.', async () => {
      const manualJournal = await create('manual_journal');
      const account = await create('account');

      const res = await request()
        .post('/api/accounting/make-journal-entries')
        .set('x-access-token', loginRes.body.token)
        .send({
          date: new Date().toISOString(),
          reference: manualJournal.reference,
          entries: [
            {
              credit: 1000,
              debit: 0,
              account_id: account.id,
            },
            {
              credit: 0,
              debit: 1000,
              account_id: account.id,
            },
          ],
        });

      expect(res.status).equals(400);
      expect(res.body.errors).include.something.that.deep.equal({
        type: 'REFERENCE.ALREADY.EXISTS',
        code: 300,
      });
    });

    it('Should response error in case account id not exists.', async () => {
      const res = await request()
        .post('/api/accounting/make-journal-entries')
        .set('x-access-token', loginRes.body.token)
        .send({
          date: new Date().toISOString(),
          reference: '1000',
          entries: [
            {
              credit: 1000,
              debit: 0,
              account_id: 12,
            },
            {
              credit: 0,
              debit: 1000,
              account_id: 12,
            },
          ],
        });

      expect(res.status).equals(400);
      expect(res.body.errors).include.something.that.deep.equal({
        type: 'ACCOUNTS.IDS.NOT.FOUND',
        code: 200,
      });
    });

    it('Should store all journal entries to the storage.', async () => {

    });
  });

  describe('route: `/accounting/quick-journal-entries`', async () => {
    it('Shoud `credit_account_id` be required', () => {

    });
    it('Should `debit_account_id` be required.', () => {

    });

    it('Should `amount` be required.', () => {

    });

    it('Should credit account id be exists.', () => {

    });

    it('Should debit account id be exists.', () => {

    });

    it('Should store the quick journal entry to the storage.', () => {

    });
  });
});