import { expect } from '~/testInit';
import JournalPoster from '@/services/Accounting/JournalPoster';
import JournalEntry from '@/services/Accounting/JournalEntry';
import AccountBalance from 'models/AccountBalance';
import AccountTransaction from 'models/AccountTransaction';
import Account from 'models/Account';
import {
  tenantWebsite,
  tenantFactory,
  loginRes
} from '~/dbInit';
import { omit } from 'lodash';
import DependencyGraph from '@/lib/DependencyGraph';

let accountsDepGraph;

describe('JournalPoster', () => {
  beforeEach(async () => {
    accountsDepGraph = await Account.tenant().depGraph().query().remember();
  });
  describe('credit()', () => {
    it('Should write credit entry to journal entries stack.', () => {
      const journalEntries = new JournalPoster(accountsDepGraph);
      const journalEntry = new JournalEntry({
        referenceId: 1,
        referenceType: 'Expense',
        credit: 100,
        account: 1,
      });
      journalEntries.credit(journalEntry);
      expect(journalEntries.entries.length).equals(1);
    });
  });

  describe('debit()', () => {
    it('Should write debit entry to journal entries stack.', () => {
      const journalEntries = new JournalPoster(accountsDepGraph);
      const journalEntry = new JournalEntry({
        referenceId: 1,
        referenceType: 'Expense',
        debit: 100,
        account: 1,
      });

      journalEntries.debit(journalEntry);
      expect(journalEntries.entries.length).equals(1);
    });
  });

  describe('setBalanceChange()', () => {
    it('Should increment balance amount after credit entry with credit normal account.', () => {
      const journalEntries = new JournalPoster(accountsDepGraph);
      const journalEntry = new JournalEntry({
        referenceId: 1,
        referenceType: 'Expense',
        credit: 100,
        debit: 0,
        account: 1,
        accountNormal: 'debit',
      });
      journalEntries.credit(journalEntry);
      expect(journalEntries.balancesChange).to.have.property(1, -100);
    });

    it('Should decrement balance amount after debit entry with debit normal account.', () => {
      const journalEntries = new JournalPoster(accountsDepGraph);
      const journalEntry = new JournalEntry({
        referenceId: 1,
        referenceType: 'Expense',
        debit: 100,
        account: 1,
        accountNormal: 'debit',
      });
      journalEntries.debit(journalEntry);
      expect(journalEntries.balancesChange).to.have.property(1, 100);
    });
  });

  describe('setContactAccountBalance', () => {
    it('Should increment balance amount after credit/debit entry.', () => {

    });

    it('Should decrement balance amount after credit/debit customer/vendor entry.', () => {
      
    });
  });

  describe('saveEntries()', () => {
    it('Should save all stacked entries to the storage.', async () => {
      const journalEntries = new JournalPoster(accountsDepGraph);
      const journalEntry = new JournalEntry({
        referenceId: 1,
        referenceType: 'Expense',
        debit: 100,
        account: 1,
        accountNormal: 'debit',
      });

      journalEntries.debit(journalEntry);
      await journalEntries.saveEntries();

      const storedJournalEntries = await AccountTransaction.tenant().query();

      expect(storedJournalEntries.length).equals(1);
      expect(storedJournalEntries[0]).to.deep.include({
        referenceType: 'Expense',
        referenceId: 1,
        debit: 100,
        credit: 0,
        accountId: 1,
      });
    });
  });

  describe('saveBalance()', () => {
    it('Should save account balance increment.', async () => {
      const account = await tenantFactory.create('account');
      const depGraph = await Account.tenant().depGraph().query();

      const journalEntries = new JournalPoster(depGraph);
      const journalEntry = new JournalEntry({
        referenceId: 1,
        referenceType: 'Expense',
        debit: 100,
        account: account.id,
        accountNormal: 'debit',
      });
      journalEntries.debit(journalEntry);

      await journalEntries.saveBalance();

      const storedAccountBalance = await AccountBalance.tenant().query();

      expect(storedAccountBalance.length).equals(1);
      expect(storedAccountBalance[0].amount).equals(100);
    });

    it('Should save account balance decrement.', async () => {
      const account = await tenantFactory.create('account');
      const depGraph = await Account.tenant().depGraph().query();

      const journalEntries = new JournalPoster(depGraph);
      const journalEntry = new JournalEntry({
        referenceId: 1,
        referenceType: 'Expense',
        credit: 100,
        account: account.id,
        accountNormal: 'debit',
      });
      journalEntries.credit(journalEntry);

      await journalEntries.saveBalance();

      const storedAccountBalance = await AccountBalance.tenant().query();

      expect(storedAccountBalance.length).equals(1);
      expect(storedAccountBalance[0].amount).equals(-100);
    });
  });

  describe('getClosingBalance', () => {
    it('Should retrieve closing balance the given account id.', () => {
      const journalEntries = new JournalPoster(accountsDepGraph);
      const journalEntry = new JournalEntry({
        referenceId: 1,
        referenceType: 'Expense',
        debit: 100,
        account: 1,
        accountNormal: 'debit',
        date: '2020-1-10',
      });
      const journalEntry2 = new JournalEntry({
        referenceId: 1,
        referenceType: 'Income',
        credit: 100,
        account: 2,
        accountNormal: 'credit',
        date: '2020-1-12',
      });
      journalEntries.credit(journalEntry);
      journalEntries.credit(journalEntry2);

      const closingBalance = journalEntries.getClosingBalance(1, '2020-1-30');
      expect(closingBalance).equals(100);
    });

    it('Should retrieve closing balance the given closing date period.', () => {
      const journalEntries = new JournalPoster(accountsDepGraph);
      const journalEntry = new JournalEntry({
        referenceId: 1,
        referenceType: 'Expense',
        debit: 100,
        account: 1,
        accountNormal: 'debit',
        date: '2020-1-10',
      });
      const journalEntry2 = new JournalEntry({
        referenceId: 1,
        referenceType: 'Income',
        credit: 100,
        account: 2,
        accountNormal: 'credit',
        date: '2020-1-12',
      });
      journalEntries.credit(journalEntry);
      journalEntries.credit(journalEntry2);

      const closingBalance = journalEntries.getClosingBalance(1, '2020-1-2');
      expect(closingBalance).equals(0);
    });
  });

  describe('getTrialBalance(account, closeDate, dateType)', () => {
    it('Should retrieve the trial balance of the given account id.', () => {
      const journalEntries = new JournalPoster(accountsDepGraph);
      const journalEntry = new JournalEntry({
        referenceId: 1,
        referenceType: 'Expense',
        debit: 200,
        account: 1,
        accountNormal: 'debit',
        date: '2020-1-10',
      });
      const journalEntry2 = new JournalEntry({
        referenceId: 1,
        referenceType: 'Income',
        credit: 100,
        account: 1,
        accountNormal: 'credit',
        date: '2020-1-12',
      });

      journalEntries.debit(journalEntry);
      journalEntries.credit(journalEntry2);

      const trialBalance = journalEntries.getTrialBalance(1);

      expect(trialBalance.credit).equals(100);
      expect(trialBalance.debit).equals(200);
    });
  });

  describe('groupingEntriesByDate(accountId, dateGroupType)', () => {

  });

  describe('removeEntries', () => {
    it('Should remove all entries in the collection.', () => {
      const journalPoster = new JournalPoster(accountsDepGraph);
      const journalEntry1 = new JournalEntry({
        id: 1,
        credit: 1000,
        account: 1,
        accountNormal: 'credit',
      });
      const journalEntry2 = new JournalEntry({
        id: 2,
        debit: 1000,
        account: 2,
        accountNormal: 'debit',
      });
      journalPoster.credit(journalEntry1);
      journalPoster.debit(journalEntry2);

      journalPoster.removeEntries();

      expect(journalPoster.entries.length).equals(0);
    });

    it('Should remove the given entries ids from the collection.', () => {
      const journalPoster = new JournalPoster(accountsDepGraph);
      const journalEntry1 = new JournalEntry({
        id: 1,
        credit: 1000,
        account: 1,
        accountNormal: 'credit',
      });
      const journalEntry2 = new JournalEntry({
        id: 2,
        debit: 1000,
        account: 2,
        accountNormal: 'debit',
      });
      journalPoster.credit(journalEntry1);
      journalPoster.debit(journalEntry2);

      journalPoster.removeEntries([1]);
      expect(journalPoster.entries.length).equals(1);
    });

    it('Should the removed entries ids be stacked to deleted entries ids.', () => {
      const journalPoster = new JournalPoster(accountsDepGraph);
      const journalEntry1 = new JournalEntry({
        id: 1,
        credit: 1000,
        account: 1,
        accountNormal: 'credit',
      });
      const journalEntry2 = new JournalEntry({
        id: 2,
        debit: 1000,
        account: 2,
        accountNormal: 'debit',
      });
      journalPoster.credit(journalEntry1);
      journalPoster.debit(journalEntry2);

      journalPoster.removeEntries();

      expect(journalPoster.deletedEntriesIds.length).equals(2);
      expect(journalPoster.deletedEntriesIds[0]).equals(1);
      expect(journalPoster.deletedEntriesIds[1]).equals(2);
    });

    it('Should revert the account balance after remove the entries.', () => {
      const journalPoster = new JournalPoster(accountsDepGraph);
      const journalEntry1 = new JournalEntry({
        id: 1,
        credit: 1000,
        account: 1,
        accountNormal: 'credit',
      });
      const journalEntry2 = new JournalEntry({
        id: 2,
        debit: 1000,
        account: 2,
        accountNormal: 'debit',
      });
      journalPoster.credit(journalEntry1);
      journalPoster.debit(journalEntry2);

      journalPoster.removeEntries([1]);

      expect(journalPoster.balancesChange['1']).equals(0);
      expect(journalPoster.balancesChange['2']).equals(1000);
    })
  });

  describe('deleteEntries', () => {
    it('Should delete all entries from the storage based on the stacked deleted entries ids.', () => {

    });
  });

  describe('effectParentAccountsBalance()', () => {
    it('Should all parent accounts increment after one of child accounts balance increment.', async () => {
      const debitType = await tenantFactory.create('account_type', { normal: 'debit', balance_sheet: true });
      const mixin = { account_type_id: debitType.id };

      const accountA = await tenantFactory.create('account', { ...mixin });
      const accountB = await tenantFactory.create('account', { ...mixin });

      const accountAC = await tenantFactory.create('account', { parent_account_id: accountA.id, ...mixin });
      const accountBD = await tenantFactory.create('account', { ...mixin });

      const depGraph = await Account.tenant().depGraph().query();
      const journalPoster = new JournalPoster(depGraph);
      const journalEntryA = new JournalEntry({
        id: 1,
        debit: 1000,
        account: accountAC.id,
        accountNormal: 'debit',
      });
      const journalEntryB = new JournalEntry({
        id: 1,
        debit: 1000,
        account: accountBD.id,
        accountNormal: 'debit',
      });

      journalPoster.debit(journalEntryA);
      journalPoster.debit(journalEntryB);
      
      await journalPoster.saveBalance();

      const accountBalances = await AccountBalance.tenant().query();
      const simplifiedArray = accountBalances.map(x => ({ ...omit(x, ['id']) }));

      expect(simplifiedArray.length).equals(3);
      expect(simplifiedArray).to.include.something.deep.equals({
        accountId: accountA.id,
        amount: 1000,
        currencyCode: 'USD'
      });
      expect(simplifiedArray).to.include.something.deep.equals({
        accountId: accountAC.id,
        amount: 1000,
        currencyCode: 'USD'
      });      
      expect(simplifiedArray).to.include.something.deep.equals({
        accountId: accountBD.id,
        amount: 1000,
        currencyCode: 'USD'
      });
    });
  });

  describe('reverseEntries()', () => {

  });

  describe('loadFromCollection', () => {

  });
});
