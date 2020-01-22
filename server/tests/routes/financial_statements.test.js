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
  describe('routes: `/financial_statements/ledger`', () => {
    it('Should response unauthorized in case the user was not authorized.', async () => {
      const res = await request()
        .get('/api/financial_statements/ledger')
        .send();

      expect(res.status).equals(400);
    });

    it('Should retrieve ledger transactions grouped by accounts.', async () => {
      const res = await request()
        .get('/api/financial_statements/ledger')
        .set('x-access-token', loginRes.body.token)
        .send();

      expect(res.status).equals(200);
      expect(res.body.items.length).to.be.at.least(1);

      expect(res.body.items[0]).to.have.property('id');
      expect(res.body.items[0]).to.have.property('referenceType');
      expect(res.body.items[0]).to.have.property('referenceId');
      expect(res.body.items[0]).to.have.property('date');
      expect(res.body.items[0]).to.have.property('account');
      expect(res.body.items[0]).to.have.property('note');
    });

    it('Should retrieve transactions between date range.', async () => {
      const res = await request()
        .get('/api/financial_statements/ledger')
        .set('x-access-token', loginRes.body.token)
        .query({
          from_date: '2018-01-01',
          to_date: '2019-01-01',
        })
        .send();

      expect(res.body.items.length).equals(0);
    });

    it('Should retrieve transactions that associated to the queried accounts.', async () => {
      const res = await request()
        .get('/api/financial_statements/ledger')
        .set('x-access-token', loginRes.body.token)
        .query({
          account_ids: [creditAccount.id, debitAccount.id],
        })
        .send();

      expect(res.body.items.length).equals(4);
    });

    it('Should retrieve tranasactions with the given types.', async () => {
      const res = await request()
        .get('/api/financial_statements/ledger')
        .set('x-access-token', loginRes.body.token)
        .query({
          transaction_types: ['Expense'],
        });

      expect(res.body.items.length).equals(1);
    });

    it('Should retrieve transactions with range amount.', async () => {
      const res = await request()
        .get('/api/financial_statements/ledger')
        .set('x-access-token', loginRes.body.token)
        .query({
          from_range: 1000,
          to_range: 2000,
        });
    });

    it('Should format credit and debit to no cents of retrieved transactions.', async () => {

    });

    it('Should divide credit/debit amount on 1000', async () => {
      const res = await request()
        .get('/api/financial_statements/ledger')
        .set('x-access-token', loginRes.body.token)
        .query({
          number_format: {
            divide_1000: true,
          },
        })
        .send();

      res.body.items.forEach((item) => {
        expect(item.credit).to.be.at.most(100);
        expect(item.debit).to.be.at.most(100);
      });
    });
  });

  describe('routes: `/financial_statements/general_ledger`', () => {
    it('Should response unauthorized in case the user was not authorized.', async () => {
      const res = await request()
        .get('/api/financial_statements/general_ledger')
        .send();

      expect(res.status).equals(400);
    });

    it('Should retrieve the genereal ledger transactions.', async () => {
      const res = await request()
        .get('/api/financial_statements/general_ledger')
        .set('x-access-token', loginRes.body.token)
        .send();

      expect(res.body.items).to.be.a('array');
      expect(res.body.items.length).equals(4);
    });

    it('Should retrieve opeing and closing balance in each account.', async () => {
      const res = await request()
        .get('/api/financial_statements/general_ledger')
        .set('x-access-token', loginRes.body.token)
        .send();

      const foundCreditAccount = res.body.items.find((a) => a.id === creditAccount.id);

      expect(foundCreditAccount.closing.balance).equals(2000);
      expect(foundCreditAccount.opening.balance).equals(0);
    });

    it('Should retrieve the general ledger transactions between date range.', async () => {
      const res = await request()
        .get('/api/financial_statements/general_ledger')
        .set('x-access-token', loginRes.body.token)
        .query({
          from_date: '2020-04-04',
          to_date: '2020-05-05',
        })
        .send();
      
      const foundCreditAccount = res.body.items.find((a) => a.id === creditAccount.id);
      expect(foundCreditAccount.transactions.length).equals(0);
    });

    it('Should retrieve the general ledger transactions with no cents numbers.', () => {

    });

    it('Should retrieve the transacvtions divided on 1000.', () => {

    });
  });

  describe('routes: `financial_statements/balance_sheet`', () => {
    it('Should response unauthorzied in case the user was not authorized.', async () => {
      const res = await request()
        .get('/api/financial_statements/balance_sheet')
        .send();

      expect(res.status).equals(401);
    });

    it('Should retrieve the asset accounts balance.', async () => {
      const res = await request()
        .get('/api/financial_statements/balance_sheet')
        .set('x-access-token', loginRes.body.token)
        .query({
          display_columns_by: 'year',
        })
        .send();

      expect(res.body.balance_sheet.assets).to.be.a('array');
      expect(res.body.balance_sheet.liabilities_equity).to.be.a('array');
    });

    it('Should retrieve asset/liabilities balance sheet between the given date range.', async () => {
      const res = await request()
        .get('/api/financial_statements/balance_sheet')
        .set('x-access-token', loginRes.body.token)
        .query({
          display_columns_by: 'year',
          from_date: '2012-01-01',
          to_date: '2018-02-02',
        })
        .send();

      const { balance_sheet: balanceSheet } = res.body;
      const foundCreditAccount = balanceSheet.assets.find((account) => {
        return account.id === debitAccount.id;
      });

      expect(foundCreditAccount.transactions.length).equals(6);
      foundCreditAccount.transactions.forEach((transaction) => {
        expect(transaction.balance).equals(0);
      });

      const foundDebitAccount = balanceSheet.liabilities_equity.find((account) => {
        return account.id === creditAccount.id;
      });

      expect(foundDebitAccount.transactions.length).equals(6);
      foundDebitAccount.transactions.forEach((transaction) => {
        expect(transaction.balance).equals(0);
      });
    });

    it('Should retrieve balance sheet with display columns day.', async () => {
      const res = await request()
        .get('/api/financial_statements/balance_sheet')
        .set('x-access-token', loginRes.body.token)
        .query({
          display_columns_by: 'day',
          from_date: '2020-03-01',
          to_date: '2020-04-01',
        })
        .send();

      const { balance_sheet: balanceSheet } = res.body;

      const foundDebitAccount = balanceSheet.assets.find((account) => {
        return account.id === debitAccount.id;
      });
      const foundCreditAccount = balanceSheet.liabilities_equity.find((account) => {
        return account.id === creditAccount.id;
      });

      expect(foundDebitAccount.transactions.length).equals(31);
      expect(foundCreditAccount.transactions.length).equals(31);

      foundDebitAccount.transactions.forEach((transaction) => {
        expect(transaction.balance).equals(4000);
      });
      foundCreditAccount.transactions.forEach((transaction) => {
        expect(transaction.balance).equals(2000);
      });
    });

    it('Should retrieve the balance sheet with display columns month.', async () => {
      const res = await request()
        .get('/api/financial_statements/balance_sheet')
        .set('x-access-token', loginRes.body.token)
        .query({
          display_columns_by: 'month',
          from_date: '2020',
          to_date: '2021',
        })
        .send();

      const { balance_sheet: balanceSheet } = res.body;

      const foundDebitAccount = balanceSheet.assets.find((account) => {
        return account.id === debitAccount.id;
      });
      const foundCreditAccount = balanceSheet.liabilities_equity.find((account) => {
        return account.id === creditAccount.id;
      });

      expect(foundDebitAccount.transactions.length).equals(12);
      expect(foundCreditAccount.transactions.length).equals(12);

      foundDebitAccount.transactions.forEach((transaction) => {
        expect(transaction.balance).equals(4000);
      });
      foundCreditAccount.transactions.forEach((transaction) => {
        expect(transaction.balance).equals(2000);
      });
    });

    it('Should retrieve the balance sheet with display columns quarter.', async () => {
      const res = await request()
        .get('/api/financial_statements/balance_sheet')
        .set('x-access-token', loginRes.body.token)
        .query({
          display_columns_by: 'quarter',
          from_date: '2020',
          to_date: '2021',
        })
        .send();

      const { balance_sheet: balanceSheet } = res.body;

      const foundDebitAccount = balanceSheet.assets.find((account) => {
        return account.id === debitAccount.id;
      });
      const foundCreditAccount = balanceSheet.liabilities_equity.find((account) => {
        return account.id === creditAccount.id;
      });

      expect(foundDebitAccount.transactions.length).equals(4);
      expect(foundCreditAccount.transactions.length).equals(4);

      foundDebitAccount.transactions.forEach((transaction) => {
        expect(transaction.balance).equals(4000);
      });
      foundCreditAccount.transactions.forEach((transaction) => {
        expect(transaction.balance).equals(2000);
      });
    });

    it('Should retrieve the balance sheet amounts without cents.', () => {
      
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

      const { balance_sheet: balanceSheet } = res.body;
      const foundDebitAccount = balanceSheet.assets.find((account) => {
        return account.id === debitAccount.id;
      });
      const foundCreditAccount = balanceSheet.liabilities_equity.find((account) => {
        return account.id === creditAccount.id;
      });

      expect(foundDebitAccount.transactions.length).equals(4);
      expect(foundCreditAccount.transactions.length).equals(4);

      foundDebitAccount.transactions.forEach((transaction) => {
        expect(transaction.balance).equals(4);
      });
      foundCreditAccount.transactions.forEach((transaction) => {
        expect(transaction.balance).equals(2);
      });
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

      const { balance_sheet: balanceSheet } = res.body;
      const foundDebitAccount = balanceSheet.assets.find((account) => {
        return account.id === debitAccount.id;
      });

      const foundCreditAccount = balanceSheet.liabilities_equity.find((account) => {
        return account.id === creditAccount.id;
      });
      expect(foundDebitAccount).equals(undefined);
      expect(foundCreditAccount).equals(undefined);
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
        })
        .send();

      res.body.items.forEach((item) => {
        expect(item.credit).equals(0);
        expect(item.debit).equals(0);
        expect(item.balance).equals(0);
      });
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
  });

  describe('routes: `/api/financial_statements/profit_loss_sheet`', () => {
    it('Should response unauthorized in case the user was not authorized.', async () => {
      const res = await request()
        .get('/api/financial_statements/profit_loos_sheet')
        .send();

      expect(res.status).equals(401);
      expect(res.body.message).equals('unauthorzied');
    });

    it('Should retrieve credit sumation of income accounts.', async () => {
      const res = await request()
        .get('/api/financial_statements/profit_loss_sheet')
        .set('x-access-token', loginRes.body.token)
        .query({
          from_date: '2020-01-01',
          to_date: '2021-01-01',
          number_format: {
            divide_1000: true,
          },
        })
        .send();

      res.body.income.accounts[0].dates.forEach((item) => {
        expect(item.rawAmount).equals(2000);
      });
    });

    it('Should retrieve debit sumation of expenses accounts.', async () => {
      const res = await request()
        .get('/api/financial_statements/profit_loss_sheet')
        .set('x-access-token', loginRes.body.token)
        .query({
          from_date: '2020-01-01',
          to_date: '2021-01-01',
          number_format: {
            divide_1000: true,
          },
        })
        .send();

      res.body.expenses.accounts[0].dates.forEach((item) => {
        expect(item.rawAmount).equals(4000);
      });
    });

    it('Should retrieve credit sumation of income accounts between the given date range.', async () => {
      const res = await request()
        .get('/api/financial_statements/profit_loss_sheet')
        .set('x-access-token', loginRes.body.token)
        .query({
          from_date: '2020-01-01',
          to_date: '2021-01-01',
          display_columns_by: 'month',
          number_format: {
            divide_1000: true,
          },
        })
        .send();

      expect(res.body.income.accounts[0].dates.length).equals(12);
    });

    it('Should retrieve debit sumation of expenses accounts between the given date range.', async () => {
      const res = await request()
        .get('/api/financial_statements/profit_loss_sheet')
        .set('x-access-token', loginRes.body.token)
        .query({
          from_date: '2020-01-01',
          to_date: '2021-01-01',
          display_columns_by: 'month',
          number_format: {
            divide_1000: true,
          },
        })
        .send();

      expect(res.body.expenses.accounts[0].dates.length).equals(12);
    });

    it('Should retrieve total income of income accounts between the given date range.', async () => {
      const res = await request()
        .get('/api/financial_statements/profit_loss_sheet')
        .set('x-access-token', loginRes.body.token)
        .query({
          from_date: '2020-01-01',
          to_date: '2021-01-01',
          display_columns_by: 'month',
        })
        .send();

      expect(res.body.total_income[0].rawAmount).equals(2000);
    });

    it('Should retrieve total expenses of expenses accounts between the given date range.', async () => {
      const res = await request()
        .get('/api/financial_statements/profit_loss_sheet')
        .set('x-access-token', loginRes.body.token)
        .query({
          from_date: '2020-01-01',
          to_date: '2021-01-01',
          display_columns_by: 'month',
        })
        .send();

      expect(res.body.total_expenses[0].rawAmount).equals(6000);
    });

    it('Should retrieve total net income between the given date range.', async () => {
      const res = await request()
        .get('/api/financial_statements/profit_loss_sheet')
        .set('x-access-token', loginRes.body.token)
        .query({
          from_date: '2020-01-01',
          to_date: '2021-01-01',
          display_columns_by: 'month',
        })
        .send();

      expect(res.body.total_net_income[0].rawAmount).equals(-4000);
    });

    it('Should not retrieve income or expenses accounts that has no transactions between the given date range in case none_zero equals true.', async () => {
      const res = await request()
        .get('/api/financial_statements/profit_loss_sheet')
        .set('x-access-token', loginRes.body.token)
        .query({
          from_date: '2020-01-01',
          to_date: '2021-01-01',
          display_columns_by: 'month',
          none_zero: true
        })
        .send();

      expect(res.body.income.accounts.length).equals(1);
    });
  });
});
