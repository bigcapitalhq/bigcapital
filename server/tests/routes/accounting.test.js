import {
  request,
  expect,
  create,
  login,
} from '~/testInit';
import moment from 'moment';
import ManualJournal from '@/models/ManualJournal';
import AccountTransaction from '@/models/AccountTransaction';

let loginRes;

describe('routes: `/accounting`', () => {
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

    it('Should discard journal entries that has null credit and debit amount.', async () => {
      const account1 = await create('account');
      const account2 = await create('account');

      const res = await request()
        .post('/api/accounting/make-journal-entries')
        .set('x-access-token', loginRes.body.token)
        .send({
          date: new Date().toISOString(),
          reference: '1000',
          entries: [
            {
              credit: null,
              debit: 0,
              account_id: account1.id,
            },
            {
              credit: null,
              debit: 0,
              account_id: account2.id,
            },
          ],
        });

      expect(res.status).equals(400);
      expect(res.body.errors).include.something.that.deep.equal({
        type: 'CREDIT.DEBIT.SUMATION.SHOULD.NOT.EQUAL.ZERO',
        code: 400,
      });
    });

    it('Should store manual journal transaction to the storage.', async () => {
      const account1 = await create('account');
      const account2 = await create('account');

      const res = await request()
        .post('/api/accounting/make-journal-entries')
        .set('x-access-token', loginRes.body.token)
        .send({
          date: new Date('2020-2-2').toISOString(),
          reference: '1000',
          memo: 'Description here.',
          entries: [
            {
              credit: 1000,
              account_id: account1.id,
            },
            {
              debit: 1000,
              account_id: account2.id,
            },
          ],
        });

      const foundManualJournal = await ManualJournal.query();

      expect(foundManualJournal.length).equals(1);
      expect(foundManualJournal[0].reference).equals('1000');
      expect(foundManualJournal[0].transactionType).equals('Journal');
      expect(foundManualJournal[0].amount).equals(1000);
      expect(moment(foundManualJournal[0].date).format('YYYY-MM-DD')).equals('2020-02-02');
      expect(foundManualJournal[0].note).equals('Description here.');
      expect(foundManualJournal[0].userId).equals(1);
    });

    it('Should store journal transactions to the storage.', async () => {
      const account1 = await create('account');
      const account2 = await create('account');

      const res = await request()
        .post('/api/accounting/make-journal-entries')
        .set('x-access-token', loginRes.body.token)
        .send({
          date: new Date('2020-1-1').toISOString(),
          reference: '1000',
          memo: 'Description here.',
          entries: [
            {
              credit: 1000,
              account_id: account1.id,
              note: 'First note',
            },
            {
              debit: 1000,
              account_id: account2.id,
              note: 'Second note',
            },
          ],
        });

      const foundAccountsTransactions = await AccountTransaction.query();

      expect(foundAccountsTransactions.length).equals(2);

      expect(foundAccountsTransactions[0].credit).equals(1000);
      expect(foundAccountsTransactions[0].debit).equals(null);
      expect(foundAccountsTransactions[0].accountId).equals(account1.id);
      expect(foundAccountsTransactions[0].note).equals('First note');
      expect(foundAccountsTransactions[0].transactionType).equals('Journal');
      expect(foundAccountsTransactions[0].userId).equals(1);

      expect(foundAccountsTransactions[1].credit).equals(null);
      expect(foundAccountsTransactions[1].debit).equals(1000);
      expect(foundAccountsTransactions[1].accountId).equals(account2.id);
      expect(foundAccountsTransactions[1].note).equals('Second note');
      expect(foundAccountsTransactions[1].transactionType).equals('Journal');
      expect(foundAccountsTransactions[1].userId).equals(1);
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