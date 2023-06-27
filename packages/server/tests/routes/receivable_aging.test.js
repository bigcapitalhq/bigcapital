import {
  request,
  expect,
} from '~/testInit';
import Item from 'models/Item';
import {
  tenantWebsite,
  tenantFactory,
  loginRes
} from '~/dbInit';


describe('routes: `/financial_statements/receivable_aging_summary`', () => {

  it('Should retrieve customers list.', async () => {
    const customer1 = await tenantFactory.create('customer', { display_name: 'Ahmed' });
    const customer2 = await tenantFactory.create('customer', { display_name: 'Mohamed' });

    const res = await request()
      .get('/api/financial_statements/receivable_aging_summary')
      .set('x-access-token', loginRes.body.token)
      .set('organization-id', tenantWebsite.organizationId)
      .send();

    expect(res.status).equals(200);
    
    expect(res.body.aging.customers).is.an('array');
    expect(res.body.aging.customers.length).equals(2);

    expect(res.body.aging.customers[0].customer_name).equals('Ahmed');
    expect(res.body.aging.customers[1].customer_name).equals('Mohamed');
  });

  it('Should respond the customers ids not found.', async () => {
    const res = await request()
      .get('/api/financial_statements/receivable_aging_summary')
      .set('x-access-token', loginRes.body.token)
      .set('organization-id', tenantWebsite.organizationId)
      .query({
        customer_ids: [3213, 3322],
      })
      .send();

    expect(res.status).equals(400);
    expect(res.body.errors).include.something.deep.equals({
      type: 'CUSTOMERS.IDS.NOT.FOUND', code: 300, ids: [3213, 3322]
    })
  });

  it('Should retrieve aging report columns.', async () => {
    const customer1 = await tenantFactory.create('customer', { display_name: 'Ahmed' });
    const customer2 = await tenantFactory.create('customer', { display_name: 'Mohamed' });

    const res = await request()
      .get('/api/financial_statements/receivable_aging_summary')
      .set('x-access-token', loginRes.body.token)
      .set('organization-id', tenantWebsite.organizationId)
      .query({
        as_date: '2020-06-01',
        aging_days_before: 30,
        aging_periods: 6,
      })
      .send();

    expect(res.body.columns).length(6);
    expect(res.body.columns[0].before_days).equals(0);
    expect(res.body.columns[0].to_days).equals(30);

    expect(res.body.columns[1].before_days).equals(31);
    expect(res.body.columns[1].to_days).equals(60);
    
    expect(res.body.columns[2].before_days).equals(61);
    expect(res.body.columns[2].to_days).equals(90);

    expect(res.body.columns[3].before_days).equals(91);
    expect(res.body.columns[3].to_days).equals(120);

    expect(res.body.columns[4].before_days).equals(121);
    expect(res.body.columns[4].to_days).equals(150);

    expect(res.body.columns[5].before_days).equals(151);
    expect(res.body.columns[5].to_days).equals(null);
  });

  it('Should retrieve receivable total of the customers.', async () => {
    const customer1 = await tenantFactory.create('customer', { display_name: 'Ahmed' });
    const customer2 = await tenantFactory.create('customer', { display_name: 'Mohamed' });

    await tenantFactory.create('account_transaction', {
      contact_id: customer1.id,
      contact_type: 'customer',
      debit: 10000,
      credit: 0,
      account_id: 10,
      date: '2020-01-01',
    });
    
    await tenantFactory.create('account_transaction', {
      contact_id: customer1.id,
      contact_type: 'customer',
      debit: 1000,
      credit: 0,
      account_id: 10,
      date: '2020-03-15',
    });

    // Receive
    await tenantFactory.create('account_transaction', {
      contact_id: customer1.id,
      contact_type: 'customer',
      debit: 0,
      credit: 8000,
      account_id: 10,
      date: '2020-06-01',
    });
    
    const res = await request()
      .get('/api/financial_statements/receivable_aging_summary')
      .set('x-access-token', loginRes.body.token)
      .set('organization-id', tenantWebsite.organizationId)
      .query({
        as_date: '2020-06-01',
        aging_days_before: 30,
        aging_periods: 6,
      })
      .send();

    expect(res.body.aging.total[0].total).equals(0);
    expect(res.body.aging.total[1].total).equals(0);
    expect(res.body.aging.total[2].total).equals(1000);
    expect(res.body.aging.total[3].total).equals(0);
    expect(res.body.aging.total[4].total).equals(0);
    expect(res.body.aging.total[5].total).equals(2000);
  });


  it('Should retrieve customer aging.', async () => {
    const customer1 = await tenantFactory.create('customer', { display_name: 'Ahmed' });
    const customer2 = await tenantFactory.create('customer', { display_name: 'Mohamed' });

    await tenantFactory.create('account_transaction', {
      contact_id: customer1.id,
      contact_type: 'customer',
      debit: 10000,
      credit: 0,
      account_id: 10,
      date: '2020-01-14',
    });
    
    await tenantFactory.create('account_transaction', {
      contact_id: customer1.id,
      contact_type: 'customer',
      debit: 1000,
      credit: 0,
      account_id: 10,
      date: '2020-03-15',
    });

    // Receive
    await tenantFactory.create('account_transaction', {
      contact_id: customer1.id,
      contact_type: 'customer',
      debit: 0,
      credit: 8000,
      account_id: 10,
      date: '2020-06-01',
    });
    
    const res = await request()
      .get('/api/financial_statements/receivable_aging_summary')
      .set('x-access-token', loginRes.body.token)
      .set('organization-id', tenantWebsite.organizationId)
      .query({
        as_date: '2020-06-01',
        aging_days_before: 30,
        aging_periods: 6,
      })
      .send();

    expect(res.body.aging.customers[0].aging[0].total).equals(0);
    expect(res.body.aging.customers[0].aging[1].total).equals(0);
    expect(res.body.aging.customers[0].aging[2].total).equals(1000);
    expect(res.body.aging.customers[0].aging[3].total).equals(0);
    expect(res.body.aging.customers[0].aging[4].total).equals(2000);
    expect(res.body.aging.customers[0].aging[5].total).equals(0);
  });

  it('Should retrieve the queried customers ids only.', async () => {
    const customer1 = await tenantFactory.create('customer', { display_name: 'Ahmed' });
    const customer2 = await tenantFactory.create('customer', { display_name: 'Mohamed' });

    await tenantFactory.create('account_transaction', {
      contact_id: customer1.id,
      contact_type: 'customer',
      debit: 10000,
      credit: 0,
      account_id: 10,
      date: '2020-01-14',
    });
    
    await tenantFactory.create('account_transaction', {
      contact_id: customer1.id,
      contact_type: 'customer',
      debit: 1000,
      credit: 0,
      account_id: 10,
      date: '2020-03-15',
    });

    // Receive
    await tenantFactory.create('account_transaction', {
      contact_id: customer1.id,
      contact_type: 'customer',
      debit: 0,
      credit: 8000,
      account_id: 10,
      date: '2020-06-01',
    });
    
    const res = await request()
      .get('/api/financial_statements/receivable_aging_summary')
      .set('x-access-token', loginRes.body.token)
      .set('organization-id', tenantWebsite.organizationId)
      .query({
        as_date: '2020-06-01',
        aging_days_before: 30,
        aging_periods: 6,
        customer_ids: [customer1.id],
      })
      .send();

    expect(res.body.aging.customers.length).equals(1);
  })
});
