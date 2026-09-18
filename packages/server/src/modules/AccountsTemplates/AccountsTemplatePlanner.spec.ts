import { AccountsData } from '@/database/tenant/seeds/data/accounts';
import {
  planAccountsTemplate,
  resolveAccountsTemplate,
} from './AccountsTemplatePlanner';
import { getSeededAccountDefaults } from './AccountsTemplates.seed';
import {
  AccountsTemplate,
  AccountsTemplateChangeAction as Action,
  AccountsTemplateExistingAccount,
  AccountsTemplateIssueType as Issue,
  AccountsTemplatePlan,
  AccountsTemplatePlannerContext,
} from './AccountsTemplates.types';
import { UnitedStatesTemplate } from './templates/united-states';

/**
 * The chart a new organization starts with, straight from the tenant seed.
 */
const seededChart = (): AccountsTemplateExistingAccount[] =>
  AccountsData.map((account, index) => ({
    id: 1000 + index,
    name: account.name,
    slug: account.slug,
    code: account.code,
    accountType: account.account_type,
    parentAccountId: null,
    description: account.description,
    predefined: Boolean(account.predefined),
    seeded: true,
    currencyCode: 'USD',
  }));

const userAccount = (
  id: number,
  fields: Partial<AccountsTemplateExistingAccount>,
): AccountsTemplateExistingAccount => ({
  id,
  name: `Account ${id}`,
  slug: null,
  code: null,
  accountType: 'expense',
  parentAccountId: null,
  description: null,
  predefined: false,
  seeded: false,
  currencyCode: 'USD',
  ...fields,
});

const context = (
  overrides: Partial<AccountsTemplatePlannerContext> = {},
): AccountsTemplatePlannerContext => ({
  baseCurrency: 'USD',
  accountCodeUnique: true,
  referencedAccountIds: new Set(),
  seededDefaults: getSeededAccountDefaults(),
  ...overrides,
});

const us = (variant = 'corporation') =>
  resolveAccountsTemplate(UnitedStatesTemplate, variant);

const bySlug = (accounts: AccountsTemplateExistingAccount[], slug: string) =>
  accounts.find((account) => account.slug === slug);

const changeFor = (plan: AccountsTemplatePlan, accountId: number) =>
  plan.changes.find((change) => change.accountId === accountId);

const createdCodes = (plan: AccountsTemplatePlan) =>
  plan.changes
    .filter((change) => change.action === Action.Create)
    .map((change) => change.after.code);

/**
 * Carries a plan out on an in-memory chart, the way the apply command does.
 */
const applyInMemory = (
  accounts: AccountsTemplateExistingAccount[],
  plan: AccountsTemplatePlan,
): AccountsTemplateExistingAccount[] => {
  const removed = new Set(
    plan.changes
      .filter((change) => change.action === Action.Remove)
      .map((change) => change.accountId),
  );
  let nextId = 5000;
  const idByTemplateCode = new Map<string, number>();

  const result = accounts
    .filter((account) => !removed.has(account.id))
    .map((account) => {
      const change = changeFor(plan, account.id);

      if (change?.templateCode) {
        idByTemplateCode.set(change.templateCode, account.id);
      }
      return change?.action === Action.Update
        ? {
            ...account,
            code: change.after.code,
            name: change.after.name,
            description: change.after.description,
          }
        : account;
    });

  plan.changes
    .filter((change) => change.action === Action.Create)
    .forEach((change) => {
      const id = nextId++;
      idByTemplateCode.set(change.templateCode, id);
      result.push(
        userAccount(id, {
          code: change.after.code,
          name: change.after.name,
          accountType: change.accountType,
          description: change.after.description,
        }),
      );
    });

  plan.changes
    .filter((change) => change.parentTemplateCode)
    .forEach((change) => {
      const id = change.accountId ?? idByTemplateCode.get(change.templateCode);
      const account = result.find((candidate) => candidate.id === id);
      account.parentAccountId = idByTemplateCode.get(change.parentTemplateCode);
    });

  return result;
};

