import { request, expect, create, login } from '~/testInit';
import ManualJournal from '../../src/models/ManualJournal';
import AccountTransaction from '@/models/AccountTransaction';
let loginRes;

describe('routes: `/accountOpeningBalance`', () => {
  beforeEach(async () => { 
    loginRes = await login();
  });
  afterEach(() => {
    loginRes = null;
  });
  describe('POST `/accountOpeningBalance`', () => {
    it('Should `accounts` be array type.', async () => {
      const res = await request()
        .post('/api/accounts_opening_balances')
        .send({
          accounts: 1000,
        });

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');
    });

    it('Should `accounts.*.id` be integer', async () => {
      const res = await request()
        .post('/api/accounts_opening_balances')
        .send({
          accounts: [
            { id: 'id' },
          ]
        });
      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');
      expect(res.body.errors).include.something.that.deep.equals({
        value: 'id',
        msg: 'Invalid value',
        param: 'accounts[0].id',
        location: 'body',
      });
    });

    it('Should `accounts.*.debit` be numeric.', async () => {
      const res = await request()
        .post('/api/accounts_opening_balances')
        .send({
          balance_adjustment_account: 10,
          accounts: [{ id: 100, debit: 'id' }],
        });
      expect(res.status).equals(422);
    });

    it('Should `accounts.*.id` be exist in the storage.', async () => {
      const res = await request()
        .post('/api/accounts_opening_balances')
        .send({
          balance_adjustment_account: 10,
          accounts: [
            { id: 100, credit: 100 },
          ],
        });
      expect(res.status).equals(422);
      expect(res.body.errors).include.something.that.deep.equals({
        type: 'NOT_FOUND_ACCOUNT', code: 100, ids: [100],
      });
    });

    it('Should response bad request in case balance adjustment account was not exist.', async () => {
      const debitAccount = await create('account');
      const creditAccount = await create('account');

      const res = await request()
        .post('/api/accounts_opening_balances')
        .send({
          balance_adjustment_account: 10,
          accounts: [
            { id: debitAccount.id, credit: 100, debit: 2 },
            { id: creditAccount.id, credit: 0, debit: 100 },
          ]
        });

      expect(res.body.errors).include.something.that.deep.equals({
        type: 'BALANCE.ADJUSTMENT.ACCOUNT.NOT.EXIST', code: 300,
      });
    });

    it('Should store the manual transaction to the storage.', async () => {
      const debitAccount = await create('account');
      const creditAccount = await create('account');
      const balance = await create('account');

      const res = await request()
        .post('/api/accounts_opening_balances')
        .set('x-access-token', loginRes.body.token)
        .send({
          balance_adjustment_account: balance.id,
          accounts: [
            { id: debitAccount.id, credit: 100, debit: 2 },
            { id: creditAccount.id, credit: 0, debit: 100 },
          ]
        });

      const manualJournal = await ManualJournal.query().findById(res.body.id);
      expect(manualJournal.amount).equals(100);
      expect(manualJournal.transaction_type).equals('OpeningBalance');
    });

    it('Should store the jouranl entries of account balance transaction.', async () => {
      const debitAccount = await create('account');
      const creditAccount = await create('account');
      const balance = await create('account');

      const res = await request()
        .post('/api/accounts_opening_balances')
        .set('x-access-token', loginRes.body.token)
        .send({
          balance_adjustment_account: balance.id,
          accounts: [
            { id: debitAccount.id, credit: 100, debit: 2 },
            { id: creditAccount.id, credit: 0, debit: 100 },
          ]
        });

      const transactions = await AccountTransaction.query()
        .where('reference_type', 'OpeningBalance')
        .where('reference_id', res.body.id);

      expect(transactions.length).equals(2);
    });

    it('Should adjustment with balance adjustment account with bigger than zero.', async () => {
      const debitAccount = await create('account');
      const balance = await create('account');

      const res = await request()
        .post('/api/accounts_opening_balances')
        .set('x-access-token', loginRes.body.token)
        .send({
          balance_adjustment_account: balance.id,
          accounts: [
            { id: debitAccount.id, credit: 0, debit: 100 },
          ]
        });

      const transactions = await AccountTransaction.query()
        .where('reference_type', 'OpeningBalance')
        .where('reference_id', res.body.id);

      expect(transactions.length).equals(2);
    });
  });
});
