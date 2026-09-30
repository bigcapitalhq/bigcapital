import {
  AccountsData,
  StripeClearingAccount,
} from '@/database/tenant/seeds/data/accounts';
import {
  AccountsTemplateExistingAccount,
  AccountsTemplatePlannerContext,
} from './AccountsTemplates.types';

const normalize = (value: string | null | undefined) =>
  (value ?? '').trim().toLowerCase();

const includes = (values: string[], value: string | null) =>
  values.some((candidate) => normalize(candidate) === normalize(value));

/**
 * Codes, names and descriptions each slug is seeded with, read from the tenant
 * seed itself so the two cannot drift apart.
 */
export function getSeededAccountDefaults(): AccountsTemplatePlannerContext['seededDefaults'] {
  const defaults: AccountsTemplatePlannerContext['seededDefaults'] = {};

  [...AccountsData, StripeClearingAccount].forEach((account) => {
    const entry = (defaults[account.slug] ??= {
      codes: [],
      names: [],
      descriptions: [],
    });
    entry.codes.push(account.code);
    entry.names.push(account.name);

    if (account.description) {
      entry.descriptions.push(account.description);
    }
  });
  return defaults;
}

/**
 * Whether the account carries a seeded slug under the name it was seeded with.
 * @param {AccountsTemplateExistingAccount} account
 * @param {AccountsTemplatePlannerContext['seededDefaults']} defaults
 */
export function hasSeededName(
  account: Pick<AccountsTemplateExistingAccount, 'slug' | 'name'>,
  defaults: AccountsTemplatePlannerContext['seededDefaults'],
): boolean {
  const seeded = account.slug ? defaults[account.slug] : undefined;

  return Boolean(seeded) && includes(seeded.names, account.name);
}

/**
 * Whether the account still has the code, name and description it was seeded
 * with, that is, the user has not edited it.
 * @param {AccountsTemplateExistingAccount} account
 * @param {AccountsTemplatePlannerContext['seededDefaults']} defaults
 */
export function isAsSeeded(
  account: Pick<
    AccountsTemplateExistingAccount,
    'slug' | 'code' | 'name' | 'description'
  >,
  defaults: AccountsTemplatePlannerContext['seededDefaults'],
): boolean {
  const seeded = account.slug ? defaults[account.slug] : undefined;

  return (
    hasSeededName(account, defaults) &&
    includes(seeded.codes, account.code) &&
    (!account.description || includes(seeded.descriptions, account.description))
  );
}
