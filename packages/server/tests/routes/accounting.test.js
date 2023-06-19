import {
  request,
  expect,
} from '~/testInit';
import moment from 'moment';
import ManualJournal from 'models/ManualJournal';
import AccountTransaction from 'models/AccountTransaction';
import AccountBalance from 'models/AccountBalance';
import {
  tenantWebsite,
  tenantFactory,
  loginRes
} from '~/dbInit';


describe('routes: `/accounting`', () => {
  describe('route: `/accounting/make-journal-entries`', async () => {
    it('Should summation of credit or debit does not equal zero.', async () => {
      const account = await tenantFactory.create('account');
      const res = await request()
        .post('/api/accounting/make-journal-entries')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          date: new Date().toISOString(),
          journal_number: '123',
          reference: 'ASC',
          entries: [
            {
              index: 1,
              credit: 0,
              debit: 0,
              account_id: account.id,
            },
            {
              index: 2,
              credit: 0,
              debit: 0,
              account_id: account.id,
            },
          ],
        });
      expect(res.status).equals(400);
      expect(res.body.errors).include.something.that.deep.equal({
        type: 'CREDIT.DEBIT.SUMMATION.SHOULD.NOT.EQUAL.ZERO',
        code: 400,
      });
    });

    it('Should all credit entries equal debit.', async () => {
      const account = await tenantFactory.create('account');
      const res = await request()
        .post('/api/accounting/make-journal-entries')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          date: new Date().toISOString(),
          journal_number: '123',
          entries: [
            {
              index: 1,
              credit: 1000,
              debit: 0,
              account_id: account.id,
            },
            {
              index: 2,
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
      const manualJournal = await tenantFactory.create('manual_journal');
      const account = await tenantFactory.create('account');

      const res = await request()
        .post('/api/accounting/make-journal-entries')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          date: new Date().toISOString(),
          journal_number: manualJournal.journalNumber,
          entries: [
            {
              index: 1,
              credit: 1000,
              debit: 0,
              account_id: account.id,
            },
            {
              index: 2,
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
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          date: new Date().toISOString(),
          journal_number: '123',
          entries: [
            {
              index: 1,
              credit: 1000,
              debit: 0,
              account_id: 12,
            },
            {
              index: 2,
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
      const account1 = await tenantFactory.create('account');
      const account2 = await tenantFactory.create('account');

      const res = await request()
        .post('/api/accounting/make-journal-entries')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          date: new Date().toISOString(),
          journal_number: '1000',
          entries: [
            {
              index: 1,
              credit: null,
              debit: 0,
              account_id: account1.id,
            },
            {
              index: 2,
              credit: null,
              debit: 0,
              account_id: account2.id,
            },
          ],
        });

      expect(res.status).equals(400);
      expect(res.body.errors).include.something.that.deep.equal({
        type: 'CREDIT.DEBIT.SUMMATION.SHOULD.NOT.EQUAL.ZERO',

        code: 400,
      });
    });

    it('Should validate the customers and vendors contact if were not found on the storage.', async () => {
      const account1 = await tenantFactory.create('account');
      const account2 = await tenantFactory.create('account');

      const res = await request()
        .post('/api/accounting/make-journal-entries')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          date: new Date().toISOString(),
          journal_number: '1000',
          entries: [
            {
              index: 1,
              credit: null,
              debit: 1000,
              account_id: account1.id,
              contact_type: 'customer',
              contact_id: 100,
            },
            {
              index: 2,
              credit: 1000,
              debit: 0,
              account_id: account1.id,
              contact_type: 'vendor',
              contact_id: 300,
            },
          ],
        });

      expect(res.body.errors).include.something.deep.equals({
        type: 'CUSTOMERS.CONTACTS.NOT.FOUND', code: 500, ids: [100],
      });
      expect(res.body.errors).include.something.deep.equals({
        type: 'VENDORS.CONTACTS.NOT.FOUND', code: 600, ids: [300],
      })
    });

    it('Should customer contact_type with receivable accounts type.', async () => {
      const account1 = await tenantFactory.create('account');
      const account2 = await tenantFactory.create('account');
      const customer = await tenantFactory.create('customer');

      const res = await request()
        .post('/api/accounting/make-journal-entries')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          date: new Date().toISOString(),
          journal_number: '1000',
          entries: [
            {
              index: 1,
              credit: null,
              debit: 1000,
              account_id: account1.id,
              contact_type: 'customer',
              contact_id: 100,
            },
            {
              index: 2,
              credit: 1000,
              debit: 0,
              account_id: account1.id,
            },
          ],
        });

      expect(res.status).equals(400);
      expect(res.body.errors).include.something.deep.equals({
        type: 'CUSTOMERS.NOT.WITH.RECEIVABLE.ACCOUNT',
        code: 700,
        indexes: [1]
      });
    });

    it('Should account receivable entries has contact_id and contact_type customer.', async () => {
      const res = await request()
        .post('/api/accounting/make-journal-entries')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          date: new Date().toISOString(),
          journal_number: '1000',
          entries: [
            {
              index: 1,
              credit: null,
              debit: 1000,
              account_id: 10,
            },
            {
              index: 2,
              credit: 1000,
              debit: 0,
              account_id: 1,
            },
          ],
        });

      expect(res.status).equals(400);
      expect(res.body.errors).include.something.deep.equals({
        type: 'RECEIVABLE.ENTRIES.HAS.NO.CUSTOMERS', code: 900, indexes: [1],
      });
    });

    it('Should account payable entries has contact_id and contact_type vendor.', async () => {
      const res = await request()
        .post('/api/accounting/make-journal-entries')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          date: new Date().toISOString(),
          journal_number: '1000',
          entries: [
            {
              index: 1,
              credit: null,
              debit: 1000,
              account_id: 10,
            },
            {
              index: 2,
              credit: 1000,
              debit: 0,
              account_id: 11,
            },
          ],
        });

      expect(res.status).equals(400);
      expect(res.body.errors).include.something.deep.equals({
        type: 'PAYABLE.ENTRIES.HAS.NO.VENDORS', code: 1000, indexes: [2]
      });
    });

    it('Should retrieve account_id is not receivable in case contact_type equals customer.', async () => {
      const customer = await tenantFactory.create('customer');

      const res = await request()
        .post('/api/accounting/make-journal-entries')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          date: new Date().toISOString(),
          journal_number: '1000',
          entries: [
            {
              index: 1,
              credit: null,
              debit: 1000,
              account_id: 2,
              contact_id: customer.id,
              contact_type: 'customer',
            },
            {
              index: 2,
              credit: 1000,
              debit: 0,
              account_id: 11,
            },
          ],
        });

      expect(res.status).equals(400);
      expect(res.body.errors).include.something.deep.equals({
        type: 'CUSTOMERS.NOT.WITH.RECEIVABLE.ACCOUNT', code: 700, indexes: [1],
      });
    });

    it('Should store manual journal transaction to the storage.', async () => {
      const account1 = await tenantFactory.create('account');
      const account2 = await tenantFactory.create('account');

      const res = await request()
        .post('/api/accounting/make-journal-entries')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          date: new Date('2020-2-2').toISOString(),
          journal_number: '1000',
          reference: '2000',
          description: 'Description here.',
          entries: [
            {
              index: 1,
              credit: 1000,
              account_id: account1.id,
            },
            {
              index: 2,
              debit: 1000,
              account_id: account2.id,
            },
          ],
        });

      const foundManualJournal = await ManualJournal.tenant().query();
      expect(foundManualJournal.length).equals(1);
      
      expect(foundManualJournal[0].reference).equals('2000');
      expect(foundManualJournal[0].journalNumber).equals('1000');
      expect(foundManualJournal[0].transactionType).equals('Journal');
      expect(foundManualJournal[0].amount).equals(1000);
      expect(moment(foundManualJournal[0].date).format('YYYY-MM-DD')).equals('2020-02-02');
      expect(foundManualJournal[0].description).equals('Description here.');
      expect(foundManualJournal[0].userId).to.be.a('number');
    });

    it('Should store journal transactions to the storage.', async () => {
      const account1 = await tenantFactory.create('account');
      const account2 = await tenantFactory.create('account');

      const res = await request()
        .post('/api/accounting/make-journal-entries')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          journal_number: '1',
          date: new Date('2020-1-1').toISOString(),
          reference: '1000',
          memo: 'Description here.',
          entries: [
            {
              index: 1,
              credit: 1000,
              account_id: account1.id,
              note: 'First note',
            },
            {
              index: 2,
              debit: 1000,
              account_id: account2.id,
              note: 'Second note',
            },
          ],
        });

      const foundAccountsTransactions = await AccountTransaction.tenant().query();

      expect(foundAccountsTransactions.length).equals(2);

      expect(foundAccountsTransactions[0].credit).equals(1000);
      expect(foundAccountsTransactions[0].debit).equals(null);
      expect(foundAccountsTransactions[0].accountId).equals(account1.id);
      expect(foundAccountsTransactions[0].note).equals('First note');
      expect(foundAccountsTransactions[0].referenceType).equals('Journal');
      expect(foundAccountsTransactions[0].userId).equals(1);

      expect(foundAccountsTransactions[1].credit).equals(null);
      expect(foundAccountsTransactions[1].debit).equals(1000);
      expect(foundAccountsTransactions[1].accountId).equals(account2.id);
      expect(foundAccountsTransactions[1].note).equals('Second note');
      expect(foundAccountsTransactions[1].referenceType).equals('Journal');
      expect(foundAccountsTransactions[1].userId).equals(1);
    });
  });

  describe('route: POST: `/accounting/manual-journal/:id`', () => {
    it('Should response not found in case manual journal transaction was not exists.', async () => {
      const res = await request()
        .post('/api/manual-journal/1000')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(404);
    });

    it('Should summation of credit or debit be equal zero.', async () => {
      const manualJournal = await tenantFactory.create('manual_journal');

      const res = await request()
        .post(`/api/accounting/manual-journals/${manualJournal.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
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
        type: 'CREDIT.DEBIT.SUMMATION.SHOULD.NOT.EQUAL.ZERO',
        code: 400,
      });
    });

    it('Should all credit and debit summation be equal.', async () => {
      const manualJournal = await tenantFactory.create('manual_journal');

      const res = await request()
        .post(`/api/accounting/manual-journals/${manualJournal.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
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
      const manualJournal = await tenantFactory.create('manual_journal');
      const manualJournal2 = await tenantFactory.create('manual_journal');

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
        .post(`/api/accounting/manual-journals/${manualJournal.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
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
      const manualJournal = await tenantFactory.create('manual_journal');
      const manualJournal2 = await tenantFactory.create('manual_journal');

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
        .post(`/api/accounting/manual-journals/${manualJournal.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
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
      const manualJournal = await tenantFactory.create('manual_journal');
      const manualJournal2 = await tenantFactory.create('manual_journal');

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
        .post(`/api/accounting/manual-journals/${manualJournal.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
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
      const manualJournal = await tenantFactory.create('manual_journal');
      const account1 = await tenantFactory.create('account');
      const account2 = await tenantFactory.create('account');

      const res = await request()
        .post(`/api/accounting/manual-journals/${manualJournal.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
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
      
      const foundManualJournal = await ManualJournal.tenant().query()
        .where('id', manualJournal.id);

      expect(foundManualJournal.length).equals(1);
      expect(foundManualJournal[0].journalNumber).equals('123');
      expect(foundManualJournal[0].reference).equals('ABC');
      expect(foundManualJournal[0].description).equals('hello world');
    });

    it('Should update account transactions that associated to the manual journal transaction.', async () => {
      const manualJournal = await tenantFactory.create('manual_journal');
      const account1 = await tenantFactory.create('account');
      const account2 = await tenantFactory.create('account');
      const transaction = await tenantFactory.create('account_transaction', {
        reference_type: 'Journal',
        reference_id: manualJournal.id,
      });
      const transaction2 = await tenantFactory.create('account_transaction', {
        reference_type: 'Journal',
        reference_id: manualJournal.id,
      });

      const res = await request()
        .post(`/api/accounting/manual-journals/${manualJournal.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
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

      const foundTransactions = await AccountTransaction.tenant().query();
    
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
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(404);
      expect(res.body.errors).include.something.that.deep.equal({
        type: 'MANUAL.JOURNAL.NOT.FOUND', code: 100,
      });
    });

    it('Should delete manual journal transactions from storage.', async () => {
      const manualJournal = await tenantFactory.create('manual_journal');

      const res = await request()
        .delete(`/api/accounting/manual-journals/${manualJournal.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      const foundManualTransaction = await ManualJournal.tenant().query()
        .where('id', manualJournal.id).first();

      expect(foundManualTransaction).equals(undefined);
    });

    it('Should delete associated transactions of journal transaction.', async () => {
      const manualJournal = await tenantFactory.create('manual_journal');
      const transaction1 = await tenantFactory.create('account_transaction', {
        reference_type: 'Journal', reference_id: manualJournal.id,
      });
      const transaction2 = await tenantFactory.create('account_transaction', {
        reference_type: 'Journal', reference_id: manualJournal.id,
      });

      const res = await request()
        .delete(`/api/accounting/manual-journals/${manualJournal.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      const foundTransactions = await AccountTransaction.tenant().query();
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
        .set('organization-id', tenantWebsite.organizationId)
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
      const manualJournal1 = await tenantFactory.create('manual_journal');
      const manualJournal2 = await tenantFactory.create('manual_journal');

      const res = await request()
        .get('/api/accounting/manual-journals')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(200);
      expect(res.body.manualJournals.results).to.be.a('array');
      expect(res.body.manualJournals.results.length).equals(2);
    });
  });

  describe('route: POST `accounting/manual-journals/:id/publish`', () => {

    it('Should response not found in case the manual journal id was not exists.', async () => {
      const manualJournal = await tenantFactory.create('manual_journal');

      const res = await request()
        .post('/api/accounting/manual-journals/123/publish')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(404);
      expect(res.body.errors).include.something.that.deep.equals({
        type: 'MANUAL.JOURNAL.NOT.FOUND', code: 100,
      });
    });

    it('Should response published ready.', async () => {
      const manualJournal = await tenantFactory.create('manual_journal', { status: 1 });
      
      const res = await request()
        .post(`/api/accounting/manual-journals/${manualJournal.id}/publish`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(400);
      expect(res.body.errors).include.something.that.deep.equals({
        type: 'MANUAL.JOURNAL.PUBLISHED.ALREADY', code: 200,
      });
    });

    it('Should update all accounts transactions to not draft.', async () => {
      const manualJournal = await tenantFactory.create('manual_journal', { status: 0 });
      const transaction = await tenantFactory.create('account_transaction', {
        reference_type: 'Journal',
        reference_id: manualJournal.id,
        draft: 1,
      });
      const transaction2 = await tenantFactory.create('account_transaction', {
        reference_type: 'Journal',
        reference_id: manualJournal.id,
        draft: 1,
      });
      const res = await request()
        .post(`/api/accounting/manual-journals/${manualJournal.id}/publish`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      const foundTransactions = await AccountTransaction.tenant().query()
        .whereIn('id', [transaction.id, transaction2.id]);

      expect(foundTransactions[0].draft).equals(0);
      expect(foundTransactions[1].draft).equals(0);
    });

    it('Should increment/decrement accounts balance.', () => {

    });
  });

  describe('route: `/accounting/quick-journal-entries`', async () => {
    it('Should `credit_account_id` be required', () => {

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