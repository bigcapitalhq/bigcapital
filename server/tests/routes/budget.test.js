import {
  request,
  expect,
  create,
  login,
} from '~/testInit';
import Budget from '@/models/Budget';
import BudgetEntry from '@/models/BudgetEntry';

let loginRes;

describe('routes: `/budget`', () => {
  beforeEach(async () => {
    loginRes = await login();
  });
  afterEach(() => {
    loginRes = null;
  });
  describe('POST: `/budget', () => {
    it('Should `name` be required.', async () => {
      const res = await request()
        .post('/api/budget')
        .set('x-access-token', loginRes.body.token).send();

      expect(res.status).equals(422);
      expect(res.body.errors).include.something.that.deep.equal({
        msg: 'Invalid value', param: 'name', location: 'body',
      });
    });

    it('Should `period` be required.', async () => {
      const res = await request()
        .post('/api/budget')
        .set('x-access-token', loginRes.body.token).send();

      expect(res.status).equals(422);
      expect(res.body.errors).include.something.that.deep.equal({
        msg: 'Invalid value', param: 'period', location: 'body',
      });
    });

    it('Should `fiscal_year` be required.', async () => {
      const res = await request()
        .post('/api/budget')
        .set('x-access-token', loginRes.body.token)
        .send();

      expect(res.status).equals(422);
      expect(res.body.errors).include.something.that.deep.equal({
        msg: 'Invalid value', param: 'fiscal_year', location: 'body',
      });
    });

    it('Should `entries` alteast one item', () => {
      
    });

    it('Should account id be exist in the storage.', async () => {
      const res = await request()
        .post('/api/budget')
        .set('x-access-token', loginRes.body.token)
        .send({
          name: 'Budget Name',
          fiscal_year: '2020',
          period: 'year',
          accounts_type: 'profit_loss',
          accounts: [
            {
              account_id: 100,
              entries: [
                {
                  amount: 1000,
                  order: 1,
                },
              ],
            },
          ],
        });

      expect(res.status).equals(400);
      expect(res.body.errors).include.something.that.deep.equals({
        type: 'ACCOUNT.NOT.FOUND', code: 200, accounts: [100],
      });
    });

    it('Should response success with budget id after post valid data.', async () => {
      const account = await create('account');

      const res = await request()
        .post('/api/budget')
        .set('x-access-token', loginRes.body.token)
        .send({
          name: 'Budget Name',
          fiscal_year: '2020',
          period: 'year',
          accounts_type: 'profit_loss',
          accounts: [
            {
              account_id: account.id,
              entries: [
                {
                  amount: 1000,
                  order: 1,
                },
              ],
            },
          ],
        });

      expect(res.status).equals(200);
    });

    it('Should save budget to the storage.', async () => {
      const account = await create('account');

      const res = await request()
        .post('/api/budget')
        .set('x-access-token', loginRes.body.token)
        .send({
          name: 'Budget Name',
          fiscal_year: '2020',
          period: 'year',
          accounts_type: 'profit_loss',
          accounts: [
            {
              account_id: account.id,
              entries: [
                {
                  amount: 1000,
                  order: 1,
                }
              ],
            },
          ],
        });

      // const storedBudget = await Budget.query().findById(res.body.id);
      // expect(storedBudget.name).equals('Budget Name');
      
      const storedBudgetEntries = await BudgetEntry.query()
        .where('budget_id', storedBudget.id)
        .where('account_id', account.id);
      
      expect(storedBudgetEntries.length).equals(1);
    });

    it('Should save budget entries to the storage.', () => {

    });
    
    it('Should response success with correct data format.', () => {

    });
  });

  describe('GET: `/budget/:id`', () => {
    it('Should response not found in case budget id was not found.', async () => {
      const budget = await create('budget');

      const res = await request()
        .get('/api/budget/1000')
        .set('x-access-token', loginRes.body.token)
        .send();

      expect(res.status).equals(404);
    });

    it('Should retrieve columns of budget year date range with year period.', async () => {
      const budget = await create('budget', { period: 'year' });
      const res = await request()
        .get(`/api/budget/${budget.id}`)
        .set('x-access-token', loginRes.body.token)
        .send();

      expect(res.body.columns.length).equals(1);
    });

    it('Should retrieve columns of budget year range with month period.', async () => {
      const budget = await create('budget', {
        period: 'month',
      });

      const res = await request()
        .get(`/api/budget/${budget.id}`)
        .set('x-access-token', loginRes.body.token)
        .send();

      expect(res.body.columns.length).equals(12);
    });

    it('Should retrieve columns of budget year range with quarter period.', async () => {
      const budget = await create('budget', {
        period: 'quarter',
      });

      const res = await request()
        .get(`/api/budget/${budget.id}`)
        .set('x-access-token', loginRes.body.token)
        .send();

      expect(res.body.columns.length).equals(4);
    });

    it('Should retrieve columns of budget year range with half year period.', async () => {
      const budget = await create('budget', {
        period: 'half-year',
      });

      const res = await request()
        .get(`/api/budget/${budget.id}`)
        .set('x-access-token', loginRes.body.token)
        .send();
      
      expect(res.body.columns.length).equals(2);
    });

    it('Should retrieve budget accounts with associated entries.', async () => {
      const budget = await create('budget', { period: 'year' });
      const budgetEntry = await create('budget_entry', {
        budget_id: budget.id,
      });

      const res = await request()
        .get(`/api/budget/${budget.id}`)
        .set('x-access-token', loginRes.body.token)
        .send();

      expect(res.body);
    });
  });

  describe('DELETE: `/budget/:id`', () => {
    it('Should response not found in case budget id was not found.', () => {

    });

    it('Should delete budget from the storage', () => { 

    });

    it('Should delete budget entries from the storage.', () => {

    });

    it('Should response success in case budget was exists before the delete.', () => {

    });
  });

  describe('GET: `/budget`', () => {
    it('Should retrieve all budgets with pagination metadata.', async () => {
      const res = await request()
        .get('/api/budget')
        .set('x-access-token', loginRes.body.token)
        .send();

      console.log(res.body);

      expect(res.status).equals(200);
    })
  })
});