describe('resolveAccountsTemplate', () => {
  it('defaults to the first variant', () => {
    const resolved = resolveAccountsTemplate(UnitedStatesTemplate);

    expect(resolved.variantKey).toBe('corporation');
  });

  it('returns null for a variant the template does not have', () => {
    expect(resolveAccountsTemplate(UnitedStatesTemplate, 'trust')).toBeNull();
  });

  it('overrides base accounts by slug and adds new ones by code', () => {
    const template: AccountsTemplate = {
      key: 't',
      name: 'T',
      description: '',
      accounts: [
        { slug: 'drawings', code: '3100', name: 'Base', accountType: 'equity' },
        { code: '3200', name: 'Kept', accountType: 'equity' },
      ],
      variants: [
        {
          key: 'v',
          name: 'V',
          accounts: [
            {
              slug: 'drawings',
              code: '3100',
              name: 'Over',
              accountType: 'equity',
            },
            { code: '3020', name: 'Added', accountType: 'equity' },
          ],
        },
      ],
    };
    const resolved = resolveAccountsTemplate(template, 'v');

    expect(resolved.accounts.map((account) => account.name)).toEqual([
      'Added',
      'Over',
      'Kept',
    ]);
  });

  it('rejects a variant key on a template without variants', () => {
    const template: AccountsTemplate = {
      key: 't',
      name: 'T',
      description: '',
      accounts: [],
    };
    expect(resolveAccountsTemplate(template, 'v')).toBeNull();
    expect(resolveAccountsTemplate(template).variantKey).toBeNull();
  });
});

