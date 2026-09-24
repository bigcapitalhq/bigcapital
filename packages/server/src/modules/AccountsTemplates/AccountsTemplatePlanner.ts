import { AccountTypesUtils } from '@/libs/accounts-utils/AccountTypesUtils';
import { isAsSeeded } from './AccountsTemplates.seed';
import {
  ACCOUNT_CODE_MAX_LENGTH,
  ACCOUNT_CODE_MIN_LENGTH,
  PROTECTED_SLUGS,
} from './AccountsTemplates.constants';
import {
  AccountsTemplate,
  AccountsTemplateAccount,
  AccountsTemplateChange,
  AccountsTemplateChangeAction,
  AccountsTemplateChangeSide,
  AccountsTemplateExistingAccount,
  AccountsTemplateIssue,
  AccountsTemplateIssueType,
  AccountsTemplatePlan,
  AccountsTemplatePlannerContext,
  ResolvedAccountsTemplate,
} from './AccountsTemplates.types';

const normalize = (value: string | null | undefined) =>
  (value ?? '').trim().toLowerCase();

const compareCodes = (a: string | null, b: string | null) =>
  (a ?? '').localeCompare(b ?? '', undefined, { numeric: true });

/**
 * Applies a variant to the template's accounts. Returns null when the variant
 * does not exist, or when one is required and none was given.
 * @param {AccountsTemplate} template
 * @param {string} variantKey
 */
export function resolveAccountsTemplate(
  template: AccountsTemplate,
  variantKey?: string | null,
): ResolvedAccountsTemplate | null {
  const variants = template.variants ?? [];
  const knownTexts = collectKnownTexts(template);

  if (variants.length === 0) {
    return variantKey
      ? null
      : {
          templateKey: template.key,
          variantKey: null,
          accounts: [...template.accounts],
          remove: [...(template.remove ?? [])],
          knownTexts,
        };
  }
  const variant = variantKey
    ? variants.find((v) => v.key === variantKey)
    : variants[0];

  if (!variant) return null;

  const accounts = [...template.accounts];

  variant.accounts.forEach((override) => {
    const index = accounts.findIndex((account) =>
      override.slug
        ? account.slug === override.slug
        : !account.slug && account.code === override.code,
    );
    if (index >= 0) {
      accounts[index] = override;
    } else {
      accounts.push(override);
    }
  });
  accounts.sort((a, b) => compareCodes(a.code, b.code));

  return {
    templateKey: template.key,
    variantKey: variant.key,
    accounts,
    remove: [...(template.remove ?? [])],
    knownTexts,
  };
}

const entryKey = (entry: AccountsTemplateAccount) =>
  entry.slug ? `slug:${entry.slug}` : `code:${entry.code}`;

/**
 * Collects the names and descriptions every variant gives each entry.
 * @param {AccountsTemplate} template
 */
function collectKnownTexts(
  template: AccountsTemplate,
): ResolvedAccountsTemplate['knownTexts'] {
  const known: ResolvedAccountsTemplate['knownTexts'] = {};

  [
    ...template.accounts,
    ...(template.variants ?? []).flatMap((variant) => variant.accounts),
  ].forEach((entry) => {
    const texts = (known[entryKey(entry)] ??= { names: [], descriptions: [] });

    texts.names.push(entry.name);

    if (entry.description) {
      texts.descriptions.push(entry.description);
    }
  });
  return known;
}

const includesText = (texts: string[] | undefined, value: string | null) =>
  (texts ?? []).some((text) => normalize(text) === normalize(value));

interface Resolution {
  entry: AccountsTemplateAccount;
  change: AccountsTemplateChange;
  account: AccountsTemplateExistingAccount | null;

  // Accounts the template owns are changed to match it; accounts the user
  // created that happen to match an entry are left exactly as they are.
  owned: boolean;
}

/**
 * Works out what applying the template to the given accounts would change.
 * Reads nothing and writes nothing: the same plan is shown as the preview and
 * then executed by the apply command.
 * @param {ResolvedAccountsTemplate} template
 * @param {AccountsTemplateExistingAccount[]} existing
 * @param {AccountsTemplatePlannerContext} context
 */
