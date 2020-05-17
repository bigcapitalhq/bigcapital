import {
  request,
  expect,
  create,
  login,
} from '~/testInit';
let loginRes;

describe('routes: `/budget_reports`', () => {
  beforeEach(async () => {
    loginRes = await login();
  });
  afterEach(() => {
    loginRes = null;
  });

  describe('GET: `/budget_verses_actual/:reportId`', () => {
    it('Should retrieve columns of budget year range with quarter period.', async () => {
      const budget = await create('budget', { period: 'quarter' });
      const budgetEntry = await create('budget_entry', { budget_id: budget.id });

      const res = await request()
        .get(`/api/budget_reports/budget_verses_actual/${budget.id}`)
        .set('x-access-token', loginRes.body.token)
        .send();

      expect(res.body.columns.length).equals(4);
    });

    it('Should retrieve columns of budget year range with month period.', async () => {
      const budget = await create('budget', { period: 'month' });
      const budgetEntry = await create('budget_entry', { budget_id: budget.id });

      const res = await request()
        .get(`/api/budget_reports/budget_verses_actual/${budget.id}`)
        .set('x-access-token', loginRes.body.token)
        .send();

      expect(res.body.columns.length).equals(12);
    });

    it('Should retrieve columns of budget year range with year period.', async () => {
      const budget = await create('budget', { period: 'year' });
      const budgetEntry = await create('budget_entry', { budget_id: budget.id });

      const res = await request()
        .get(`/api/budget_reports/budget_verses_actual/${budget.id}`)
        .set('x-access-token', loginRes.body.token)
        .send();

      expect(res.body.columns.length).equals(1);
    });

    it('Should retrieve columns of budget year range with half-year period.', async () => {
      const budget = await create('budget', { period: 'half-year' });
      const budgetEntry = await create('budget_entry', { budget_id: budget.id });

      const res = await request()
        .get(`/api/budget_reports/budget_verses_actual/${budget.id}`)
        .set('x-access-token', loginRes.body.token)
        .send();

      expect(res.body.columns.length).equals(2);
    });

  });
});