describe('planAccountsTemplate on a new organization', () => {
  const chart = seededChart();
  const plan = planAccountsTemplate(us(), chart, context());

  it('has nothing blocking it', () => {
    expect(plan.errors).toEqual([]);
  });

  it('only skips Stripe Clearing, which exists once Stripe is connected', () => {
    expect(plan.warnings).toHaveLength(1);
    expect(plan.warnings[0]).toMatchObject({
      type: Issue.AccountNotFound,
      code: '1040',
    });
  });

  it('renumbers system accounts in place, keeping their id', () => {
    const bank = bySlug(chart, 'bank-account');
    const change = changeFor(plan, bank.id);

    expect(change.action).toBe(Action.Update);
    expect(change.before.code).toBe('10001');
    expect(change.after).toMatchObject({
      code: '1010',
      name: 'Business Checking',
    });
  });

  it('leaves no seeded account on its old code', () => {
    const after = applyInMemory(chart, plan);
    const seededLeft = after.filter((account) => account.seeded);

    expect(seededLeft.length).toBeGreaterThan(0);
    seededLeft.forEach((account) => expect(account.code).toMatch(/^\d{4}$/));
  });

  it('removes the seeded accounts the template has no place for', () => {
    const removedSlugs = plan.changes
      .filter((change) => change.action === Action.Remove)
      .map((change) => chart.find((a) => a.id === change.accountId).slug)
      .sort();

    expect(removedSlugs).toEqual([
      'opening-balance-liabilities',
      'owner-drawings',
      'owner-drawings',
      'revenue-received-in-advance',
      'saving-bank-account',
    ]);
  });

  it('keeps Other Income, which customer opening balances post to', () => {
    const otherIncome = bySlug(chart, 'other-income');

    expect(changeFor(plan, otherIncome.id)).toMatchObject({
      action: Action.Update,
      after: { code: '4990' },
    });
  });

  it("gives Owner's Equity and Drawings distinct codes", () => {
    // The seed gives both 30003.
    expect(bySlug(chart, 'owner-equity').code).toBe(
      bySlug(chart, 'drawings').code,
    );
    expect(
      changeFor(plan, bySlug(chart, 'owner-equity').id).after,
    ).toMatchObject({ code: '3000', name: 'Common Stock' });
    expect(changeFor(plan, bySlug(chart, 'drawings').id).after).toMatchObject({
      code: '3100',
      name: 'Shareholder Distributions',
      description: 'Distributions paid to shareholders.',
    });
  });

  it('creates the missing accounts and nests them under their parent', () => {
    expect(createdCodes(plan)).toEqual(
      expect.arrayContaining(['1450', '2100', '2400', '2600', '3020', '6355']),
    );
    const fuel = plan.changes.find((change) => change.after?.code === '6360');

    expect(fuel).toMatchObject({
      action: Action.Create,
      parentTemplateCode: '6355',
      after: { parentName: 'Vehicle' },
    });
  });

  it('summarises every change', () => {
    const { update, create, remove, unchanged } = plan.summary;

    expect(update + create + remove + unchanged).toBe(plan.changes.length);
    expect(remove).toBe(5);
  });

  it('changes nothing when applied a second time', () => {
    const after = applyInMemory(chart, plan);
    const again = planAccountsTemplate(us(), after, context());

    expect(again.errors).toEqual([]);
    expect(again.summary).toMatchObject({ update: 0, create: 0, remove: 0 });
  });

  it('switches variant, renaming only the equity accounts', () => {
    const after = applyInMemory(chart, plan);
    const soleProp = planAccountsTemplate(
      us('sole-proprietorship'),
      after,
      context(),
    );
    const updated = soleProp.changes
      .filter((change) => change.action === Action.Update)
      .map((change) => change.after);

    expect(soleProp.errors).toEqual([]);
    expect(soleProp.summary).toMatchObject({ update: 3, create: 0, remove: 0 });
    expect(updated).toEqual([
      expect.objectContaining({ code: '3000', name: "Owner's Equity" }),
      expect.objectContaining({
        code: '3020',
        name: "Owner's Contributions",
        description: 'Money the owner puts into the business.',
      }),
      expect.objectContaining({ code: '3100', name: "Owner's Draw" }),
    ]);
  });

  it('does not switch an equity account the user renamed', () => {
    const after = applyInMemory(chart, plan);
    after.find((account) => account.code === '3020').name = 'APIC - Founders';

    const soleProp = planAccountsTemplate(
      us('sole-proprietorship'),
      after,
      context(),
    );
    const apic = soleProp.changes.find(
      (change) => change.after?.code === '3020',
    );

    expect(apic).toMatchObject({
      action: Action.Unchanged,
      after: { name: 'APIC - Founders' },
    });
  });
});

