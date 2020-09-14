import moment from 'moment';
import { pick } from 'lodash';
import {
  request,
  expect,
} from '~/testInit';
import Expense from 'models/Expense';
import ExpenseCategory from 'models/ExpenseCategory';
import AccountTransaction from 'models/AccountTransaction';
import {
  tenantWebsite,
  tenantFactory,
  loginRes,
} from '~/dbInit';

describe('routes: /expenses/', () => {
  describe('POST `/expenses`', () => {
    it('Should retrieve unauthorized access if the user was not authorized.', async () => {
      const res = await request()
        .post('/api/expenses')
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(401);
      expect(res.body.message).equals('Unauthorized');
    });

    it('Should categories total not be equals zero.', async () => {
      const res = await request()
        .post('/api/expenses')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          payment_date: moment().format('YYYY-MM-DD'),
          reference_no: '',
          payment_account_id: 0,
          description: '',
          publish: 1,
          categories: [
            {
              index: 1,
              expense_account_id: 33,
              amount: 1000,
              description: '',
            }
          ],
        });

      expect(res.status).equals(400);
      expect(res.body.errors).include.something.deep.equals({
        type: 'EXPENSE.ACCOUNTS.IDS.NOT.STORED', code: 400, ids: [33]
      });
    });

    it('Should expense accounts ids be stored in the storage.', async () => {
      const res = await request() 
        .post('/api/expenses')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          payment_date: moment().format('YYYY-MM-DD'),
          reference_no: '',
          payment_account_id: 0,
          description: '',
          publish: 1,
          categories: [
            {
              index: 1,
              expense_account_id: 22,
              amount: 1000,
              description: '',
            },
          ],
        });

      expect(res.status).equals(400);
      expect(res.body.errors).include.something.deep.equals({
        type: 'EXPENSE.ACCOUNTS.IDS.NOT.STORED', code: 400, ids: [22],
      });
    });

    it('Should `payment_account_id` be in the storage.', async () => {
      const res = await request() 
        .post('/api/expenses')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          payment_date: moment().format('YYYY-MM-DD'),
          reference_no: '',
          payment_account_id: 22,
          description: '',
          publish: 1,
          categories: [
            {
              index: 1,
              expense_account_id: 22,
              amount: 1000,
              description: '',
            },
          ],
        });

      expect(res.status).equals(400);
      expect(res.body.errors).include.something.deep.equals({
        type: 'PAYMENT.ACCOUNT.NOT.FOUND', code: 500,
      });
    });

    it('Should payment_account be required.', async () => {
      const res = await request() 
        .post('/api/expenses')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(422);
    });

    it('Should `categories.*.expense_account_id` be required.', async () => {
      const res = await request()
        .post('/api/expenses')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({

        });
      expect(res.body.errors).include.something.deep.equals({
        msg: 'Invalid value', param: 'payment_account_id', location: 'body'
      });
    });

    it('Should expense transactions be stored on the storage.', async () => { 
      const paymentAccount = await tenantFactory.create('account');
      const expenseAccount = await tenantFactory.create('account');

      const res = await request()
        .post('/api/expenses')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          payment_date: moment().format('YYYY-MM-DD'),
          reference_no: 'ABC',
          payment_account_id: paymentAccount.id,
          description: 'desc',
          publish: 1,
          categories: [
            {
              index: 1,
              expense_account_id: expenseAccount.id,
              amount: 1000,
              description: '',
            },
          ],          
        });      

      const foundExpense = await Expense.tenant().query().where('id', res.body.id);
    
      expect(foundExpense.length).equals(1);
      expect(foundExpense[0].referenceNo).equals('ABC');
      expect(foundExpense[0].paymentAccountId).equals(paymentAccount.id);
      expect(foundExpense[0].description).equals('desc');
      expect(foundExpense[0].totalAmount).equals(1000);
    });

    it('Should expense categories transactions be stored on the storage.', async () => {
      const paymentAccount = await tenantFactory.create('account');
      const expenseAccount = await tenantFactory.create('account');

      const res = await request()
        .post('/api/expenses')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          payment_date: moment().format('YYYY-MM-DD'),
          reference_no: 'ABC',
          payment_account_id: paymentAccount.id,
          description: 'desc',
          publish: 1,
          categories: [
            {
              index: 1,
              expense_account_id: expenseAccount.id,
              amount: 1000,
              description: 'category desc',
            },
          ],          
        });

      const foundCategories = await ExpenseCategory.tenant().query().where('id', res.body.id);

      expect(foundCategories.length).equals(1);
      expect(foundCategories[0].index).equals(1);
      expect(foundCategories[0].expenseAccountId).equals(expenseAccount.id);
      expect(foundCategories[0].amount).equals(1000);
      expect(foundCategories[0].description).equals('category desc');
    });

    it('Should save journal entries that associate to the expense transaction.', async () => {
      const paymentAccount = await tenantFactory.create('account');
      const expenseAccount = await tenantFactory.create('account');

      const res = await request()
        .post('/api/expenses')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          payment_date: moment().format('YYYY-MM-DD'),
          reference_no: 'ABC',
          payment_account_id: paymentAccount.id,
          description: 'desc',
          publish: 1,
          categories: [
            {
              index: 1,
              expense_account_id: expenseAccount.id,
              amount: 1000,
              description: 'category desc',
            },
          ],          
        });

      const transactions = await AccountTransaction.tenant().query()
        .where('reference_id', res.body.id)
        .where('reference_type', 'Expense');

      const mappedTransactions = transactions.map(tr => ({
        ...pick(tr, ['credit', 'debit', 'referenceId', 'referenceType']),
      }));

      expect(mappedTransactions[0]).deep.equals({
        credit: 1000,
        debit: 0,
        referenceType: 'Expense',
        referenceId: res.body.id,
      });
      expect(mappedTransactions[1]).deep.equals({
        credit: 0,
        debit: 1000,
        referenceType: 'Expense',
        referenceId: res.body.id,
      });
      expect(transactions.length).equals(2);
    })
  });

  describe('GET: `/expenses`', () => {
    it('Should response unauthorized if the user was not logged in.', async () => {
      const res = await request()
        .post('/api/expenses')
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(401);
      expect(res.body.message).equals('Unauthorized');
    });

    it('Should retrieve expenses with pagination meta.', async () => {
      await tenantFactory.create('expense');
      await tenantFactory.create('expense');

      const res = await request()
        .get('/api/expenses')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();
      
      expect(res.body.expenses).that.is.an('object');
      expect(res.body.expenses.results).that.is.an('array');
    });

    it('Should retrieve expenses based on view roles conditions of the custom view.', () => {

    });

    it('Should sort expenses based on the given `column_sort_order` column on ASC direction.', () => {

    });
  });

  describe('DELETE: `/expenses/:id`', () => {
    it('Should response unauthorized if the user was not logged in.', async () => {
      const res = await request()
        .delete('/api/expenses')
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(401);
      expect(res.body.message).equals('Unauthorized');
    });

    it('Should response not found in case expense id was not exists on the storage.', async () => {
      const res = await request()
        .delete('/api/expenses/123321')
        .set('organization-id', tenantWebsite.organizationId)
        .set('x-access-token', loginRes.body.token)
        .send();

      expect(res.status).equals(404);
      expect(res.body.errors).include.something.deep.equals({
        type: 'EXPENSE.NOT.FOUND', code: 200,
      });
    });

    it('Should delete the given expense transactions with associated categories.', async () => {
      const expense = await tenantFactory.create('expense');

      const res = await request()
        .delete(`/api/expenses/${expense.id}`)
        .set('organization-id', tenantWebsite.organizationId)
        .set('x-access-token', loginRes.body.token)
        .send();

      expect(res.status).equals(200);

      const storedExpense = await Expense.tenant().query().where('id', expense.id);
      const storedExpenseCategories = await ExpenseCategory.tenant().query().where('expense_id', expense.id);

      expect(storedExpense.length).equals(0);
      expect(storedExpenseCategories.length).equals(0);
    });

    it('Should delete all journal entries that associated to the given expense.', async () => {
      const expense = await tenantFactory.create('expense');

      const trans = { reference_id: expense.id, reference_type: 'Expense' };
      await tenantFactory.create('account_transaction', trans);
      await tenantFactory.create('account_transaction', trans);

      const res = await request()
        .delete(`/api/expenses/${expense.id}`)
        .set('organization-id', tenantWebsite.organizationId)
        .set('x-access-token', loginRes.body.token)
        .send();

      const foundTransactions = await AccountTransaction.tenant().query()
        .where('reference_type', 'Expense')
        .where('reference_id', expense.id);

      expect(foundTransactions.length).equals(0);
    });
  });

  describe('GET: `/expenses/:id`', () => {
    it('Should response unauthorized if the user was not logged in.', async () => {
      const res = await request()
        .get('/api/expenses/123')
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(401);
      expect(res.body.message).equals('Unauthorized');
    });

    it('Should response not found in case the given expense id was not exists in the storage.', async () => {
      const res = await request()
        .get(`/api/expenses/321`)
        .set('organization-id', tenantWebsite.organizationId)
        .set('x-access-token', loginRes.body.token)
        .send();

      expect(res.status).equals(404);
    });

    it('Should retrieve expense metadata and associated expense categories.', async () => {
      const expense = await tenantFactory.create('expense');
      const expenseCategory = await tenantFactory.create('expense_category', {
        expense_id: expense.id,
      })
      const res = await request()
        .get(`/api/expenses/${expense.id}`)
        .set('organization-id', tenantWebsite.organizationId)
        .set('x-access-token', loginRes.body.token)
        .send();

      expect(res.status).equals(200);
    
      expect(res.body.expense.id).is.a('number');
      expect(res.body.expense.paymentAccountId).is.a('number');
      expect(res.body.expense.totalAmount).is.a('number');
      expect(res.body.expense.userId).is.a('number');
      expect(res.body.expense.referenceNo).is.a('string');
      expect(res.body.expense.description).is.a('string');
      expect(res.body.expense.categories).is.a('array');

      expect(res.body.expense.categories[0].id).is.a('number');
      expect(res.body.expense.categories[0].description).is.a('string');
      expect(res.body.expense.categories[0].expenseAccountId).is.a('number');
    });

    it('Should retrieve journal entries with expense metadata.', async () => {
      const expense = await tenantFactory.create('expense');
      const expenseCategory = await tenantFactory.create('expense_category', {
        expense_id: expense.id,
      });
      const trans = { reference_id: expense.id, reference_type: 'Expense' };
      await tenantFactory.create('account_transaction', trans);
      await tenantFactory.create('account_transaction', trans);

      const res = await request()
        .get(`/api/expenses/${expense.id}`)
        .set('organization-id', tenantWebsite.organizationId)
        .set('x-access-token', loginRes.body.token)
        .send();

      expect(res.body.expense.journalEntries).is.an('array');
      expect(res.body.expense.journalEntries.length).equals(2);
    });
  });

  describe('POST: `expenses/:id`', () => {
    it('Should response unauthorized in case the user was not logged in.', async () => {
      const expense = await tenantFactory.create('expense');
      const res = await request()
        .post(`/api/expenses/${expense.id}`)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(401);
      expect(res.body.message).equals('Unauthorized');
    });

    it('Should response the given expense id not exists on the storage.', async () => {
      const expenseAccount = await tenantFactory.create('account');

      const res = await request()
        .post('/api/expenses/1233')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          reference_no: '123',
          payment_date: moment().format('YYYY-MM-DD'),
          payment_account_id: 321,
          publish: true,
          categories: [
            {
              expense_account_id: expenseAccount.id,
              index: 1,
              amount: 1000,
              description: '',
            },
          ],
        });
      expect(res.status).equals(404);
      expect(res.body.errors).include.something.deep.equals({
        type: 'EXPENSE.NOT.FOUND', code: 200,
      });
    });

    it('Should response the given `payment_account_id` not exists.', async () => {
      const expense = await tenantFactory.create('expense');
      const expenseAccount = await tenantFactory.create('account');

      const res = await request()
      .post(`/api/expenses/${expense.id}`)
      .set('x-access-token', loginRes.body.token)
      .set('organization-id', tenantWebsite.organizationId)
      .send({
        reference_no: '123',
        payment_date: moment().format('YYYY-MM-DD'),
        payment_account_id: 321,
        publish: true,
        categories: [
          {
            expense_account_id: expenseAccount.id,
            index: 1,
            amount: 1000,
            description: '',
          },
        ],
      });
      
      expect(res.status).equals(400);
      expect(res.body.errors).include.something.deep.equals({
        type: 'PAYMENT.ACCOUNT.NOT.FOUND', code: 400,
      });
    });
    
    it('Should response the given `categories.*.expense_account_id` not exists.', async () => {
      const paymentAccount = await tenantFactory.create('account');
      const expense = await tenantFactory.create('expense');

      const res = await request()
        .post(`/api/expenses/${expense.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          reference_no: '123',
          payment_date: moment().format('YYYY-MM-DD'),
          payment_account_id: paymentAccount.id,
          publish: true,
          categories: [
            {
              index: 1,
              expense_account_id: 100,
              amount: 1000,
              description: '',
            },
          ],
        });

      expect(res.status).equals(400);
      expect(res.body.errors).include.something.deep.equals({
        type: 'EXPENSE.ACCOUNTS.IDS.NOT.FOUND', code: 600, ids: [100],
      });
    });

    it('Should response the total amount equals zero.', async () => {
      const expense = await tenantFactory.create('expense');
      const expenseAccount = await tenantFactory.create('account');
      const paymentAccount = await tenantFactory.create('account');

      const res = await request()
        .post(`/api/expenses/${expense.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          reference_no: '123',
          payment_date: moment().format('YYYY-MM-DD'),
          payment_account_id: paymentAccount.id,
          publish: true,
          categories: [
            {
              index: 1,
              expense_account_id: expenseAccount.id,
              amount: 0,
              description: '',
            },
          ],
        });

      expect(res.status).equals(400);
      expect(res.body.errors).include.something.deep.equals({
        type: 'TOTAL.AMOUNT.EQUALS.ZERO', code: 500,
      });
    });

    it('Should update the expense transaction.', async () => {
      const expense = await tenantFactory.create('expense');
      const paymentAccount = await tenantFactory.create('account');
      const expenseAccount = await tenantFactory.create('account');

      const res = await request()
        .post(`/api/expenses/${expense.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          reference_no: '123',
          payment_date: moment('2009-01-02').format('YYYY-MM-DD'),
          payment_account_id: paymentAccount.id,
          publish: true,
          description: 'Updated description',
          categories: [
            {
              index: 1,
              expense_account_id: expenseAccount.id,
              amount: 3000,
              description: '',
            },
          ],
        });
      expect(res.status).equals(200);
      
      const updatedExpense = await Expense.tenant().query()
        .where('id', expense.id).first();

      expect(updatedExpense.id).equals(expense.id);
      expect(updatedExpense.referenceNo).equals('123');
      expect(updatedExpense.description).equals('Updated description');
      expect(updatedExpense.totalAmount).equals(3000);
      expect(updatedExpense.paymentAccountId).equals(paymentAccount.id);
    });

    it('Should delete the expense categories that associated to the expense transaction.', async () => {
      const expense = await tenantFactory.create('expense');
      const expenseCategory = await tenantFactory.create('expense_category', {
        expense_id: expense.id,
      });
      const paymentAccount = await tenantFactory.create('account');
      const expenseAccount = await tenantFactory.create('account');

      const res = await request()
        .post(`/api/expenses/${expense.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          reference_no: '123',
          payment_date: moment('2009-01-02').format('YYYY-MM-DD'),
          payment_account_id: paymentAccount.id,
          publish: true,
          description: 'Updated description',
          categories: [
            {
              index: 1,
              expense_account_id: expenseAccount.id,
              amount: 3000,
              description: '',
            },
          ],
        });

      const foundExpenseCategories = await ExpenseCategory.tenant()
        .query().where('id', expenseCategory.id)
    
      expect(foundExpenseCategories.length).equals(0);
    });

    it('Should insert the expense categories to associated to the expense transaction.', async () => {
      const expense = await tenantFactory.create('expense');
      const expenseCategory = await tenantFactory.create('expense_category', {
        expense_id: expense.id,
      });
      const paymentAccount = await tenantFactory.create('account');
      const expenseAccount = await tenantFactory.create('account');

      const res = await request()
        .post(`/api/expenses/${expense.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          reference_no: '123',
          payment_date: moment('2009-01-02').format('YYYY-MM-DD'),
          payment_account_id: paymentAccount.id,
          publish: true,
          description: 'Updated description',
          categories: [
            {
              index: 1,
              expense_account_id: expenseAccount.id,
              amount: 3000,
              description: '__desc__',
            },
          ],
        });

      const foundExpenseCategories = await ExpenseCategory.tenant()
        .query()
        .where('expense_id', expense.id)

      expect(foundExpenseCategories.length).equals(1);
      expect(foundExpenseCategories[0].id).not.equals(expenseCategory.id);
    });

    it('Should update the expense categories that associated to the expense transactions.', async () => {
      const expense = await tenantFactory.create('expense');
      const expenseCategory = await tenantFactory.create('expense_category', {
        expense_id: expense.id,
      });
      const paymentAccount = await tenantFactory.create('account');
      const expenseAccount = await tenantFactory.create('account');

      const res = await request()
        .post(`/api/expenses/${expense.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          reference_no: '123',
          payment_date: moment('2009-01-02').format('YYYY-MM-DD'),
          payment_account_id: paymentAccount.id,
          publish: true,
          description: 'Updated description',
          categories: [
            {
              id: expenseCategory.id,
              index: 1,
              expense_account_id: expenseAccount.id,
              amount: 3000,
              description: '__desc__',
            },
          ],
        });
      
      const foundExpenseCategory = await ExpenseCategory.tenant().query()
        .where('id', expenseCategory.id);

      expect(foundExpenseCategory.length).equals(1);
      expect(foundExpenseCategory[0].expenseAccountId).equals(expenseAccount.id);
      expect(foundExpenseCategory[0].description).equals('__desc__');
      expect(foundExpenseCategory[0].amount).equals(3000);
    });
  });

  describe('DELETE: `/api/expenses`', () => {
    it('Should response not found expenses ids.', async () => {
      const res = await request()
        .delete('/api/expenses')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .query({
          ids: [100, 200],
        })
        .send({});

      expect(res.status).equals(404);
      expect(res.body.errors).include.something.deep.equals({
        type: 'EXPENSES.NOT.FOUND', code: 200,
      });
    });

    it('Should delete the given expenses ids.', async () => {
      const expense1 = await tenantFactory.create('expense');
      const expense2 = await tenantFactory.create('expense');
    
      const res = await request()
        .delete('/api/expenses')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .query({
          ids: [expense1.id, expense2.id],
        })
        .send({});
        
      const foundExpenses = await Expense.tenant().query()
        .whereIn('id', [expense1.id, expense2.id]);
        
      expect(res.status).equals(200);
      expect(foundExpenses.length).equals(0);
    })
  });

  describe('POST: `/api/expenses/:id/publish`', () => {
    it('Should publish the given expense.', async () => {
      const expense = await tenantFactory.create('expense', {
        published: 0,
      });

      const res = await request()
        .post(`/api/expenses/${expense.id}/publish`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      const foundExpense = await Expense.tenant().query()
        .where('id', expense.id).first();

      expect(res.status).equals(200);
      expect(foundExpense.published).equals(1);
    });
  });
});
