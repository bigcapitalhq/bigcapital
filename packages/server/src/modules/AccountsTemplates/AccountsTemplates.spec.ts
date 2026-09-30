import {
  AccountsData,
  StripeClearingAccount,
} from '@/database/tenant/seeds/data/accounts';
import { AccountTypesUtils } from '@/libs/accounts-utils/AccountTypesUtils';
import { MAX_ACCOUNTS_CHART_DEPTH } from '../Accounts/constants';
import { resolveAccountsTemplate } from './AccountsTemplatePlanner';
import {
  ACCOUNT_CODE_MAX_LENGTH,
  ACCOUNT_CODE_MIN_LENGTH,
  PROTECTED_SLUGS,
} from './AccountsTemplates.constants';
import { ResolvedAccountsTemplate } from './AccountsTemplates.types';
import { ACCOUNTS_TEMPLATES } from './templates';

const seeded = [...AccountsData, StripeClearingAccount];
const seededTypeBySlug = new Map(
  seeded.map((account) => [account.slug, account.account_type]),
);
const predefinedSlugs = new Set(
  seeded.filter((account) => account.predefined).map((account) => account.slug),
);

// Every registered template, once per variant.
const cases: [string, ResolvedAccountsTemplate][] = ACCOUNTS_TEMPLATES.flatMap(
  (template) =>
    (template.variants?.length ? template.variants : [{ key: null }]).map(
      (variant): [string, ResolvedAccountsTemplate] => [
        `${template.key}${variant.key ? `:${variant.key}` : ''}`,
        resolveAccountsTemplate(template, variant.key),
      ],
    ),
);

const duplicates = (values: string[]) =>
  values.filter((value, index) => values.indexOf(value) !== index);

describe.each(cases)('accounts template %s', (_name, template) => {
  const { accounts } = template;

  it('uses each code once, 3 to 6 characters long', () => {
    expect(duplicates(accounts.map((account) => account.code))).toEqual([]);

    accounts.forEach((account) => {
      expect(account.code.length).toBeGreaterThanOrEqual(
        ACCOUNT_CODE_MIN_LENGTH,
      );
      expect(account.code.length).toBeLessThanOrEqual(ACCOUNT_CODE_MAX_LENGTH);
    });
  });

  it('uses each name once', () => {
    const names = accounts.map((account) => account.name.trim().toLowerCase());

    expect(duplicates(names)).toEqual([]);
  });

  it('uses only known account types', () => {
    const unknown = accounts.filter(
      (account) => !AccountTypesUtils.getType(account.accountType),
    );
    expect(unknown).toEqual([]);
  });

  it('gives slug entries the type the account is seeded with', () => {
    accounts
      .filter((account) => account.slug)
      .forEach((account) => {
        expect([account.slug, seededTypeBySlug.get(account.slug)]).toEqual([
          account.slug,
          account.accountType,
        ]);
      });
  });

  it('places every seeded account, or removes it', () => {
    const placed = new Set([
      ...accounts.map((account) => account.slug).filter(Boolean),
      ...template.remove,
    ]);
    const unplaced = AccountsData.map((account) => account.slug).filter(
      (slug) => !placed.has(slug),
    );
    expect(unplaced).toEqual([]);
  });

  it('never removes an account the application depends on', () => {
    const slugs = accounts.map((account) => account.slug).filter(Boolean);

    template.remove.forEach((slug) => {
      expect(PROTECTED_SLUGS).not.toContain(slug);
      expect(predefinedSlugs.has(slug)).toBe(false);
      expect(slugs).not.toContain(slug);
    });
  });

  it('nests accounts under a parent of the same type, within the depth limit', () => {
    const byCode = new Map(accounts.map((account) => [account.code, account]));

    accounts
      .filter((account) => account.parentCode)
      .forEach((account) => {
        const parent = byCode.get(account.parentCode);

        expect(parent).toBeDefined();
        expect(parent.accountType).toBe(account.accountType);

        let depth = 1;
        let current = parent;
        while (current?.parentCode) {
          depth += 1;
          current = byCode.get(current.parentCode);
        }
        expect(depth).toBeLessThan(MAX_ACCOUNTS_CHART_DEPTH);
      });
  });
});