describe('planAccountsTemplate on a chart already in use', () => {
  it('keeps a name the user gave a seeded account, but renumbers it', () => {
    const chart = seededChart();
    bySlug(chart, 'bank-account').name = 'Ocean Bank -5205';

    const plan = planAccountsTemplate(us(), chart, context());

    expect(
      changeFor(plan, bySlug(chart, 'bank-account').id).after,
    ).toMatchObject({ code: '1010', name: 'Ocean Bank -5205' });
  });

  it('keeps a description the user wrote', () => {
    const chart = seededChart();
    bySlug(chart, 'drawings').description = 'Our own words.';

    const plan = planAccountsTemplate(us(), chart, context());

    expect(
      changeFor(plan, bySlug(chart, 'drawings').id).after.description,
    ).toBe('Our own words.');
  });

  it('keeps a removable account that other records use', () => {
    const chart = seededChart();
    const saving = bySlug(chart, 'saving-bank-account');

    const plan = planAccountsTemplate(
      us(),
      chart,
      context({ referencedAccountIds: new Set([saving.id]) }),
    );

    expect(changeFor(plan, saving.id)).toBeUndefined();
    expect(plan.warnings).toContainEqual(
      expect.objectContaining({
        type: Issue.AccountReferenced,
        accountId: saving.id,
      }),
    );
  });

  it.each([
    ['renamed', { name: 'Chase Savings 4411' }],
    ['renumbered', { code: '1015' }],
    ['described', { description: 'Reserve for taxes.' }],
  ])('keeps a removable account the user %s', (_edit, fields) => {
    const chart = seededChart();
    const saving = bySlug(chart, 'saving-bank-account');
    Object.assign(saving, fields);

    const plan = planAccountsTemplate(us(), chart, context());

    expect(changeFor(plan, saving.id)).toBeUndefined();
    expect(plan.warnings).toContainEqual(
      expect.objectContaining({
        type: Issue.AccountCustomized,
        accountId: saving.id,
      }),
    );
    expect(plan.summary.remove).toBe(4);
  });

  it('does not count a child left at the top level as skipped', () => {
    const chart = [
      ...seededChart(),
      // Takes the name of 6355 Vehicle as another type, so 6355 is skipped.
      userAccount(9001, { name: 'Vehicle', accountType: 'fixed-asset' }),
    ];
    const plan = planAccountsTemplate(us(), chart, context());
    const types = plan.warnings.map((warning) => warning.type);

    expect(types).toContain(Issue.NameTakenByOtherType);
    expect(types).toContain(Issue.ParentNotResolved);
    expect(plan.summary.skipped).toBe(
      types.filter((type) => type !== Issue.ParentNotResolved).length,
    );
  });

  it("does not rename the user's own account that matches an entry", () => {
    const chart = [
      ...seededChart(),
      userAccount(1, {
        code: '1450',
        name: 'Deposits',
        accountType: 'other-current-asset',
      }),
    ];
    const plan = planAccountsTemplate(us(), chart, context());

    expect(changeFor(plan, 1)).toMatchObject({
      action: Action.Unchanged,
      after: { code: '1450', name: 'Deposits' },
    });
    expect(createdCodes(plan)).not.toContain('1450');
  });

  it('matches an existing account by name when its code differs', () => {
    const chart = [
      ...seededChart(),
      userAccount(1, { code: '7001', name: 'Utilities' }),
    ];
    const plan = planAccountsTemplate(us(), chart, context());

    expect(changeFor(plan, 1).action).toBe(Action.Unchanged);
    expect(createdCodes(plan)).not.toContain('6210');
  });

  it('skips an entry whose code belongs to an account of another type', () => {
    const chart = [
      ...seededChart(),
      userAccount(1, {
        code: '5010',
        name: 'Contractors',
        accountType: 'expense',
      }),
    ];
    const plan = planAccountsTemplate(us(), chart, context());

    expect(plan.errors).toEqual([]);
    expect(plan.warnings).toContainEqual(
      expect.objectContaining({
        type: Issue.CodeTakenByOtherType,
        code: '5010',
      }),
    );
    expect(createdCodes(plan)).not.toContain('5010');
  });

  it('blocks a code the user already gave another account', () => {
    const chart = [
      ...seededChart(),
      userAccount(1, { code: '1010', name: 'Chase', accountType: 'bank' }),
    ];
    const plan = planAccountsTemplate(us(), chart, context());

    expect(plan.errors).toContainEqual(
      expect.objectContaining({ type: Issue.DuplicateCode, code: '1010' }),
    );
  });

  it('allows that code when account codes need not be unique', () => {
    const chart = [
      ...seededChart(),
      userAccount(1, { code: '1010', name: 'Chase', accountType: 'bank' }),
    ];
    const plan = planAccountsTemplate(
      us(),
      chart,
      context({ accountCodeUnique: false }),
    );

    expect(plan.errors).toEqual([]);
  });

  it('blocks a name the user already gave another account', () => {
    const chart = [
      ...seededChart(),
      userAccount(1, {
        code: '9999',
        name: 'business checking',
        accountType: 'cash',
      }),
    ];
    const plan = planAccountsTemplate(us(), chart, context());

    expect(plan.errors).toContainEqual(
      expect.objectContaining({ type: Issue.DuplicateName }),
    );
  });

  it("ignores duplicates the user already had and the plan doesn't touch", () => {
    const chart = [
      ...seededChart(),
      userAccount(1, { code: '7777', name: 'One' }),
      userAccount(2, { code: '7777', name: 'Two' }),
    ];
    const plan = planAccountsTemplate(us(), chart, context());

    expect(plan.errors).toEqual([]);
  });

  it('leaves system accounts in other currencies alone', () => {
    const chart = [
      ...seededChart(),
      userAccount(1, {
        slug: 'accounts-receivable',
        code: '10050',
        name: 'Accounts Receivable (EUR)',
        accountType: 'accounts-receivable',
        predefined: true,
        currencyCode: 'EUR',
      }),
    ];
    const plan = planAccountsTemplate(us(), chart, context());

    expect(changeFor(plan, 1)).toBeUndefined();
  });

  it('does not match a user account that merely shares a slug', () => {
    const chart = seededChart().filter((a) => a.slug !== 'petty-cash');
    chart.push(
      userAccount(1, { slug: 'petty-cash', code: '1999', accountType: 'cash' }),
    );
    const plan = planAccountsTemplate(us(), chart, context());

    expect(changeFor(plan, 1)).toBeUndefined();
    expect(plan.warnings).toContainEqual(
      expect.objectContaining({ type: Issue.AccountNotFound, code: '1030' }),
    );
  });

  it('skips a slug entry whose account is of another type', () => {
    const chart = seededChart();
    bySlug(chart, 'rent').accountType = 'other-expense';

    const plan = planAccountsTemplate(us(), chart, context());

    expect(changeFor(plan, bySlug(chart, 'rent').id)).toBeUndefined();
    expect(plan.warnings).toContainEqual(
      expect.objectContaining({
        type: Issue.AccountTypeMismatch,
        code: '6200',
      }),
    );
  });
});

