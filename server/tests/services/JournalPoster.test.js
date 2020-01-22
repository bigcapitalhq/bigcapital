import { expect, create } from '~/testInit';
import JournalPoster from '@/services/Accounting/JournalPoster';
import JournalEntry from '@/services/Accounting/JournalEntry';
import AccountBalance from '@/models/AccountBalance';
import AccountTransaction from '@/models/AccountTransaction';

describe('JournalPoster', () => {
  describe('credit()', () => {
    it('Should write credit entry to journal entries stack.', () => {
      const journalEntries = new JournalPoster();
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
      const journalEntries = new JournalPoster();
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
      const journalEntries = new JournalPoster();
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

    it('Should decrement balance amount after debit entry wiht debit normal account.', () => {
      const journalEntries = new JournalPoster();
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

  describe('saveEntries()', () => {
    it('Should save all stacked entries to the storage.', async () => {
      const journalEntries = new JournalPoster();
      const journalEntry = new JournalEntry({
        referenceId: 1,
        referenceType: 'Expense',
        debit: 100,
        account: 1,
        accountNormal: 'debit',
      });

      journalEntries.debit(journalEntry);
      await journalEntries.saveEntries();

      const storedJournalEntries = await AccountTransaction.query();

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
      const account = await create('account');

      const journalEntries = new JournalPoster();
      const journalEntry = new JournalEntry({
        referenceId: 1,
        referenceType: 'Expense',
        debit: 100,
        account: account.id,
        accountNormal: 'debit',
      });
      journalEntries.debit(journalEntry);

      await journalEntries.saveBalance();

      const storedAccountBalance = await AccountBalance.query();

      expect(storedAccountBalance.length).equals(1);
      expect(storedAccountBalance[0].amount).equals(100);
    });

    it('Should save account balance decrement.', async () => {
      const account = await create('account');

      const journalEntries = new JournalPoster();
      const journalEntry = new JournalEntry({
        referenceId: 1,
        referenceType: 'Expense',
        credit: 100,
        account: account.id,
        accountNormal: 'debit',
      });
      journalEntries.credit(journalEntry);

      await journalEntries.saveBalance();

      const storedAccountBalance = await AccountBalance.query();

      expect(storedAccountBalance.length).equals(1);
      expect(storedAccountBalance[0].amount).equals(-100);
    });
  });

  describe('getClosingBalance', () => {
    it('Should retrieve closing balance the given account id.', () => {
      const journalEntries = new JournalPoster();
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
      const journalEntries = new JournalPoster();
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
      const journalEntries = new JournalPoster();
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

  describe('deleteEntries', () => {

  });

  describe('reverseEntries()', () => {

  });

  describe('loadFromCollection', () => {

  });
});
