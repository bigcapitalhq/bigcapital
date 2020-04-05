import moment from 'moment';
import {
  expect,
  request,
  login,
  create,
} from '~/testInit';

let loginRes;
let creditAccount;
let debitAccount;

describe('routes: `/financial_statements`', () => {
  beforeEach(async () => {
    loginRes = await login();

    // Balance sheet types.
    const creditAccType = await create('account_type', { normal: 'credit', balance_sheet: true });
    const debitAccType = await create('account_type', { normal: 'debit', balance_sheet: true });

    // Income statement types.
    const incomeType = await create('account_type', { normal: 'credit', income_sheet: true });
    const expenseType = await create('account_type', { normal: 'debit', income_sheet: true });

    // Assets & liabilites accounts.
    creditAccount = await create('account', { account_type_id: creditAccType.id });
    debitAccount = await create('account', { account_type_id: debitAccType.id });

    // Income && expenses accounts.
    const incomeAccount = await create('account', { account_type_id: incomeType.id });
    const expenseAccount = await create('account', { account_type_id: expenseType.id });
    const income2Account = await create('account', { account_type_id: incomeType.id });

    const accountTransactionMixied = { date: '2020-1-10' };

    await create('account_transaction', {
      credit: 1000, debit: 0, account_id: creditAccount.id, referenceType: 'Expense', ...accountTransactionMixied,
    });
    await create('account_transaction', {
      credit: 1000, debit: 0, account_id: creditAccount.id, ...accountTransactionMixied,
    });
    await create('account_transaction', {
      debit: 2000, credit: 0, account_id: debitAccount.id, ...accountTransactionMixied,
    });
    await create('account_transaction', {
      debit: 2000, credit: 0, account_id: debitAccount.id, ...accountTransactionMixied,
    });
    await create('account_transaction', { credit: 2000, account_id: incomeAccount.id, ...accountTransactionMixied });
    await create('account_transaction', { debit: 6000, account_id: expenseAccount.id, ...accountTransactionMixied });
  });

  afterEach(() => {
    loginRes = null;
  });
  describe('routes: `/financial_statements/journal`', () => {
    it('Should response unauthorized in case the user was not authorized.', async () => {
      const res = await request()
        .get('/api/financial_statements/journal')
        .send();

      expect(res.status).equals(401);
    });

    it('Should retrieve ledger transactions grouped by reference type and id.', async () => {
      const res = await request()
        .get('/api/financial_statements/journal')
        .set('x-access-token', loginRes.body.token)
        .send();

      expect(res.status).equals(200);
      expect(res.body.journal.length).to.be.at.least(1);

      expect(res.body.journal[0].credit).to.be.a('number');
      expect(res.body.journal[0].debit).to.be.a('number');
      expect(res.body.journal[0].entries).to.be.a('array');
      expect(res.body.journal[0].id).to.be.a('string');

      expect(res.body.journal[0].entries[0].credit).to.be.a('number');
      expect(res.body.journal[0].entries[0].debit).to.be.a('number');
    });

    it('Should retrieve transactions between date range.', async () => {
      const res = await request()
        .get('/api/financial_statements/journal')
        .set('x-access-token', loginRes.body.token)
        .query({
          from_date: '2018-01-01',
          to_date: '2019-01-01',
        })
        .send();

      expect(res.body.journal.length).equals(0);
    });

    it('Should retrieve transactions that associated to the queried accounts.', async () => {
      const res = await request()
        .get('/api/financial_statements/journal')
        .set('x-access-token', loginRes.body.token)
        .query({
          account_ids: [creditAccount.id],
        })
        .send();

      expect(res.body.journal.length).equals(2);
    });

    it('Should retrieve tranasactions with the given types.', async () => {
      const res = await request()
        .get('/api/financial_statements/journal')
        .set('x-access-token', loginRes.body.token)
        .query({
          transaction_types: ['Expense'],
        });

      expect(res.body.journal.length).equals(1);
    });

    it('Should retrieve transactions with range amount.', async () => {
      const res = await request()
        .get('/api/financial_statements/journal')
        .set('x-access-token', loginRes.body.token)
        .query({
          from_range: 2000,
          to_range: 2000,
        });

      expect(res.body.journal[0].credit).satisfy((credit) => {
        return credit === 0 || credit === 2000;
      });
      expect(res.body.journal[0].debit).satisfy((debit) => {
        return debit === 0 || debit === 2000;
      });
    });

    it('Should format credit and debit to no cents of retrieved transactions.', async () => {

    });

    it('Should divide credit/debit amount on 1000', async () => {
      const res = await request()
        .get('/api/financial_statements/journal')
        .set('x-access-token', loginRes.body.token)
        .query({
          number_format: {
            divide_1000: true,
          },
        })
        .send();

      const journal = res.body.journal.find((j) => j.id === '1-Expense');

      expect(journal.credit).equals(1);
      expect(journal.debit).equals(0);
    });
  });

  describe('routes: `/financial_statements/general_ledger`', () => {
    it('Should response unauthorized in case the user was not authorized.', async () => {
      const res = await request()
        .get('/api/financial_statements/general_ledger')
        .send();

      expect(res.status).equals(401);
    });

    it('Should retrieve request query meta on response schema.', async () => {
      const res = await request()
        .get('/api/financial_statements/general_ledger')
        .set('x-access-token', loginRes.body.token)
        .send();

      expect(res.body.query.from_date).equals(moment().startOf('year').format('YYYY-MM-DD'));
      expect(res.body.query.to_date).equals(moment().endOf('year').format('YYYY-MM-DD'));
      expect(res.body.query.basis).equals('cash');
      expect(res.body.query.number_format.no_cents).equals(false);
      expect(res.body.query.number_format.divide_1000).equals(false);
      expect(res.body.query.none_zero).equals(false);
      expect(res.body.query.accounts_ids).to.be.an('array');
    });

    it('Should retrieve the general ledger accounts with associated transactions and opening/closing balance.', async () => {
      const res = await request()
        .get('/api/financial_statements/general_ledger')
        .set('x-access-token', loginRes.body.token)
        .send();

      expect(res.body.accounts).is.an('array');
      expect(res.body.accounts[0].id).to.be.an('number');
      expect(res.body.accounts[0].name).to.be.a('string');
      expect(res.body.accounts[0].code).to.be.a('string');
      expect(res.body.accounts[0].transactions).to.be.a('array');
      expect(res.body.accounts[0].opening).to.be.a('object');
      expect(res.body.accounts[0].opening.balance).to.be.a('number');
      expect(res.body.accounts[0].opening.date).to.be.a('string');
      expect(res.body.accounts[0].closing).to.be.a('object');
      expect(res.body.accounts[0].closing.balance).to.be.a('number');
      expect(res.body.accounts[0].closing.date).to.be.a('string');
    });

    it('Should retrieve opening and closing balance.', async () => {
      const res = await request()
        .get('/api/financial_statements/general_ledger')
        .set('x-access-token', loginRes.body.token)
        .send();

      const targetAccount = res.body.accounts.find((a) => a.id === creditAccount.id);

      expect(targetAccount).to.be.an('object');
      expect(targetAccount.opening).to.deep.equal({
        balance: 0, date: '2020-01-01',
      });
      expect(targetAccount.closing).to.deep.equal({
        balance: 2000, date: '2020-12-31',
      });
    });

    it('Should retrieve opening and closing balance between the given date range.', async () => {
      const res = await request()
        .get('/api/financial_statements/general_ledger')
        .set('x-access-token', loginRes.body.token)
        .query({
          from_date: '2020-01-20',
          to_date: '2020-03-30',
          none_zero: true,
        })
        .send();

      const targetAccount = res.body.accounts.find((a) => a.id === creditAccount.id);

      expect(targetAccount).to.be.an('object');
      expect(targetAccount.opening).to.deep.equal({
        balance: 2000, date: '2020-01-20',
      });
      expect(targetAccount.closing).to.deep.equal({
        balance: 2000, date: '2020-03-30',
      });
    });

    it('Should retrieve accounts with associated transactions.', async () => {
      const res = await request()
        .get('/api/financial_statements/general_ledger')
        .set('x-access-token', loginRes.body.token)
        .query({
          none_zero: true,
        })
        .send();

      const targetAccount = res.body.accounts.find((a) => a.id === creditAccount.id);

      expect(targetAccount.transactions[0].amount).equals(1000);
      expect(targetAccount.transactions[1].amount).equals(1000);

      expect(targetAccount.transactions[1].id).to.be.an('number');
      // expect(targetAccount.transactions[1].note).to.be.an('string');
      // expect(targetAccount.transactions[1].transactionType).to.be.an('string');
      // expect(targetAccount.transactions[1].referenceType).to.be.an('string');
      // expect(targetAccount.transactions[1].referenceId).to.be.an('number');
      expect(targetAccount.transactions[1].date).to.be.an('string');
    })
 
    it('Should retrieve accounts transactions only that between date range.', async () => {
      const res = await request()
        .get('/api/financial_statements/general_ledger')
        .set('x-access-token', loginRes.body.token)
        .query({
          from_date: '2020-01-20',
          to_date: '2020-03-30',
          none_zero: true,
        })
        .send();

      const targetAccount = res.body.accounts.find((a) => a.id === creditAccount.id);
      expect(targetAccount.transactions.length).equals(0);
    });

    it('Should not retrieve all accounts that have no transactions in the given date range when `none_zero` is `false`.', async () => {
      const res = await request()
        .get('/api/financial_statements/general_ledger')
        .set('x-access-token', loginRes.body.token)
        .query({
          from_date: '2020-01-20',
          to_date: '2020-03-30',
          none_zero: false,
        })
        .send();

      res.body.accounts.forEach((account) => {
        expect(account.transactions.length).not.equals(0);
      });
    });

    it('Should retrieve all accounts even it have no transactions in the given date range when `none_zero` is `true`', async () => {
      const res = await request()
        .get('/api/financial_statements/general_ledger')
        .set('x-access-token', loginRes.body.token)
        .query({
          from_date: '2020-01-01',
          to_date: '2020-03-30',
          none_zero: true,
        })
        .send();

      const accountsNoTransactions = res.body.accounts.filter(a => a.transactions.length === 0);
      const accountsWithTransactions = res.body.accounts.filter(a => a.transactions.length > 0);

      expect(accountsNoTransactions.length).not.equals(0);
      expect(accountsWithTransactions.length).not.equals(0);
    });

    it('Should amount transactions divided on `1000` when `number_format.none_zero` is `true`.', async () => {
      const res = await request()
        .get('/api/financial_statements/general_ledger')
        .set('x-access-token', loginRes.body.token)
        .query({
          from_date: '2020-01-01',
          to_date: '2020-03-30',
          number_format: {
            divide_1000: true,
          },
        })
        .send();
      
      const targetAccount = res.body.accounts.find((a) => a.id === creditAccount.id);
      expect(targetAccount.transactions[0].amount).equals(1);
      expect(targetAccount.transactions[1].amount).equals(1);
    });

    it('Should amount transactions rounded with no decimals when `number_format.no_cents` is `true`.', async () => {
      await create('account_transaction', {
        debit: 0.25, credit: 0, account_id: debitAccount.id, date: '2020-1-10',
      });

      const res = await request()
        .get('/api/financial_statements/general_ledger')
        .set('x-access-token', loginRes.body.token)
        .query({
          from_date: '2020-01-01',
          to_date: '2020-03-30',
          number_format: {
            divide_1000: true,
            no_cents: true,
          },
          accounts_ids: [debitAccount.id]
        })
        .send();

      expect(res.body.accounts[0].transactions[2].amount).equal(0);
    });

    it('Should retrieve only accounts that given in the query.', async () => {
      const res = await request()
        .get('/api/financial_statements/general_ledger')
        .set('x-access-token', loginRes.body.token)
        .query({
          from_date: '2020-01-01',
          to_date: '2020-03-30',
          none_zero: true,
          accounts_ids: [creditAccount.id],
        })
        .send();

      expect(res.body.accounts.length).equals(1);
    });
  });

  describe('routes: `financial_statements/balance_sheet`', () => {
    it('Should response unauthorzied in case the user was not authorized.', async () => {
      const res = await request()
        .get('/api/financial_statements/balance_sheet')
        .send();

      expect(res.status).equals(401);
    });

    it('Should retrieve query of the balance sheet with default values.', async () => {
      const res = await request()
        .get('/api/financial_statements/balance_sheet')
        .set('x-access-token', loginRes.body.token)
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

    it('Should retrieve the asset accounts balance.', async () => {
      const res = await request()
        .get('/api/financial_statements/balance_sheet')
        .set('x-access-token', loginRes.body.token)
        .query({
          display_columns_by: 'year',
        })
        .send();

      expect(res.body.balance_sheet.assets.accounts).to.be.a('array');
      expect(res.body.balance_sheet.liabilities_equity.accounts).to.be.a('array');
    });

    it('Should retrieve assets/liabilities total balance between the given date range.', async () => {
      const res = await request()
        .get('/api/financial_statements/balance_sheet')
        .set('x-access-token', loginRes.body.token)
        .query({
          display_columns_type: 'total',
          from_date: '2012-01-01',
          to_date: '2032-02-02',
        })
        .send();

        console.log(res.body.balance_sheet.assets.accounts);

      expect(res.body.balance_sheet.assets.accounts[0].total).deep.equals({
        amount: 4000, formatted_amount: 4000, date: '2032-02-02',
      });
      expect(res.body.balance_sheet.liabilities_equity.accounts[0].total).deep.equals({
        amount: 2000, formatted_amount: 2000, date: '2032-02-02',
      });
    });

    it('Should retrieve asset/liabilities balance sheet with display columns by `year`.', async () => {
      const res = await request()
        .get('/api/financial_statements/balance_sheet')
        .set('x-access-token', loginRes.body.token)
        .query({
          display_columns_by: 'year',
          from_date: '2012-01-01',
          to_date: '2018-02-02',
        })
        .send();

      expect(res.body.balance_sheet.assets.accounts[0].periods_balance.length).equals(7);
      expect(res.body.balance_sheet.liabilities_equity.accounts[0].periods_balance.length).equals(7);

      expect(res.body.balance_sheet.assets.accounts[0].periods_balance).deep.equals([
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
        .query({
          display_columns_by: 'day',
          from_date: '2020-01-08',
          to_date: '2020-01-12',
        })
        .send();

      expect(res.body.balance_sheet.assets.accounts[0].periods_balance).deep.equals([
        { date: '2020-01-08', formatted_amount: 0, amount: 0 },
        { date: '2020-01-09', formatted_amount: 0, amount: 0 },
        { date: '2020-01-10', formatted_amount: 4000, amount: 4000 },
        { date: '2020-01-11', formatted_amount: 4000, amount: 4000 },
        { date: '2020-01-12', formatted_amount: 4000, amount: 4000 },
      ]);
    });

    it('Should retrieve the balance sheet with display columns by `month`.', async () => {
      const res = await request()
        .get('/api/financial_statements/balance_sheet')
        .set('x-access-token', loginRes.body.token)
        .query({
          display_columns_by: 'month',
          from_date: '2019-07-01',
          to_date: '2020-06-30',
        })
        .send();

      expect(res.body.balance_sheet.assets.accounts[0].periods_balance.length).equals(12);
      expect(res.body.balance_sheet.liabilities_equity.accounts[0].periods_balance.length).equals(12);

      expect(res.body.balance_sheet.assets.accounts[0].periods_balance).deep.equals([
        { date: '2019-07', formatted_amount: 0, amount: 0 },
        { date: '2019-08', formatted_amount: 0, amount: 0 },
        { date: '2019-09', formatted_amount: 0, amount: 0 },
        { date: '2019-10', formatted_amount: 0, amount: 0 },
        { date: '2019-11', formatted_amount: 0, amount: 0 },
        { date: '2019-12', formatted_amount: 0, amount: 0 },
        { date: '2020-01', formatted_amount: 4000, amount: 4000 },
        { date: '2020-02', formatted_amount: 4000, amount: 4000 },
        { date: '2020-03', formatted_amount: 4000, amount: 4000 },
        { date: '2020-04', formatted_amount: 4000, amount: 4000 },
        { date: '2020-05', formatted_amount: 4000, amount: 4000 },
        { date: '2020-06', formatted_amount: 4000, amount: 4000 },
      ]);
    });

    it('Should retrieve the balance sheet with display columns `quarter`.', async () => {
      const res = await request()
        .get('/api/financial_statements/balance_sheet')
        .set('x-access-token', loginRes.body.token)
        .query({
          display_columns_by: 'quarter',
          from_date: '2020-01-01',
          to_date: '2020-12-31',
        })
        .send();

      expect(res.body.balance_sheet.assets.accounts[0].periods_balance.length).equals(4);
      expect(res.body.balance_sheet.assets.accounts[0].periods_balance).deep.equals([
        { date: '2020-03', formatted_amount: 4000, amount: 4000 },
        { date: '2020-06', formatted_amount: 4000, amount: 4000 },
        { date: '2020-09', formatted_amount: 4000, amount: 4000 },
        { date: '2020-12', formatted_amount: 4000, amount: 4000 },
      ]);
    });

    it('Should retrieve the balance sheet amounts without cents.', async () => {
      await create('account_transaction', {
        debit: 0.25, credit: 0, account_id: debitAccount.id, date: '2020-1-10',
      });
      const res = await request()
        .get('/api/financial_statements/balance_sheet')
        .set('x-access-token', loginRes.body.token)
        .query({
          display_columns_by: 'quarter',
          from_date: '2020-01-01',
          to_date: '2020-12-31',
          number_format: {
            no_cents: true,
          },
        })
        .send();

      expect(res.body.balance_sheet.assets.accounts[0].periods_balance.length).equals(4);
      expect(res.body.balance_sheet.assets.accounts[0].periods_balance).deep.equals([
        { date: '2020-03', formatted_amount: 4000, amount: 4000.25 },
        { date: '2020-06', formatted_amount: 4000, amount: 4000.25 },
        { date: '2020-09', formatted_amount: 4000, amount: 4000.25 },
        { date: '2020-12', formatted_amount: 4000, amount: 4000.25 },
      ]);
    });

    it('Should retrieve the balance sheet amounts divided on 1000.', async () => {
      const res = await request()
        .get('/api/financial_statements/balance_sheet')
        .set('x-access-token', loginRes.body.token)
        .query({
          display_columns_by: 'quarter',
          from_date: '2020',
          to_date: '2021',
          number_format: {
            divide_1000: true,
          },
        })
        .send();

      expect(res.body.balance_sheet.assets.accounts[0].periods_balance).deep.equals([
        { date: '2020-03', formatted_amount: 4, amount: 4000 },
        { date: '2020-06', formatted_amount: 4, amount: 4000 },
        { date: '2020-09', formatted_amount: 4, amount: 4000 },
        { date: '2020-12', formatted_amount: 4, amount: 4000 },
        { date: '2021-03', formatted_amount: 4, amount: 4000 },
      ]);
    });

    it('Should not retrieve accounts has no transactions between the given date range in case query none_zero is true.', async () => {
      const res = await request()
        .get('/api/financial_statements/balance_sheet')
        .set('x-access-token', loginRes.body.token)
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

      expect(res.body.balance_sheet.assets.accounts.length).equals(0);
      expect(res.body.balance_sheet.liabilities_equity.accounts.length).equals(0);
    });
  });

  describe('routes: `/financial_statements/trial_balance`', () => {
    it('Should response unauthorized in case the user was not authorized.', async () => {
      const res = await request()
        .get('/api/financial_statements/trial_balance_sheet')
        .send();

      expect(res.status).equals(401);
    });

    it('Should retrieve the trial balance of accounts.', async () => {
      const res = await request()
        .get('/api/financial_statements/trial_balance_sheet')
        .set('x-access-token', loginRes.body.token)
        .send();

      const foundCreditAccount = res.body.items.find((item) => {
        return item.account_id === creditAccount.id;
      });
      expect(foundCreditAccount.credit).equals(2000);
      expect(foundCreditAccount.debit).equals(0);
      expect(foundCreditAccount.balance).equals(2000);
    });

    it('Should not retrieve accounts has no transactions between the given date range.', async () => {
      const res = await request()
        .get('/api/financial_statements/trial_balance_sheet')
        .set('x-access-token', loginRes.body.token)
        .query({
          // There is no transactions between these dates.
          from_date: '2002-01-01',
          to_date: '2003-01-01',
          none_zero: true,
        })
        .send();

      expect(res.body.items.length).equals(0);
    });

    it('Should retrieve trial balance of accounts between the given date range.', async () => {
      const res = await request()
        .get('/api/financial_statements/trial_balance_sheet')
        .set('x-access-token', loginRes.body.token)
        .query({
          // There is no transactions between these dates.
          from_date: '2020-01-05',
          to_date: '2020-01-10',
        })
        .send();

      const foundCreditAccount = res.body.items.find((item) => {
        return item.account_id === creditAccount.id;
      });
      expect(foundCreditAccount.credit).equals(2000);
      expect(foundCreditAccount.debit).equals(0);
      expect(foundCreditAccount.balance).equals(2000);
    });

    it('Should credit, debit and balance amount be divided on 1000.', async () => {
      const res = await request()
        .get('/api/financial_statements/trial_balance_sheet')
        .set('x-access-token', loginRes.body.token)
        .query({
          // There is no transactions between these dates.
          from_date: '2020-01-05',
          to_date: '2020-01-10',
          number_format: {
            divide_1000: true,
          },
        })
        .send();

      const foundCreditAccount = res.body.items.find((item) => {
        return item.account_id === creditAccount.id;
      });
      expect(foundCreditAccount.credit).equals(2);
      expect(foundCreditAccount.debit).equals(0);
      expect(foundCreditAccount.balance).equals(2);
    });

    it('Should credit, debit and balance amount rounded without cents.', async () => {
      const res = await request()
        .get('/api/financial_statements/trial_balance_sheet')
        .set('x-access-token', loginRes.body.token)
        .query({
          // There is no transactions between these dates.
          from_date: '2020-01-05',
          to_date: '2020-01-10',
          number_format: {
            no_cents: true,
          },
        })
        .send();
    });

    it('Should retrieve associated account details in accounts list.', async () => {

    });
  });

  describe('routes: `/api/financial_statements/profit_loss_sheet`', () => {
    it('Should response unauthorized in case the user was not authorized.', async () => {
      const res = await request()
        .get('/api/financial_statements/profit_loos_sheet')
        .send();

      expect(res.status).equals(401);
      expect(res.body.message).equals('unauthorized');
    });

    it('Should retrieve columns when display type `date_periods` and columns by `month` between date range.', async () => {
      const res = await request()
        .get('/api/financial_statements/profit_loss_sheet')
        .set('x-access-token', loginRes.body.token)
        .query({
          from_date: '2020-01-01',
          to_date: '2020-12-12',
          display_columns_type: 'date_periods',
          display_columns_by: 'month',
        })
        .send();

      expect(res.body.columns.length).equals(12);
      expect(res.body.columns).deep.equals([
        '2020-01', '2020-02',
        '2020-03', '2020-04',
        '2020-05', '2020-06',
        '2020-07', '2020-08',
        '2020-09', '2020-10',
        '2020-11', '2020-12',
      ]);
    });

    it('Should retrieve columns when display type `date_periods` and columns by `quarter`.', async () => {
      const res = await request()
        .get('/api/financial_statements/profit_loss_sheet')
        .set('x-access-token', loginRes.body.token)
        .query({
          from_date: moment().startOf('year').format('YYYY-MM-DD'),
          to_date: moment().endOf('year').format('YYYY-MM-DD'),
          display_columns_type: 'date_periods',
          display_columns_by: 'quarter',
        })
        .send();

      expect(res.body.columns.length).equals(4);
      expect(res.body.columns).deep.equals([
        '2020-03', '2020-06', '2020-09', '2020-12',
      ]);
    });

    it('Should retrieve columns when display type `date_periods` and columns by `day` between date range.', async () => {
      const res = await request()
        .get('/api/financial_statements/profit_loss_sheet')
        .set('x-access-token', loginRes.body.token)
        .query({
          from_date: moment('2020-01-01').startOf('month').format('YYYY-MM-DD'),
          to_date: moment('2020-01-01').endOf('month').format('YYYY-MM-DD'),
          display_columns_type: 'date_periods',
          display_columns_by: 'day',
        })
        .send();

      expect(res.body.columns.length).equals(31);
      expect(res.body.columns).deep.equals([
        '2020-01-01', '2020-01-02', '2020-01-03',
        '2020-01-04', '2020-01-05', '2020-01-06',
        '2020-01-07', '2020-01-08', '2020-01-09',
        '2020-01-10', '2020-01-11', '2020-01-12',
        '2020-01-13', '2020-01-14', '2020-01-15',
        '2020-01-16', '2020-01-17', '2020-01-18',
        '2020-01-19', '2020-01-20', '2020-01-21',
        '2020-01-22', '2020-01-23', '2020-01-24',
        '2020-01-25', '2020-01-26', '2020-01-27',
        '2020-01-28', '2020-01-29', '2020-01-30',
        '2020-01-31',
      ]);
    });

    it('Should retrieve all income accounts even it has no transactions.', async () => {
      const res = await request()
        .get('/api/financial_statements/profit_loss_sheet')
        .set('x-access-token', loginRes.body.token)
        .query({
          from_date: moment('2020-01-01').startOf('month').format('YYYY-MM-DD'),
          to_date: moment('2020-01-01').endOf('month').format('YYYY-MM-DD'),
          display_columns_type: 'total',
          display_columns_by: 'month',
        })
        .send();

      const zeroAccount = res.body.income.accounts.filter((a) => a.total.amount === 0);
      expect(zeroAccount.length).not.equals(0);
    });

    it('Should retrieve total of each income account when display columns by `total`.',  async () => {
      const toDate = moment('2020-01-01').endOf('month').format('YYYY-MM-DD');
      const res = await request()
        .get('/api/financial_statements/profit_loss_sheet')
        .set('x-access-token', loginRes.body.token)
        .query({
          from_date: moment('2020-01-01').startOf('month').format('YYYY-MM-DD'),
          to_date: toDate,
        })
        .send();

      expect(res.body.income.accounts).to.be.an('array');
      expect(res.body.income.accounts.length).not.equals(0);
      expect(res.body.income.accounts[0].id).to.be.an('number');
      expect(res.body.income.accounts[0].name).to.be.an('string');
      expect(res.body.income.accounts[0].total).to.be.an('object');
      expect(res.body.income.accounts[0].total.amount).to.be.an('number');
      expect(res.body.income.accounts[0].total.formatted_amount).to.be.an('number');
      expect(res.body.income.accounts[0].total.date).equals(toDate);
    });

    it('Should retrieve credit sumation of income accounts.', async () => {
      const res = await request()
        .get('/api/financial_statements/profit_loss_sheet')
        .set('x-access-token', loginRes.body.token)
        .query({
          from_date: '2020-01-01',
          to_date: '2021-01-01',
        })
        .send();

      expect(res.body.income.total).to.be.an('object');
      expect(res.body.income.total.amount).equals(2000);
      expect(res.body.income.total.formatted_amount).equals(2000);
      expect(res.body.income.total.date).equals('2021-01-01');
    });

    it('Should retrieve debit sumation of expenses accounts.', async () => {
      const res = await request()
        .get('/api/financial_statements/profit_loss_sheet')
        .set('x-access-token', loginRes.body.token)
        .query({
          from_date: '2020-01-01',
          to_date: '2021-01-01',
        })
        .send();

      expect(res.body.expenses.total).to.be.an('object');
      expect(res.body.expenses.total.amount).equals(6000);
      expect(res.body.expenses.total.formatted_amount).equals(6000);
      expect(res.body.expenses.total.date).equals('2021-01-01');
    });

    it('Should retrieve credit total of income accounts with `date_periods` columns between the given date range.', async () => {
      const res = await request()
        .get('/api/financial_statements/profit_loss_sheet')
        .set('x-access-token', loginRes.body.token)
        .query({
          from_date: '2019-12-01',
          to_date: '2020-12-01',
          display_columns_type: 'date_periods',
          display_columns_by: 'month',
        })
        .send();

      expect(res.body.income.total_periods[0].amount).equals(0);
      expect(res.body.income.total_periods[1].amount).equals(2000);
      expect(res.body.income.total_periods[2].amount).equals(2000);
    });

    it('Should retrieve debit total of expenses accounts with `date_periods` columns between the given date range.', async () => {
      const res = await request()
        .get('/api/financial_statements/profit_loss_sheet')
        .set('x-access-token', loginRes.body.token)
        .query({
          from_date: '2019-12-01',
          to_date: '2020-12-01',
          display_columns_type: 'date_periods',
          display_columns_by: 'month',
        })
        .send();

      expect(res.body.expenses.total_periods[0].amount).equals(0);
      expect(res.body.expenses.total_periods[1].amount).equals(6000);
      expect(res.body.expenses.total_periods[2].amount).equals(6000);
    });

    it('Should retrieve total net income with `total column display between the given date range.', async () => {
      const res = await request()
        .get('/api/financial_statements/profit_loss_sheet')
        .set('x-access-token', loginRes.body.token)
        .query({
          from_date: '2019-12-01',
          to_date: '2020-12-01',
          display_columns_type: 'total',
        })
        .send();

      expect(res.body.net_income.total.amount).equals(-4000);
      expect(res.body.net_income.total.formatted_amount).equals(-4000);
      expect(res.body.net_income.total.date).equals('2020-12-01');
    });

    it('Should retrieve total net income with `date_periods` columns between the given date range.', async () => {
      const res = await request()
        .get('/api/financial_statements/profit_loss_sheet')
        .set('x-access-token', loginRes.body.token)
        .query({
          from_date: '2019-12-01',
          to_date: '2020-12-01',
          display_columns_type: 'date_periods',
          display_columns_by: 'quarter',
        })
        .send();

      expect(res.body.net_income.total_periods.length).equals(5);
      expect(res.body.net_income.total_periods[0].amount).equals(0);
      expect(res.body.net_income.total_periods[0].formatted_amount).equal(0);
      expect(res.body.net_income.total_periods[0].date).equals('2019-12');

      expect(res.body.net_income.total_periods[1].amount).equals(-4000);
      expect(res.body.net_income.total_periods[1].formatted_amount).equal(-4000);
      expect(res.body.net_income.total_periods[1].date).equals('2020-03');
    });

    it('Should not retrieve income or expenses accounts that has no transactions between the given date range in case none_zero equals true.', async () => {
      const res = await request()
        .get('/api/financial_statements/profit_loss_sheet')
        .set('x-access-token', loginRes.body.token)
        .query({
          from_date: '2020-01-01',
          to_date: '2021-01-01',
          display_columns_by: 'month',
          none_zero: true,
        })
        .send();

      expect(res.body.income.accounts.length).equals(1);
    });
  });
});
