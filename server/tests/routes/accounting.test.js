import {
  request,
  expect,
  create,
  login,
} from '~/testInit';
import moment from 'moment';
import ManualJournal from '@/models/ManualJournal';
import AccountTransaction from '@/models/AccountTransaction';
import AccountBalance from '@/models/AccountBalance';

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
          journal_number: '123',
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
          journal_number: '123',
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
          journal_number: manualJournal.journalNumber,
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
        type: 'JOURNAL.NUMBER.ALREADY.EXISTS',
        code: 300,
      });
    });

    it('Should response error in case account id not exists in one of the given entries.', async () => {
      const res = await request()
        .post('/api/accounting/make-journal-entries')
        .set('x-access-token', loginRes.body.token)
        .send({
          date: new Date().toISOString(),
          journal_number: '123',
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
          journal_number: '1000',
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
          journal_number: '1000',
          reference: '2000',
          description: 'Description here.',
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
      
      expect(foundManualJournal[0].reference).equals('2000');
      expect(foundManualJournal[0].journalNumber).equals('1000');
      expect(foundManualJournal[0].transactionType).equals('Journal');
      expect(foundManualJournal[0].amount).equals(1000);
      expect(moment(foundManualJournal[0].date).format('YYYY-MM-DD')).equals('2020-02-02');
      expect(foundManualJournal[0].description).equals('Description here.');
      expect(foundManualJournal[0].userId).to.be.a('integer');
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

  describe('route: POST: `/accounting/manual-journal/:id`', () => {
    it('Should response not found in case manual journal transaction was not exists.', async () => {
      const res = await request()
        .post('/api/manual-journal/1000')
        .set('x-access-token', loginRes.body.token)
        .send();

      expect(res.status).equals(404);
    });

    it('Should sumation of credit or debit be equal zero.', async () => {
      const manualJournal = await create('manual_journal');

      const res = await request()
        .post(`/api/accounting/manual-journal/${manualJournal.id}`)
        .set('x-access-token', loginRes.body.token)
        .send({
          date: new Date().toISOString(),
          journal_number: '123',
          reference: 'ASC',
          entries: [
            {
              credit: 0,
              debit: 0,
              account_id: 2000,
            },
            {
              credit: 0,
              debit: 0,
              account_id: 2000,
            },
          ],
        });

      expect(res.status).equals(400);
      expect(res.body.errors).include.something.that.deep.equal({
        type: 'CREDIT.DEBIT.SUMATION.SHOULD.NOT.EQUAL.ZERO',
        code: 400,
      });
    });

    it('Should all credit and debit sumation be equal.', async () => {
      const manualJournal = await create('manual_journal');

      const res = await request()
        .post(`/api/accounting/manual-journal/${manualJournal.id}`)
        .set('x-access-token', loginRes.body.token)
        .send({
          date: new Date().toISOString(),
          journal_number: '123',
          reference: 'ASC',
          entries: [
            {
              credit: 0,
              debit: 2000,
              account_id: 2000,
            },
            {
              credit: 1000,
              debit: 0,
              account_id: 2000,
            },
          ],
        });

      expect(res.status).equals(400);
      expect(res.body.errors).include.something.that.deep.equal({
        type: 'CREDIT.DEBIT.NOT.EQUALS', code: 100,
      });
    });

    it('Should response journal number already exists in case another one on the storage.', async () => {
      const manualJournal = await create('manual_journal');
      const manualJournal2 = await create('manual_journal');

      const jsonBody = {
        date: new Date().toISOString(),
        reference: 'ASC',
        entries: [
          {
            credit: 0,
            debit: 2000,
            account_id: 2000,
          },
          {
            credit: 1000,
            debit: 0,
            account_id: 2000,
          },
        ],
      };

      const res = await request()
        .post(`/api/accounting/manual-journal/${manualJournal.id}`)
        .set('x-access-token', loginRes.body.token)
        .send({
          ...jsonBody,
          journal_number: manualJournal2.journalNumber,
        });
      expect(res.status).equals(400);
      expect(res.body.errors).include.something.that.deep.equal({
        type: 'JOURNAL.NUMBER.ALREADY.EXISTS', code: 300,
      });
    });

    it('Should not response journal number exists in case was unique number.', async () => {
      const manualJournal = await create('manual_journal');
      const manualJournal2 = await create('manual_journal');

      const jsonBody = {
        date: new Date().toISOString(),
        reference: 'ASC',
        entries: [
          {
            credit: 0,
            debit: 2000,
            account_id: 2000,
          },
          {
            credit: 1000,
            debit: 0,
            account_id: 2000,
          },
        ],
      };
      const res = await request()
        .post(`/api/accounting/manual-journal/${manualJournal.id}`)
        .set('x-access-token', loginRes.body.token)
        .send({
          ...jsonBody,
          journal_number: manualJournal.journalNumber,
        });

      expect(res.status).equals(400);
      expect(res.body.errors).not.include.something.that.deep.equal({
        type: 'JOURNAL.NUMBER.ALREADY.EXISTS', code: 300,
      });
    })

    it('Should response error in case account id not exists in one of the given entries.', async () => {
      const manualJournal = await create('manual_journal');
      const manualJournal2 = await create('manual_journal');

      const jsonBody = {
        date: new Date().toISOString(),
        reference: 'ASC',
        entries: [
          {
            credit: 0,
            debit: 1000,
            account_id: 2000,
          },
          {
            credit: 1000,
            debit: 0,
            account_id: 2000,
          },
        ],
      };
      const res = await request()
        .post(`/api/accounting/manual-journal/${manualJournal.id}`)
        .set('x-access-token', loginRes.body.token)
        .send({
          ...jsonBody,
          journal_number: manualJournal.journalNumber,
        });

      expect(res.status).equals(400);
      expect(res.body.errors).include.something.that.deep.equal({
        type: 'ACCOUNTS.IDS.NOT.FOUND', code: 200,
      }); 
    });

    it('Should update the given manual journal transaction in the storage.', async () => {
      const manualJournal = await create('manual_journal');
      const account1 = await create('account');
      const account2 = await create('account');

      const res = await request()
        .post(`/api/accounting/manual-journal/${manualJournal.id}`)
        .set('x-access-token', loginRes.body.token)
        .send({
          journal_number: '123',
          date: new Date().toISOString(),
          reference: 'ABC',
          description: 'hello world',
          entries: [
            {
              credit: 0,
              debit: 1000,
              account_id: account1.id,
            },
            {
              credit: 1000,
              debit: 0,
              account_id: account2.id,
            },
          ],
        });
      
      const foundManualJournal = await ManualJournal.query()
        .where('id', manualJournal.id);

      expect(foundManualJournal.length).equals(1);
      expect(foundManualJournal[0].journalNumber).equals('123');
      expect(foundManualJournal[0].reference).equals('ABC');
      expect(foundManualJournal[0].description).equals('hello world');
    });

    it('Should update account transactions that associated to the manual journal transaction.', async () => {
      const manualJournal = await create('manual_journal');
      const account1 = await create('account');
      const account2 = await create('account');
      const transaction = await create('account_transaction', {
        reference_type: 'Journal',
        reference_id: manualJournal.id,
      });
      const transaction2 = await create('account_transaction', {
        reference_type: 'Journal',
        reference_id: manualJournal.id,
      });

      const res = await request()
        .post(`/api/accounting/manual-journal/${manualJournal.id}`)
        .set('x-access-token', loginRes.body.token)
        .send({
          journal_number: '123',
          date: new Date().toISOString(),
          reference: 'ABC',
          description: 'hello world',
          entries: [
            {
              credit: 0,
              debit: 1000,
              account_id: account1.id,
              note: 'hello 1',
            },
            {
              credit: 1000,
              debit: 0,
              account_id: account2.id,
              note: 'hello 2',
            },
          ],
        });

      const foundTransactions = await AccountTransaction.query();
    
      expect(foundTransactions.length).equals(2);
      expect(foundTransactions[0].credit).equals(0);
      expect(foundTransactions[0].debit).equals(1000);
      expect(foundTransactions[0].accountId).equals(account1.id);
      expect(foundTransactions[0].note).equals('hello 1');

      expect(foundTransactions[1].credit).equals(1000);
      expect(foundTransactions[1].debit).equals(0);
      expect(foundTransactions[1].accountId).equals(account2.id);
      expect(foundTransactions[1].note).equals('hello 2');
    });
  });

  describe('route: DELETE `accounting/manual-journals/:id`', () => {
    it('Should response not found in case the manual journal transaction was not found.', async() => {
      const res = await request()
        .delete('/api/accounting/manual-journals/1000')
        .set('x-access-token', loginRes.body.token)
        .send();

      expect(res.status).equals(404);
      expect(res.body.errors).include.something.that.deep.equal({
        type: 'MANUAL.JOURNAL.NOT.FOUND', code: 100,
      });
    });

    it('Should delete manual journal transactions from storage.', async () => {
      const manualJournal = await create('manual_journal');

      const res = await request()
        .delete(`/api/accounting/manual-journals/${manualJournal.id}`)
        .set('x-access-token', loginRes.body.token)
        .send();
      const foundManualTransaction = await ManualJournal.query()
        .where('id', manualJournal.id).first();

      expect(foundManualTransaction).equals(undefined);
    });

    it('Should delete associated transactions of journal transaction.', async () => {
      const manualJournal = await create('manual_journal');
      const transaction1 = await create('account_transaction', {
        reference_type: 'Journal', reference_id: manualJournal.id,
      });
      const transaction2 = await create('account_transaction', {
        reference_type: 'Journal', reference_id: manualJournal.id,
      });

      const res = await request()
        .delete(`/api/accounting/manual-journals/${manualJournal.id}`)
        .set('x-access-token', loginRes.body.token)
        .send();

      const foundTransactions = await AccountTransaction.query();
      expect(foundTransactions.length).equals(0);
    });

    it('Should revert accounts balance after delete account transactions.', () => {

    });
  });

  describe('route: GET `accounting/manual-journals/:id`', () => {
    it('Should response not found in case manual transaction id was not exists.', async () => {
      const res = await request()
        .delete('/api/accounting/manual-journals/100')
        .set('x-access-token', loginRes.body.token)
        .send();

      expect(res.status).equals(404);
      expect(res.body.errors).include.something.that.deep.equals({
        type: 'MANUAL.JOURNAL.NOT.FOUND', code: 100,
      });
    });

    it('Should response manual transaction and transactions metadata.', async () => {

    });

  });

  describe('route: `accounting/manual-journals`', async () => {

    it('Should retrieve all manual journals with pagination meta.', async () => {
      const manualJournal1 = await create('manual_journal');
      const manualJournal2 = await create('manual_journal');

      const res = await request()
        .get('/api/accounting/manual-journals')
        .set('x-access-token', loginRes.body.token)
        .send();

      expect(res.status).equals(200);
      expect(res.body.manualJournals.results).to.be.a('array');
      expect(res.body.manualJournals.results.length).equals(2);
    });
  });

  describe('route: POST `accounting/manual-journals/:id/publish`', () => {

    it('Should response not found in case the manual journal id was not exists.', async () => {
      const manualJournal = await create('manual_journal');

      const res = await request()
        .post('/api/accounting/manual-journals/123/publish')
        .set('x-access-token', loginRes.body.token)
        .send();

      expect(res.status).equals(404);
      expect(res.body.errors).include.something.that.deep.equals({
        type: 'MANUAL.JOURNAL.NOT.FOUND', code: 100,
      });
    });

    it('Should response published ready.', async () => {
      const manualJournal = await create('manual_journal', { status: 0 });
      const res = await request()
        .post(`/api/accounting/manual-journals/${manualJournal.id}/publish`)
        .set('x-access-token', loginRes.body.token)
        .send();

      expect(res.status).equals(400);
      expect(res.body.errors).include.something.that.deep.equals({
        type: 'MANUAL.JOURNAL.PUBLISHED.ALREADY', code: 200,
      });
    });

    it('Should update all accounts transactions to not draft.', async () => {
      const manualJournal = await create('manual_journal');
      const transaction = await create('account_transaction', {
        reference_type: 'Journal',
        reference_id: manualJournal.id,
        draft: 1,
      });
      const transaction2 = await create('account_transaction', {
        reference_type: 'Journal',
        reference_id: manualJournal.id,
        draft: 1,
      });
      const res = await request()
        .post(`/api/accounting/manual-journals/${manualJournal.id}/publish`)
        .set('x-access-token', loginRes.body.token)
        .send();

      const foundTransactions = await AccountTransaction.query()
        .whereIn('id', [transaction.id, transaction2.id]);

      expect(foundTransactions[0].draft).equals(0);
      expect(foundTransactions[1].draft).equals(0);
    });

    it('Should increment/decrement accounts balance.', () => {

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