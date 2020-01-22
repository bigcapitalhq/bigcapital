import { request, expect, create, login } from '~/testInit';
import AccountTransaction from '@/models/AccountTransaction';
import Expense from '@/models/Expense';

let loginRes;
let expenseType;
let cashType;
let expenseAccount;
let cashAccount;

describe('routes: /expenses/', () => {
  beforeEach(async () => {
    loginRes = await login();

    expenseType = await create('account_type', { normal: 'debit' });
    cashType = await create('account_type', { normal: 'debit' });

    expenseAccount = await create('account', { account_type_id: expenseType.id });
    cashAccount = await create('account', { account_type_id: cashType.id });
  });
  afterEach(() => {
    loginRes = null;
  });

  describe('POST: `/expenses`', () => {
    it('Should response unauthorized in case user was not authorized.', async () => {
      const res = await request().post('/api/expenses').send();

      expect(res.status).equals(401);
      expect(res.body.message).equals('unauthorized');
    });

    it('Should `payment_account_id` be required.', async () => {
      const res = await request().post('/api/expenses')
        .set('x-access-token', loginRes.body.token)
        .send();

      expect(res.body.errors).include.something.that.deep.equals({
        msg: 'Invalid value',
        param: 'payment_account_id',
        location: 'body',
      });
    });

    it('Should `expense_account_id` be required.', async () => {
      const res = await request().post('/api/expenses')
        .set('x-access-token', loginRes.body.token)
        .send();

      expect(res.body.errors).include.something.that.deep.equals({
        msg: 'Invalid value',
        param: 'expense_account_id',
        location: 'body',
      });
    });

    it('Should `amount` be required.', async () => {
      const res = await request().post('/api/expenses')
        .set('x-access-token', loginRes.body.token)
        .send();

      expect(res.body.errors).include.something.that.deep.equals({
        msg: 'Invalid value',
        param: 'amount',
        location: 'body',
      });
    });

    it('Should `exchange_rate` be required in case `currency_code` not equal default one.', () => {

    });

    it('Should response bad request in case expense account was not found.', async () => {
      const res = await request().post('/api/expenses')
        .set('x-access-token', loginRes.body.token)
        .send({
          expense_account_id: 100,
          payment_account_id: 100,
          amount: 100,
        });
      
      expect(res.body.errors).include.something.that.deep.equals({
        type: 'EXPENSE.ACCOUNT.NOT.FOUND', code: 200,
      });
    });

    it('Should response bad request in case payment account was not found.', async () => {
      const res = await request().post('/api/expenses')
        .set('x-access-token', loginRes.body.token)
        .send({
          expense_account_id: 100,
          payment_account_id: 100,
          amount: 100,
        });
  
      expect(res.body.errors).include.something.that.deep.equals({
        type: 'PAYMENT.ACCOUNT.NOT.FOUND', code: 100,
      });
    });

    it('Should response success with valid required data.', async () => {
      const res = await request().post('/api/expenses') 
        .set('x-access-token', loginRes.body.token)
        .send({
          expense_account_id: expenseAccount.id,
          payment_account_id: cashAccount.id,
          amount: 100,
        });

      expect(res.status).equals(200);
    });

    it('Should record journal entries of expense transaction.', async () => {
      const res = await request().post('/api/expenses') 
        .set('x-access-token', loginRes.body.token)
        .send({
          expense_account_id: expenseAccount.id,
          payment_account_id: cashAccount.id,
          amount: 100,
        });

      const expensesEntries = await AccountTransaction.query()
        .where('reference_type', 'Expense')
        .where('reference_id', res.body.id);
      
      expect(expensesEntries.length).equals(2);
    });

    it('Should save expense transaction to the storage.', () => {
      
    });
  });

  describe('POST: `/expenses/:id`', () => {
    it('Should response unauthorized in case user was not authorized.', () => {

    });
  });

  describe('DELETE: `/expenses/:id`', () => {
    it('Should response not found in case expense not found.', async () => {
      const res = await request()
        .delete('/api/expense/1000')
        .set('x-access-token', loginRes.body.token)
        .send();

      expect(res.body.reasons).include.something.that.deep.equals({
        type: 'EXPENSE.NOT.FOUND', code: 100,
      });
    });

    it('Should response success in case expense transaction was exist.', async () => {
      const expense = await create('expense');
      const res = await request()
        .delete(`/api/expense/${expense.id}`)
        .set('x-access-token', loginRes.body.token)
        .send();

      expect(res.status).equals(200);
    });

    it('Should delete the expense transaction from the storage.', async () => {
      const expense = await create('expense');
      await request()
        .delete(`/api/expense/${expense.id}`)
        .set('x-access-token', loginRes.body.token)
        .send();

      const storedExpense = await Expense.query().findById(expense.id);
      expect(storedExpense).equals(undefined);
    });

    it('Should delete the journal entries that associated to expense transaction from the storage.', async () => { 
      const expense = await create('expense');
      await request()
        .delete(`/api/expense/${expense.id}`)
        .set('x-access-token', loginRes.body.token)
        .send();

      const expenseEntries = await AccountTransaction.query()
        .where('reference_type', 'Expense')
        .where('reference_id', expense.id);

      expect(expenseEntries.length).equals(0);
    });

    it('Should reverse accounts balance that associated to expense transaction.', () => { 

    });
  });

  describe('POST: `/expenses/bulk`', () => {
    it('Should response unauthorized in case user was not authorized.', async () => {
      const res = await request().post('/api/expenses/bluk').send();

      expect(res.status).equals(401);
      expect(res.body.message).equals('unauthorized');
    });

    it('Should response bad request in case expenses was not array.', async () => {
      const res = await request()
        .post('/api/expenses/bulk')
        .set('x-access-token', loginRes.body.token)
        .send({
          expenses: 'Not array :(',
        });

      expect(res.body.errors).include.something.that.deep.equals({
        value: 'Not array :(',
        msg: 'Invalid value',
        param: 'expenses',
        location: 'body',
      });
    });

    it('Should response bad request in case one expense account was not found.', async () => {
      const res = await request()
        .post('/api/expenses/bulk')
        .set('x-access-token', loginRes.body.token)
        .send({
          expenses: [
            {
              payment_account_id: 100,
              expense_account_id: 100,
              amount: 1000,
            },
          ],
        });
      expect(res.body.reasons).include.something.that.deep.equals({
        type: 'EXPENSE.ACCOUNTS.NOT.FOUND', code: 200, accounts: [100],
      });
    });

    it('Should response bad request in case one of payment account was not found.', async () => {
      const res = await request()
        .post('/api/expenses/bulk')
        .set('x-access-token', loginRes.body.token)
        .send({
          expenses: [
            {
              payment_account_id: 100,
              expense_account_id: 100,
              amount: 1000,
            },
          ],
        });
      expect(res.body.reasons).include.something.that.deep.equals({
        type: 'PAYMENY.ACCOUNTS.NOT.FOUND', code: 100, accounts: [100],
      });
    });

    it('Should store expenses transactions to the storage.', async () => {
      const res = await request()
        .post('/api/expenses/bulk')
        .set('x-access-token', loginRes.body.token)
        .send({
          expenses: [
            {
              payment_account_id: cashAccount.id,
              expense_account_id: expenseAccount.id,
              amount: 1000,
            },
            {
              payment_account_id: cashAccount.id,
              expense_account_id: expenseAccount.id,
              amount: 1000,
            },
          ],
        });

      const expenseTransactions = await Expense.query();
      expect(expenseTransactions.length).equals(2);
    });

    it('Should store journal entries of expenses transactions to the storage.', async () => {
      const res = await request()
        .post('/api/expenses/bulk')
        .set('x-access-token', loginRes.body.token)
        .send({
          expenses: [
            {
              payment_account_id: cashAccount.id,
              expense_account_id: expenseAccount.id,
              amount: 1000,
            },
            {
              payment_account_id: cashAccount.id,
              expense_account_id: expenseAccount.id,
              amount: 1000,
            },
          ],
        });

      const expenseJournalEntries = await AccountTransaction.query();
      expect(expenseJournalEntries.length).equals(4);
    });
  });

  describe('GET: `/expenses/:id`', () => {
    it('Should response view not found in case the custom view id was not exist.', async () => {
      const res = await request()
        .get('/api/expenses')
        .set('x-access-token', loginRes.body.token)
        .send();

      console.log(res.status);
    });
  });
});