describe('planAccountsTemplate with a faulty template', () => {
  const base: AccountsTemplate = {
    key: 'faulty',
    name: 'Faulty',
    description: '',
    accounts: [],
  };

  it('refuses to remove an account the application looks up by slug', () => {
    const template = resolveAccountsTemplate({
      ...base,
      remove: ['other-income'],
    });
    const plan = planAccountsTemplate(template, seededChart(), context());

    expect(plan.errors).toContainEqual(
      expect.objectContaining({ type: Issue.ProtectedAccountRemoval }),
    );
  });

  it('refuses to remove a predefined account', () => {
    const template = resolveAccountsTemplate({
      ...base,
      remove: ['petty-cash'],
    });
    const plan = planAccountsTemplate(template, seededChart(), context());

    expect(plan.errors).toContainEqual(
      expect.objectContaining({ type: Issue.ProtectedAccountRemoval }),
    );
    expect(plan.summary.remove).toBe(0);
  });

  it('refuses a parent of another type', () => {
    const template = resolveAccountsTemplate({
      ...base,
      accounts: [
        { code: '6355', name: 'Vehicle', accountType: 'expense' },
        {
          code: '8360',
          name: 'Fuel',
          accountType: 'other-expense',
          parentCode: '6355',
        },
      ],
    });
    const plan = planAccountsTemplate(template, seededChart(), context());

    expect(plan.errors).toContainEqual(
      expect.objectContaining({ type: Issue.ParentTypeMismatch }),
    );
  });

  it('refuses codes of the wrong length and unknown types', () => {
    const template = resolveAccountsTemplate({
      ...base,
      accounts: [
        { code: '12', name: 'Short', accountType: 'expense' },
        { code: '1234', name: 'Odd', accountType: 'not-a-type' },
      ],
    });
    const plan = planAccountsTemplate(template, seededChart(), context());

    expect(plan.errors.map((error) => error.type).sort()).toEqual([
      Issue.InvalidAccountType,
      Issue.InvalidCode,
    ]);
  });
});