export function planAccountsTemplate(
  template: ResolvedAccountsTemplate,
  existing: AccountsTemplateExistingAccount[],
  context: AccountsTemplatePlannerContext,
): AccountsTemplatePlan {
  const warnings: AccountsTemplateIssue[] = [];
  const errors: AccountsTemplateIssue[] = [];
  const removals: AccountsTemplateChange[] = [];

  const byId = new Map(existing.map((account) => [account.id, account]));
  const removed = new Set<number>();
  const claimed = new Set<number>();
  const resolutions = new Map<string, Resolution>();

  const sideOf = (
    account: AccountsTemplateExistingAccount,
  ): AccountsTemplateChangeSide => ({
    code: account.code,
    name: account.name,
    description: account.description,
    parentName: account.parentAccountId
      ? (byId.get(account.parentAccountId)?.name ?? null)
      : null,
  });

  // Removals come first so an account on its way out is never matched.
  template.remove.forEach((slug) => {
    if (PROTECTED_SLUGS.includes(slug)) {
      errors.push({
        type: AccountsTemplateIssueType.ProtectedAccountRemoval,
        message: `The template removes "${slug}", which the application looks up by slug.`,
      });
      return;
    }
    existing
      .filter((account) => account.slug === slug && account.seeded)
      .forEach((account) => {
        if (account.predefined) {
          errors.push({
            type: AccountsTemplateIssueType.ProtectedAccountRemoval,
            message: `The template removes "${account.name}", a system account.`,
            accountId: account.id,
          });
          return;
        }
        if (context.referencedAccountIds.has(account.id)) {
          warnings.push({
            type: AccountsTemplateIssueType.AccountReferenced,
            message: `"${account.name}" is kept because other records or settings use it.`,
            accountId: account.id,
            code: account.code,
            name: account.name,
          });
          return;
        }
        if (!isAsSeeded(account, context.seededDefaults)) {
          warnings.push({
            type: AccountsTemplateIssueType.AccountCustomized,
            message: `"${account.name}" is kept because it has been edited.`,
            accountId: account.id,
            code: account.code,
            name: account.name,
          });
          return;
        }
        removed.add(account.id);
        removals.push({
          action: AccountsTemplateChangeAction.Remove,
          accountId: account.id,
          accountType: account.accountType,
          templateCode: null,
          parentTemplateCode: null,
          before: sideOf(account),
          after: null,
        });
      });
  });

  const available = (account: AccountsTemplateExistingAccount) =>
    !removed.has(account.id) && !claimed.has(account.id);

  // A name or description the seed or any variant of the template wrote is
  // the template's to change; one the user wrote is kept.
  const updateOf = (
    entry: AccountsTemplateAccount,
    account: AccountsTemplateExistingAccount,
  ): AccountsTemplateChange => {
    const known = template.knownTexts[entryKey(entry)];
    const seeded = entry.slug ? context.seededDefaults[entry.slug] : undefined;
    const nameIsDefault =
      includesText(seeded?.names, account.name) ||
      includesText(known?.names, account.name);
    const descriptionIsDefault =
      !account.description ||
      includesText(seeded?.descriptions, account.description) ||
      includesText(known?.descriptions, account.description);
    const before = sideOf(account);

    return {
      action: AccountsTemplateChangeAction.Update,
      accountId: account.id,
      accountType: account.accountType,
      templateCode: entry.code,
      parentTemplateCode: null,
      before,
      after: {
        code: entry.code,
        name: nameIsDefault ? entry.name : account.name,
        description:
          entry.description !== undefined && descriptionIsDefault
            ? entry.description
            : account.description,
        parentName: before.parentName,
      },
    };
  };

  // Entries with a slug take over the seeded or predefined account.
  template.accounts
    .filter((entry) => entry.slug)
    .forEach((entry) => {
      const account = existing
        .filter(
          (candidate) =>
            candidate.slug === entry.slug &&
            (candidate.predefined || candidate.seeded) &&
            candidate.currencyCode === context.baseCurrency &&
            available(candidate),
        )
        .sort((a, b) => a.id - b.id)[0];

      if (!account) {
        warnings.push({
          type: AccountsTemplateIssueType.AccountNotFound,
          message: `${entry.name} does not exist in this organization, so ${entry.code} is skipped.`,
          code: entry.code,
          name: entry.name,
        });
        return;
      }
      if (account.accountType !== entry.accountType) {
        warnings.push({
          type: AccountsTemplateIssueType.AccountTypeMismatch,
          message: `"${account.name}" is not of type ${entry.accountType}, so it is left as it is.`,
          accountId: account.id,
          code: entry.code,
          name: entry.name,
        });
        return;
      }
      claimed.add(account.id);

      resolutions.set(entry.code, {
        entry,
        account,
        owned: true,
        change: updateOf(entry, account),
      });
    });

  // Entries without a slug are created, unless an account with the same code
  // or name is already there.
  template.accounts
    .filter((entry) => !entry.slug)
    .forEach((entry) => {
      const matchByCode = existing.find(
        (account) =>
          available(account) &&
          normalize(account.code) === normalize(entry.code),
      );
      const match =
        matchByCode ??
        existing.find(
          (account) =>
            available(account) &&
            normalize(account.name) === normalize(entry.name),
        );
      const byCode = Boolean(matchByCode);

      if (match && match.accountType !== entry.accountType) {
        warnings.push({
          type: byCode
            ? AccountsTemplateIssueType.CodeTakenByOtherType
            : AccountsTemplateIssueType.NameTakenByOtherType,
          message: byCode
            ? `Code ${entry.code} belongs to "${match.name}", so ${entry.name} is skipped.`
            : `"${match.name}" already exists as another type, so ${entry.code} is skipped.`,
          accountId: match.id,
          code: entry.code,
          name: entry.name,
        });
        return;
      }
      if (!match) {
        resolutions.set(entry.code, {
          entry,
          account: null,
          owned: true,
          change: {
            action: AccountsTemplateChangeAction.Create,
            accountId: null,
            accountType: entry.accountType,
            templateCode: entry.code,
            parentTemplateCode: null,
            before: null,
            after: {
              code: entry.code,
              name: entry.name,
              description: entry.description ?? null,
              parentName: null,
            },
          },
        });
        return;
      }
      claimed.add(match.id);

      // Found by code and still named as some variant of the template names
      // it: the template created it, so it follows the template.
      if (
        byCode &&
        includesText(template.knownTexts[entryKey(entry)]?.names, match.name)
      ) {
        resolutions.set(entry.code, {
          entry,
          account: match,
          owned: true,
          change: updateOf(entry, match),
        });
        return;
      }
      // Otherwise it is the user's account and stays exactly as it is.
      const side = sideOf(match);

      resolutions.set(entry.code, {
        entry,
        account: match,
        owned: false,
        change: {
          action: AccountsTemplateChangeAction.Unchanged,
          accountId: match.id,
          accountType: match.accountType,
          templateCode: entry.code,
          parentTemplateCode: null,
          before: side,
          after: side,
        },
      });
    });

  // Parents are resolved once every entry is, since a parent may be created
  // in the same run.
  resolutions.forEach(({ entry, change, owned }) => {
    if (!entry.parentCode || !owned) return;

    const parent = resolutions.get(entry.parentCode);

    if (!parent) {
      warnings.push({
        type: AccountsTemplateIssueType.ParentNotResolved,
        message: `The parent ${entry.parentCode} of ${entry.code} ${entry.name} is skipped, so it stays at the top level.`,
        code: entry.code,
        name: entry.name,
      });
      return;
    }
    if (parent.entry.accountType !== entry.accountType) {
      errors.push({
        type: AccountsTemplateIssueType.ParentTypeMismatch,
        message: `${entry.code} ${entry.name} and its parent ${parent.entry.code} are of different types.`,
        code: entry.code,
        name: entry.name,
      });
      return;
    }
    change.parentTemplateCode = entry.parentCode;
    change.after.parentName = parent.change.after.name;
  });

  // An update that changes nothing is reported as unchanged.
  resolutions.forEach(({ change }) => {
    if (change.action !== AccountsTemplateChangeAction.Update) return;

    const { before, after } = change;
    const same =
      before.code === after.code &&
      before.name === after.name &&
      (before.description ?? '') === (after.description ?? '') &&
      before.parentName === after.parentName;

    if (same) {
      change.action = AccountsTemplateChangeAction.Unchanged;
    }
  });

  validateFinalChart(existing, resolutions, removed, context, errors);

  const changes = [
    ...[...resolutions.values()]
      .map(({ change }) => change)
      .sort((a, b) => compareCodes(a.after.code, b.after.code)),
    ...removals.sort((a, b) => compareCodes(a.before.code, b.before.code)),
  ];
  const count = (action: AccountsTemplateChangeAction) =>
    changes.filter((change) => change.action === action).length;

  return {
    templateKey: template.templateKey,
    variantKey: template.variantKey,
    changes,
    warnings,
    errors,
    summary: {
      update: count(AccountsTemplateChangeAction.Update),
      create: count(AccountsTemplateChangeAction.Create),
      remove: count(AccountsTemplateChangeAction.Remove),
      unchanged: count(AccountsTemplateChangeAction.Unchanged),
      // A child whose parent is skipped is still applied, at the top level.
      skipped: warnings.filter(
        (warning) =>
          warning.type !== AccountsTemplateIssueType.ParentNotResolved,
      ).length,
    },
  };
}

