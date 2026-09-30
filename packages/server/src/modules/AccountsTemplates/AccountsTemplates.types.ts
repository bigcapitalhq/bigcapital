import { Account } from '../Accounts/models/Account.model';

/**
 * An account the template expects to find in the chart.
 */
export interface AccountsTemplateAccount {
  code: string;
  name: string;
  accountType: string;
  description?: string;

  /**
   * Matches an account seeded with the organization, or a predefined one the
   * application creates on demand, by its slug. Such an entry renumbers that
   * account and never creates one: the slug is how the application finds its
   * system accounts, so they are changed in place and keep their id.
   */
  slug?: string;

  /**
   * Code of the parent account, declared in the same template.
   */
  parentCode?: string;
}

/**
 * A variant overrides template accounts that share its slug, or its code when
 * it has no slug, and adds the rest.
 */
export interface AccountsTemplateVariant {
  key: string;
  name: string;
  description?: string;
  accounts: AccountsTemplateAccount[];
}

export interface AccountsTemplate {
  key: string;
  name: string;
  description: string;

  /**
   * ISO 3166-1 alpha-2 country the numbering is conventional in.
   */
  country?: string;
  accounts: AccountsTemplateAccount[];

  /**
   * Slugs of seeded accounts the template has no place for. They are deleted
   * only when nothing references them.
   */
  remove?: string[];
  variants?: AccountsTemplateVariant[];
}

/**
 * The accounts of a template with one of its variants applied.
 */
export interface ResolvedAccountsTemplate {
  templateKey: string;
  variantKey: string | null;
  accounts: AccountsTemplateAccount[];
  remove: string[];

  /**
   * Every name and description any variant of the template gives an entry,
   * keyed by `slug:<slug>` or `code:<code>`. An account still carrying one of
   * them has not been edited by the user, so switching variants renames it.
   */
  knownTexts: Record<string, AccountsTemplateKnownTexts>;
}

export interface AccountsTemplateKnownTexts {
  names: string[];
  descriptions: string[];
}

export interface AccountsTemplateSeededDefaults
  extends AccountsTemplateKnownTexts {
  codes: string[];
}

/**
 * The state of an existing account the planner reads.
 */
export interface AccountsTemplateExistingAccount {
  id: number;
  name: string;
  slug: string | null;
  code: string | null;
  accountType: string;
  parentAccountId: number | null;
  description: string | null;
  predefined: boolean;
  seeded: boolean;
  currencyCode: string;
}

export interface AccountsTemplatePlannerContext {
  baseCurrency: string;
  accountCodeUnique: boolean;

  /**
   * Ids of accounts that a row in another table or a setting points at. Such
   * an account is not deleted.
   */
  referencedAccountIds: Set<number>;

  /**
   * Codes, names and descriptions each slug was seeded with. A seeded account
   * whose name no longer matches has been renamed by the user and keeps its
   * name; one edited in any of them is not removed.
   */
  seededDefaults: Record<string, AccountsTemplateSeededDefaults>;
}

export enum AccountsTemplateChangeAction {
  Update = 'update',
  Create = 'create',
  Remove = 'remove',
  Unchanged = 'unchanged',
}

export interface AccountsTemplateChangeSide {
  code: string | null;
  name: string;
  description: string | null;
  parentName: string | null;
}

export interface AccountsTemplateChange {
  action: AccountsTemplateChangeAction;

  /**
   * Null for accounts the plan creates.
   */
  accountId: number | null;
  accountType: string;

  /**
   * Code of the template entry this change comes from; null for removals.
   */
  templateCode: string | null;

  /**
   * Code of the parent's template entry when the plan sets the parent.
   */
  parentTemplateCode: string | null;
  before: AccountsTemplateChangeSide | null;
  after: AccountsTemplateChangeSide | null;
}

export enum AccountsTemplateIssueType {
  // Warnings: the entry is skipped and the rest still applies.
  AccountNotFound = 'ACCOUNT_NOT_FOUND',
  AccountTypeMismatch = 'ACCOUNT_TYPE_MISMATCH',
  CodeTakenByOtherType = 'CODE_TAKEN_BY_OTHER_TYPE',
  NameTakenByOtherType = 'NAME_TAKEN_BY_OTHER_TYPE',
  AccountReferenced = 'ACCOUNT_REFERENCED',
  AccountCustomized = 'ACCOUNT_CUSTOMIZED',
  ParentNotResolved = 'PARENT_NOT_RESOLVED',

  // Errors: the template cannot be applied as it stands.
  DuplicateCode = 'DUPLICATE_CODE',
  DuplicateName = 'DUPLICATE_NAME',
  InvalidAccountType = 'INVALID_ACCOUNT_TYPE',
  InvalidCode = 'INVALID_CODE',
  ParentTypeMismatch = 'PARENT_TYPE_MISMATCH',
  ProtectedAccountRemoval = 'PROTECTED_ACCOUNT_REMOVAL',
}

export interface AccountsTemplateIssue {
  type: AccountsTemplateIssueType;
  message: string;
  code?: string | null;
  name?: string;
  accountId?: number;
}

export interface AccountsTemplatePlanSummary {
  update: number;
  create: number;
  remove: number;
  unchanged: number;

  /**
   * Template entries and removals left out; see the warnings.
   */
  skipped: number;
}

export interface AccountsTemplatePlan {
  templateKey: string;
  variantKey: string | null;
  changes: AccountsTemplateChange[];
  warnings: AccountsTemplateIssue[];
  errors: AccountsTemplateIssue[];
  summary: AccountsTemplatePlanSummary;
}

/**
 * The account model leaves a few selected columns undeclared.
 */
export type AccountRow = Account & {
  description?: string | null;
  seededAt?: Date | string | null;
};
