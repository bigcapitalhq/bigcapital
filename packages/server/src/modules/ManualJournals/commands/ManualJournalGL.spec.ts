import { AccountNormal } from '@/modules/Accounts/Accounts.types';
import { ManualJournalGL } from './ManualJournalGL';

const buildManualJournal = (overrides: Record<string, any> = {}) =>
  ({
    id: 1,
    exchangeRate: 1,
    currencyCode: 'USD',
    userId: 1,
    journalNumber: 'MJ-100',
    reference: 'REF-1',
    date: '2023-01-01',
    createdAt: new Date('2023-01-01'),
    branchId: 1,
    entries: [
      {
        id: 1,
        index: 1,
        debit: 1000,
        credit: 0,
        accountId: 10,
        account: { accountNormal: AccountNormal.DEBIT },
      },
      {
        id: 2,
        index: 2,
        debit: 0,
        credit: 1000,
        accountId: 20,
        account: { accountNormal: AccountNormal.CREDIT },
      },
    ],
    ...overrides,
  }) as any;

const buildLedger = (manualJournal: any) =>
  new ManualJournalGL(manualJournal).getManualJournalGLedger();

describe('ManualJournalGL', () => {
  it('keeps the entries amounts when the journal currency is the base currency', () => {
    const ledger = buildLedger(buildManualJournal());

    const entries = ledger.getEntries();
    const debitEntry = entries.find((entry) => entry.accountId === 10);
    const creditEntry = entries.find((entry) => entry.accountId === 20);

    expect(debitEntry.debit).toBe(1000);
    expect(debitEntry.credit).toBe(0);
    expect(creditEntry.debit).toBe(0);
    expect(creditEntry.credit).toBe(1000);
  });

  it('converts the debit and credit entries to the base currency by the exchange rate', () => {
    const ledger = buildLedger(buildManualJournal({ exchangeRate: 2 }));

    const entries = ledger.getEntries();
    const debitEntry = entries.find((entry) => entry.accountId === 10);
    const creditEntry = entries.find((entry) => entry.accountId === 20);

    expect(debitEntry.debit).toBe(2000);
    expect(creditEntry.credit).toBe(2000);
  });

  it('keeps the closing balance of the ledger equals zero after conversion', () => {
    const ledger = buildLedger(buildManualJournal({ exchangeRate: 3.5 }));

    expect(ledger.getClosingDebit()).toBe(3500);
    expect(ledger.getClosingCredit()).toBe(3500);
  });

  it('treats a missing exchange rate as one', () => {
    const ledger = buildLedger(
      buildManualJournal({ exchangeRate: null, currencyCode: 'USD' }),
    );

    const entry = ledger.getEntries().find((e) => e.accountId === 10);

    expect(entry.debit).toBe(1000);
  });

  it('keeps the currency code and exchange rate on the entries', () => {
    const ledger = buildLedger(
      buildManualJournal({ exchangeRate: 2, currencyCode: 'EUR' }),
    );

    const entry = ledger.getEntries().find((e) => e.accountId === 10);

    expect(entry.currencyCode).toBe('EUR');
    expect(entry.exchangeRate).toBe(2);
  });
});
