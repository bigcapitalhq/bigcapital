import moment from 'moment';
import {
  request,
  expect,
} from '~/testInit';
import {
  tenantWebsite,
  tenantFactory,
  loginRes
} from '~/dbInit';
import { iteratee } from 'lodash';

let creditAccount;
let debitAccount;
let incomeAccount;
let incomeType;

describe('routes: `/financial_statements`', () => {
  beforeEach(async () => {
    const accountTransactionMixed = { date: '2020-1-10' };

    // Expense --
    // 1000 Credit  - Cash account 
    //    1000 Debit - Bank account.
    await tenantFactory.create('account_transaction', {
      credit: 1000, debit: 0, account_id: 2, referenceType: 'Expense',
      referenceId: 1, ...accountTransactionMixed,
    });
    await tenantFactory.create('account_transaction', {
      credit: 0, debit: 1000, account_id: 7, referenceType: 'Expense',
      referenceId: 1, ...accountTransactionMixed,
    });

    // Journal
    // 4000 Credit - Opening balance account.
    //     2000 Debit - Bank account
    //     2000 Debit - Bank account
    await tenantFactory.create('account_transaction', {
      credit: 4000, debit: 0, account_id: 5, ...accountTransactionMixed,
    });
    await tenantFactory.create('account_transaction', {
      debit: 2000, credit: 0, account_id: 2, ...accountTransactionMixed,
    });
    await tenantFactory.create('account_transaction', {
      debit: 2000, credit: 0, account_id: 2, ...accountTransactionMixed,
    });

    // Income Journal.
    // 2000 Credit - Income account.
    //    2000 Debit - Bank account.
    await tenantFactory.create('account_transaction', {
      credit: 2000, account_id: 4, ...accountTransactionMixed
    });
    await tenantFactory.create('account_transaction', {
      debit: 2000, credit: 0, account_id: 2, ...accountTransactionMixed,
    });

    // -----------------------------------------
    // Bank account balance  = 5000  |  Opening balance account balance = 4000
    // Expense account balance = 1000  |  Income account balance   = 2000
  });
 
  describe('routes: `financial_statements/balance_sheet`', () => {
    it('Should response unauthorized in case the user was not authorized.', async () => {
      const res = await request()
        .get('/api/financial_statements/balance_sheet')
        .send();

      expect(res.status).equals(401);
    });

    it('Should retrieve query of the balance sheet with default values.', async () => {
      const res = await request()
        .get('/api/financial_statements/balance_sheet')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .query({
          display_columns_by: 'year',
          from_date: '2020-01-01',
          to_date: '2020-02-01',
        })
        .send();

      expect(res.body.query.display_columns_by).equals('year');
      expect(res.body.query.from_date).equals('2020-01-01');
      expect(res.body.query.to_date).equals('2020-02-01');

      expect(res.body.query.number_format.no_cents).equals(false);
      expect(res.body.query.number_format.divide_1000).equals(false);

      expect(res.body.query.none_zero).equals(false);
    });

    it('Should retrieve assets and liabilities/equity section.', async () => {
      const res = await request()
        .get('/api/financial_statements/balance_sheet')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .query({
          display_columns_by: 'year',
        })
        .send();

      expect(res.body.balance_sheet[0].name).equals('Assets');
      expect(res.body.balance_sheet[1].name).equals('Liabilities and Equity');

      expect(res.body.balance_sheet[0].section_type).equals('assets');
      expect(res.body.balance_sheet[1].section_type).equals('liabilities_equity');

      expect(res.body.balance_sheet[0].type).equals('section');
      expect(res.body.balance_sheet[1].type).equals('section');
    });

    it('Should retrieve assets and liabilities/equity total of each section.', async () => {
      const res = await request()
        .get('/api/financial_statements/balance_sheet')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .query({
          to_date: '2020-12-10',
        })
        .send();

      expect(res.body.balance_sheet[0].total.amount).equals(5000);
      expect(res.body.balance_sheet[1].total.amount).equals(4000);
    });

    it('Should retrieve the asset and liabilities/equity accounts.', async () => {
      const res = await request()
        .get('/api/financial_statements/balance_sheet')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .query({
          display_columns_type: 'total',
          from_date: '2012-01-01',
          to_date: '2032-02-02',
        })
        .send();

      expect(res.body.balance_sheet[0].children).to.be.a('array');
      expect(res.body.balance_sheet[0].children).to.be.a('array');

      expect(res.body.balance_sheet[0].children.length).is.not.equals(0);
      expect(res.body.balance_sheet[1].children.length).is.not.equals(0);

      expect(res.body.balance_sheet[1].children[0].children.length).is.not.equals(0);
      expect(res.body.balance_sheet[1].children[1].children.length).is.not.equals(0);
    });

    it('Should retrieve assets/liabilities total balance between the given date range.', async () => {
      const res = await request()
        .get('/api/financial_statements/balance_sheet')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .query({
          display_columns_type: 'total',
          from_date: '2012-01-01',
          to_date: '2032-02-02',
        })
        .send();

      expect(res.body.accounts[0].children).include.something.deep.equals({
        id: 1001,
        index: null,
        name: debitAccount.name,
        code: debitAccount.code,
        parentAccountId: null,
        children: [],
        total: { formatted_amount: 5000, amount: 5000, date: '2032-02-02' }
      });

      expect(res.body.accounts[1].children).include.something.deep.equals({        
        id: 1000,
        index: null,
        name: creditAccount.name,
        code: creditAccount.code,
        parentAccountId: null,
        children: [],
        total: { formatted_amount: 4000, amount: 4000, date: '2032-02-02' }
      });
    });

    it('Should retrieve asset/liabilities balance sheet with display columns by `year`.', async () => {
      const res = await request()
        .get('/api/financial_statements/balance_sheet')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .query({
          display_columns_by: 'year',
          display_columns_type: 'date_periods',
          from_date: '2012-01-01',
          to_date: '2018-02-02',
        })
        .send();

      expect(res.body.accounts[0].children[0].total_periods.length).equals(7);
      expect(res.body.accounts[1].children[0].total_periods.length).equals(7);

      expect(res.body.accounts[0].children[0].total_periods).deep.equals([
        {
          amount: 0,
          formatted_amount: 0,
          date: '2012',
        },
        {
          amount: 0,
          formatted_amount: 0,
          date: '2013',
        },
        {
          amount: 0,
          formatted_amount: 0,
          date: '2014',
        },
        {
          amount: 0,
          formatted_amount: 0,
          date: '2015',
        },
        {
          amount: 0,
          formatted_amount: 0,
          date: '2016',
        },
        {
          amount: 0,
          formatted_amount: 0,
          date: '2017',
        },
        {
          amount: 0,
          formatted_amount: 0,
          date: '2018',
        },
      ]);
    });

    it('Should retrieve balance sheet with display columns by `day`.', async () => {
      const res = await request()
        .get('/api/financial_statements/balance_sheet')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .query({
          display_columns_by: 'day',
          display_columns_type: 'date_periods',
          from_date: '2020-01-08',
          to_date: '2020-01-12',
        })
        .send();

      expect(res.body.accounts[0].children).include.something.deep.equals({
        id: debitAccount.id,
        index: debitAccount.index,
        name: debitAccount.name,
        code: debitAccount.code,
        parentAccountId: null,
        children: [],
        total_periods: [
          { date: '2020-01-08', formatted_amount: 0, amount: 0 },
          { date: '2020-01-09', formatted_amount: 0, amount: 0 },
          { date: '2020-01-10', formatted_amount: 5000, amount: 5000 },
          { date: '2020-01-11', formatted_amount: 5000, amount: 5000 },
          { date: '2020-01-12', formatted_amount: 5000, amount: 5000 },
        ],
        total: { formatted_amount: 5000, amount: 5000, date: '2020-01-12' }
      });
      expect(res.body.accounts[1].children).include.something.deep.equals({
        id: creditAccount.id,
        index: creditAccount.index,
        name: creditAccount.name,
        code: creditAccount.code,
        parentAccountId: null,
        children: [],
        total_periods: [
          { date: '2020-01-08', formatted_amount: 0, amount: 0 },
          { date: '2020-01-09', formatted_amount: 0, amount: 0 },
          { date: '2020-01-10', formatted_amount: 4000, amount: 4000 },
          { date: '2020-01-11', formatted_amount: 4000, amount: 4000 },
          { date: '2020-01-12', formatted_amount: 4000, amount: 4000 }
        ],
        total: { formatted_amount: 4000, amount: 4000, date: '2020-01-12' }
      });
    });

    it('Should retrieve the balance sheet with display columns by `month`.', async () => {
      const res = await request()
        .get('/api/financial_statements/balance_sheet')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .query({
          display_columns_by: 'month',
          display_columns_type: 'date_periods',
          from_date: '2019-07-01',
          to_date: '2020-06-30',
        })
        .send();

      expect(res.body.accounts[0].children).include.something.deep.equals({
        id: debitAccount.id,
        index: debitAccount.index,
        name: debitAccount.name,
        code: debitAccount.code,
        parentAccountId: null,
        children: [],
        total_periods: [
          { date: '2019-07', formatted_amount: 0, amount: 0 },
          { date: '2019-08', formatted_amount: 0, amount: 0 },
          { date: '2019-09', formatted_amount: 0, amount: 0 },
          { date: '2019-10', formatted_amount: 0, amount: 0 },
          { date: '2019-11', formatted_amount: 0, amount: 0 },
          { date: '2019-12', formatted_amount: 0, amount: 0 },
          { date: '2020-01', formatted_amount: 5000, amount: 5000 },
          { date: '2020-02', formatted_amount: 5000, amount: 5000 },
          { date: '2020-03', formatted_amount: 5000, amount: 5000 },
          { date: '2020-04', formatted_amount: 5000, amount: 5000 },
          { date: '2020-05', formatted_amount: 5000, amount: 5000 },
          { date: '2020-06', formatted_amount: 5000, amount: 5000 },
        ],
        total: { formatted_amount: 5000, amount: 5000, date: '2020-06-30' } 
      });
    });

    it('Should retrieve the balance sheet with display columns `quarter`.', async () => {
      const res = await request()
        .get('/api/financial_statements/balance_sheet')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .query({
          display_columns_by: 'quarter',
          display_columns_type: 'date_periods',
          from_date: '2020-01-01',
          to_date: '2020-12-31',
        })
        .send();

      expect(res.body.accounts[0].children).include.something.deep.equals({
        id: debitAccount.id,
        index: debitAccount.index,
        name: debitAccount.name,
        code: debitAccount.code,
        parentAccountId: null,
        children: [],
        total_periods: [
          { date: '2020-03', formatted_amount: 5000, amount: 5000 },
          { date: '2020-06', formatted_amount: 5000, amount: 5000 },
          { date: '2020-09', formatted_amount: 5000, amount: 5000 },
          { date: '2020-12', formatted_amount: 5000, amount: 5000 },
        ],
        total: { formatted_amount: 5000, amount: 5000, date: '2020-12-31' },
      });
    });

    it('Should retrieve the balance sheet amounts without cents.', async () => {
      await tenantFactory.create('account_transaction', {
        debit: 0.25, credit: 0, account_id: debitAccount.id, date: '2020-1-10',
      });
      const res = await request()
        .get('/api/financial_statements/balance_sheet')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .query({
          display_columns_by: 'quarter',
          display_columns_type: 'date_periods',
          from_date: '2020-01-01',
          to_date: '2020-12-31',
          number_format: {
            no_cents: true,
          },
        })
        .send();

      expect(res.body.accounts[0].children).include.something.deep.equals({
        id: debitAccount.id,
        index: debitAccount.index,
        name: debitAccount.name,
        code: debitAccount.code,
        parentAccountId: null,
        children: [],
        total_periods: [
          { date: '2020-03', formatted_amount: 5000, amount: 5000.25 },
          { date: '2020-06', formatted_amount: 5000, amount: 5000.25 },
          { date: '2020-09', formatted_amount: 5000, amount: 5000.25 },
          { date: '2020-12', formatted_amount: 5000, amount: 5000.25 },  
        ],
        total: { formatted_amount: 5000, amount: 5000.25, date: '2020-12-31' },
      });
    });

    it('Should retrieve the balance sheet amounts divided on 1000.', async () => {
      const res = await request()
        .get('/api/financial_statements/balance_sheet')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .query({
          display_columns_by: 'quarter',
          display_columns_type: 'date_periods',
          from_date: '2020',
          to_date: '2021',
          number_format: {
            divide_1000: true,
          },
        })
        .send();
      
      expect(res.body.accounts[0].children).include.something.deep.equals({
        id: debitAccount.id,
        index: debitAccount.index,
        name: debitAccount.name,
        code: debitAccount.code,
        parentAccountId: null,
        children: [],
        total_periods: [
          { date: '2020-03', formatted_amount: 5, amount: 5000 },
          { date: '2020-06', formatted_amount: 5, amount: 5000 },
          { date: '2020-09', formatted_amount: 5, amount: 5000 },
          { date: '2020-12', formatted_amount: 5, amount: 5000 },
          { date: '2021-03', formatted_amount: 5, amount: 5000 },
        ],
        total: { formatted_amount: 5, amount: 5000, date: '2021' },
      });
    });

    it('Should not retrieve accounts has no transactions between the given date range in case query none_zero is true.', async () => {
      const res = await request()
        .get('/api/financial_statements/balance_sheet')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .query({
          display_columns_by: 'quarter',
          from_date: '2002',
          to_date: '2003',
          number_format: {
            divide_1000: true,
          },
          none_zero: true,
        })
        .send();

      expect(res.body.accounts[0].children.length).equals(0);
      expect(res.body.accounts[1].children.length).equals(0);
    });

    it('Should retrieve accounts in nested structure parent and children accounts.', async () => {
      const childAccount = await tenantFactory.create('account', {
        parent_account_id: debitAccount.id,
        account_type_id: 1
      });
      const res = await request()
        .get('/api/financial_statements/balance_sheet')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .query({
          none_zero: false,
          account_ids: [childAccount.id, debitAccount.id]
        })
        .send();

      expect(res.body.accounts[0].children).include.something.deep.equals({
        id: debitAccount.id,
        index: null,
        name: debitAccount.name,
        code: debitAccount.code,
        parentAccountId: null,
        total: { formatted_amount: 5000, amount: 5000, date: '2020-12-31' },
        children: [
          {
            id: childAccount.id,
            index: null,
            name: childAccount.name,
            code: childAccount.code,
            parentAccountId: debitAccount.id,
            total: { formatted_amount: 0, amount: 0, date: '2020-12-31' },
            children: [],
          }
        ]
      });
    });
    
    it('Should parent account balance summation of total balance all children accounts.', async () => {
      const childAccount = await tenantFactory.create('account', {
        parent_account_id: debitAccount.id,
        account_type_id: 1
      });
      await tenantFactory.create('account_transaction', {
        credit: 0, debit: 1000, account_id: childAccount.id, date: '2020-1-10'
      });

      const res = await request()
        .get('/api/financial_statements/balance_sheet')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .query({
          none_zero: false,
          account_ids: [childAccount.id, debitAccount.id]
        })
        .send();

      expect(res.body.accounts[0].children[0].total.amount).equals(6000);
      expect(res.body.accounts[0].children[0].total.formatted_amount).equals(6000);
    });

    it('Should parent account balance summation of total periods amounts all children accounts.', async () => {
      const childAccount = await tenantFactory.create('account', {
        parent_account_id: debitAccount.id,
        account_type_id: 1
      });
      await tenantFactory.create('account_transaction', {
        credit: 0, debit: 1000, account_id: childAccount.id, date: '2020-2-10'
      });

      const res = await request()
        .get('/api/financial_statements/balance_sheet')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .query({
          none_zero: false,
          account_ids: [childAccount.id, debitAccount.id],
          display_columns_type: 'date_periods',
          display_columns_by: 'month',
          from_date: '2020-01-01',
          to_date: '2020-12-12',
        })
        .send();

      expect(res.body.accounts[0].children[0].total_periods).deep.equals([
        { amount: 5000, formatted_amount: 5000, date: '2020-01' },
        { amount: 6000, formatted_amount: 6000, date: '2020-02' },
        { amount: 6000, formatted_amount: 6000, date: '2020-03' },
        { amount: 6000, formatted_amount: 6000, date: '2020-04' },
        { amount: 6000, formatted_amount: 6000, date: '2020-05' },
        { amount: 6000, formatted_amount: 6000, date: '2020-06' },
        { amount: 6000, formatted_amount: 6000, date: '2020-07' },
        { amount: 6000, formatted_amount: 6000, date: '2020-08' },
        { amount: 6000, formatted_amount: 6000, date: '2020-09' },
        { amount: 6000, formatted_amount: 6000, date: '2020-10' },
        { amount: 6000, formatted_amount: 6000, date: '2020-11' },
        { amount: 6000, formatted_amount: 6000, date: '2020-12' }
      ])
    });
  });
});