/**
 * Checks the chart as it would stand after the plan, rather than one change at
 * a time, so renumbering two accounts past each other is not reported as a
 * clash. Only clashes involving an account the plan touches are reported;
 * duplicates the user already had are theirs to keep.
 */
function validateFinalChart(
  existing: AccountsTemplateExistingAccount[],
  resolutions: Map<string, Resolution>,
  removed: Set<number>,
  context: AccountsTemplatePlannerContext,
  errors: AccountsTemplateIssue[],
) {
  interface FinalAccount {
    code: string | null;
    name: string;
    accountType: string;
    touched: boolean;
  }
  const touchedById = new Map<number, AccountsTemplateChange>();
  const finalAccounts: FinalAccount[] = [];

  resolutions.forEach(({ change }) => {
    if (change.action === AccountsTemplateChangeAction.Update) {
      touchedById.set(change.accountId, change);
    }
    if (change.action === AccountsTemplateChangeAction.Create) {
      finalAccounts.push({
        code: change.after.code,
        name: change.after.name,
        accountType: change.accountType,
        touched: true,
      });
    }
  });
  existing
    .filter((account) => !removed.has(account.id))
    .forEach((account) => {
      const change = touchedById.get(account.id);

      finalAccounts.push({
        code: change ? change.after.code : account.code,
        name: change ? change.after.name : account.name,
        accountType: account.accountType,
        touched: Boolean(change),
      });
    });

  const reportDuplicates = (
    key: (account: FinalAccount) => string,
    report: (value: string, accounts: FinalAccount[]) => AccountsTemplateIssue,
  ) => {
    const groups = new Map<string, FinalAccount[]>();

    finalAccounts.forEach((account) => {
      const value = key(account);
      if (!value) return;
      groups.set(value, [...(groups.get(value) ?? []), account]);
    });
    groups.forEach((accounts, value) => {
      if (accounts.length > 1 && accounts.some((account) => account.touched)) {
        errors.push(report(value, accounts));
      }
    });
  };
  const names = (accounts: FinalAccount[]) =>
    accounts.map((account) => `"${account.name}"`).join(' and ');

  if (context.accountCodeUnique) {
    reportDuplicates(
      (account) => normalize(account.code),
      (_value, accounts) => ({
        type: AccountsTemplateIssueType.DuplicateCode,
        message: `Code ${accounts[0].code} would be used by ${names(accounts)}.`,
        code: accounts[0].code,
      }),
    );
  }
  reportDuplicates(
    (account) => normalize(account.name),
    (_value, accounts) => ({
      type: AccountsTemplateIssueType.DuplicateName,
      message: `The name "${accounts[0].name}" would be used by ${accounts.length} accounts.`,
      name: accounts[0].name,
    }),
  );

  finalAccounts
    .filter((account) => account.touched)
    .forEach((account) => {
      if (!AccountTypesUtils.getType(account.accountType)) {
        errors.push({
          type: AccountsTemplateIssueType.InvalidAccountType,
          message: `"${account.name}" has an unknown account type ${account.accountType}.`,
          code: account.code,
          name: account.name,
        });
      }
      const length = (account.code ?? '').trim().length;

      if (
        length < ACCOUNT_CODE_MIN_LENGTH ||
        length > ACCOUNT_CODE_MAX_LENGTH
      ) {
        errors.push({
          type: AccountsTemplateIssueType.InvalidCode,
          message: `Code "${account.code}" of "${account.name}" must be ${ACCOUNT_CODE_MIN_LENGTH} to ${ACCOUNT_CODE_MAX_LENGTH} characters.`,
          code: account.code,
          name: account.name,
        });
      }
    });
}
