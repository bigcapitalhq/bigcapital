import { AccountsData } from '@/database/tenant/seeds/data/accounts';
import { toExistingAccounts } from './AccountsTemplateState.service';
import { getSeededAccountDefaults } from './AccountsTemplates.seed';
import { AccountRow } from './AccountsTemplates.types';

const row = (id: number, fields: Partial<AccountRow>) =>
  ({
    id,
    currencyCode: 'USD',
    accountType: 'expense',
    predefined: false,
    seededAt: null,
    ...fields,
  }) as AccountRow;

const seededRows = (seededAt: string | null) =>
  AccountsData.map((account, index) =>
    row(index + 1, {
      name: account.name,
      slug: account.slug,
      code: account.code,
      accountType: account.account_type,
      predefined: Boolean(account.predefined),
      seededAt,
    }),
  );

const seededFlags = (rows: AccountRow[]) =>
  new Map(
    toExistingAccounts(rows, getSeededAccountDefaults()).map((account) => [
      account.id,
      account.seeded,
    ]),
  );

describe('toExistingAccounts', () => {
  it('takes the seeded mark from seeded_at', () => {
    const rows = [
      ...seededRows('2026-01-01'),
      row(900, { name: 'Rent', slug: 'rent' }),
    ];
    const seeded = seededFlags(rows);

    expect(seeded.get(1)).toBe(true);
    expect(seeded.get(900)).toBe(false);
  });

  // Accounts seeded before the seeded_at column existed were never marked.
  describe('on a tenant created before seeded_at', () => {
    const rows = seededRows(null);
    const rent = rows.find((account) => account.slug === 'rent');
    const saving = rows.find(
      (account) => account.slug === 'saving-bank-account',
    );
    saving.name = 'Chase Savings 4411';

    const seeded = seededFlags([
      ...rows,
      row(900, { name: 'Travel', slug: 'travel' }),
    ]);

    it('takes an account still named as seeded as seeded', () => {
      expect(seeded.get(rent.id)).toBe(true);
    });

    it('does not take a renamed account as seeded', () => {
      expect(seeded.get(saving.id)).toBe(false);
    });

    it("does not take the user's own account as seeded", () => {
      expect(seeded.get(900)).toBe(false);
    });
  });
});
