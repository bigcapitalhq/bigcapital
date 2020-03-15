import {
  create,
  expect,
  request,
  login,
} from '~/testInit';

let loginRes;

describe('ViewRolesBuilder', () => {
  beforeEach(async () => {
    loginRes = await login();
  });
  afterEach(() => {
    loginRes = null;
  });

  it('Should not retrieve results when there is no match query from view roles.', async () => {
    const expenseResource = await create('resource', { name: 'expenses' });
    const expenseField = await create('resource_field', {
      label_name: 'Expense Account',
      column_key: 'expense_account',
      data_type: 'integer',
      resource_id: expenseResource.id,
      active: true,
      predefined: true,
    });
    const expenseView = await create('view', {
      name: 'Expense View',
      resource_id: expenseResource.id,
      roles_logic_expression: '1',
    });
    const expenseViewRole = await create('view_role', {
      view_id: expenseView.id,
      index: 1,
      field_id: expenseField.id,
      value: '12',
      comparator: 'equals',
    });

    const expenseAccount = await create('account', { id: 10 });
    const expense = await create('expense', { expense_account_id: expenseAccount.id });

    const res = await request()
      .get('/api/expenses')
      .set('x-access-token', loginRes.body.token)
      .query({ custom_view_id: expenseView.id })
      .send();

    expect(res.status).equals(200);
    expect(res.body.expenses.results.length).equals(0);
  });

  it('Should retrieve results that match custom view conditionals roles.', async () => {
    const expenseResource = await create('resource', { name: 'expenses' });
    const expenseField = await create('resource_field', {
      label_name: 'Expense Account',
      column_key: 'expense_account',
      data_type: 'integer',
      resource_id: expenseResource.id,
      active: true,
      predefined: true,
    });
    const expenseView = await create('view', {
      name: 'Expense View',
      resource_id: expenseResource.id,
      roles_logic_expression: '1',
    });
    const expenseViewRole = await create('view_role', {
      view_id: expenseView.id,
      index: 1,
      field_id: expenseField.id,
      value: '10',
      comparator: 'equals',
    });

    const expenseAccount = await create('account', { id: 10 });
    const expense = await create('expense', { expense_account_id: expenseAccount.id });

    const res = await request()
      .get('/api/expenses')
      .set('x-access-token', loginRes.body.token)
      .query({ custom_view_id: expenseView.id })
      .send();

    expect(res.status).equals(200);
    expect(res.body.expenses.results.length).equals(1);
  });
});