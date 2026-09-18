import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { Account } from '../Accounts/models/Account.model';
import { AccountsSettingsService } from '../Accounts/AccountsSettings.service';
import { TenancyContext } from '../Tenancy/TenancyContext.service';
import { TENANCY_DB_CONNECTION } from '../Tenancy/TenancyDB/TenancyDB.constants';
import { TenantModelProxy } from '../System/models/TenantBaseModel';
import { SettingsOptions } from '@/constants/metable-options';
import {
  getSeededAccountDefaults,
  hasSeededName,
} from './AccountsTemplates.seed';
import {
  AccountRow,
  AccountsTemplateExistingAccount,
  AccountsTemplatePlannerContext,
  ResolvedAccountsTemplate,
} from './AccountsTemplates.types';

/**
 * Reads the account rows the way the planner sees them.
 * @param {AccountRow[]} accounts
 * @param {AccountsTemplatePlannerContext['seededDefaults']} seededDefaults
 */
export function toExistingAccounts(
  accounts: AccountRow[],
  seededDefaults: AccountsTemplatePlannerContext['seededDefaults'],
): AccountsTemplateExistingAccount[] {
  // Tenants created before seeded_at existed have it empty on every account;
  // there an account still named as seeded is taken as seeded.
  const hasSeedMarks = accounts.some((account) => account.seededAt);

  return accounts.map((account) => ({
    id: account.id,
    name: account.name,
    slug: account.slug ?? null,
    code: account.code ?? null,
    accountType: account.accountType,
    parentAccountId: account.parentAccountId ?? null,
    description: account.description ?? null,
    predefined: Boolean(account.predefined),
    seeded: hasSeedMarks
      ? Boolean(account.seededAt)
      : hasSeededName(account, seededDefaults),
    currencyCode: account.currencyCode,
  }));
}

export interface AccountsTemplateState {
  accounts: Account[];
  existing: AccountsTemplateExistingAccount[];
  context: AccountsTemplatePlannerContext;
}

@Injectable()
export class AccountsTemplateStateService {
  constructor(
    @Inject(Account.name)
    private readonly accountModel: TenantModelProxy<typeof Account>,
    private readonly tenancyContext: TenancyContext,
    private readonly accountsSettings: AccountsSettingsService,

    @Inject(TENANCY_DB_CONNECTION)
    private readonly tenantKnex: () => Knex,
  ) {}

  /**
   * Reads the chart of accounts and everything the planner needs to judge it.
   * @param {ResolvedAccountsTemplate} template
   * @param {Knex.Transaction} trx
   */
  public async load(
    template: ResolvedAccountsTemplate,
    trx?: Knex.Transaction,
  ): Promise<AccountsTemplateState> {
    // Within the apply transaction the chart is locked until it commits, so a
    // second apply running at the same time plans against the chart the first
    // left rather than creating every account again.
    const query = this.accountModel().query(trx);
    const accounts = await (trx ? query.forUpdate() : query);
    const metadata = await this.tenancyContext.getTenantMetadata();
    const { accountCodeUnique } =
      await this.accountsSettings.getAccountsSettings();
    const seededDefaults = getSeededAccountDefaults();
    const existing = toExistingAccounts(
      accounts as AccountRow[],
      seededDefaults,
    );
    // Only accounts the template could remove need the reference check.
    const removable = existing
      .filter(
        (account) => account.seeded && template.remove.includes(account.slug),
      )
      .map((account) => account.id);

    return {
      accounts,
      existing,
      context: {
        baseCurrency: metadata.baseCurrency,
        accountCodeUnique,
        referencedAccountIds: await this.getReferencedAccountIds(
          removable,
          trx,
        ),
        seededDefaults,
      },
    };
  }

  /**
   * Finds which of the given accounts a row anywhere in the tenant database
   * points at. The columns come from the schema itself: every foreign key to
   * `accounts`, and every integer column named like an account id, since a few
   * of those were created without a constraint. A table added later is covered
   * without touching this code. Settings that name an account count too.
   * @param {number[]} accountIds
   * @param {Knex.Transaction} trx
   */
  private async getReferencedAccountIds(
    accountIds: number[],
    trx?: Knex.Transaction,
  ): Promise<Set<number>> {
    const referenced = new Set<number>();

    if (accountIds.length === 0) return referenced;

    const knex = trx ?? this.tenantKnex();

    (await this.getAccountIdsInSettings(knex))
      .filter((id) => accountIds.includes(id))
      .forEach((id) => referenced.add(id));

    // The tenant connection upper-cases identifiers, so migrations created the
    // tables as ACCOUNTS, ACCOUNT_ID and so on. Compare names case-blind.
    const [rows] = await knex.raw(
      `SELECT TABLE_NAME AS ref_table, COLUMN_NAME AS ref_column
         FROM information_schema.KEY_COLUMN_USAGE
        WHERE TABLE_SCHEMA = DATABASE()
          AND LOWER(REFERENCED_TABLE_NAME) = 'accounts'
          AND LOWER(REFERENCED_COLUMN_NAME) = 'id'
       UNION
       SELECT TABLE_NAME AS ref_table, COLUMN_NAME AS ref_column
         FROM information_schema.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
          AND LOWER(REPLACE(COLUMN_NAME, '_', '')) LIKE '%accountid'
          AND DATA_TYPE IN ('int', 'bigint', 'mediumint', 'smallint')`,
    );

    for (const row of rows as Record<string, string>[]) {
      // Result keys are camel-cased by the same mapping; read either spelling.
      // The names come back as stored, ITEMS_ENTRIES; the mapping would turn
      // that into ITEMS__ENTRIES, so hand it the lower-case form it expects.
      const table = (row.refTable ?? row.ref_table).toLowerCase();
      const column = (row.refColumn ?? row.ref_column).toLowerCase();

      const found = await knex
        .select(knex.raw('DISTINCT ?? AS ref_id', [column]))
        .from(knex.raw('??', [table]))
        .whereIn(knex.raw('??', [column]) as unknown as string, accountIds);

      found.forEach((result: Record<string, number>) =>
        referenced.add(Number(result.refId ?? result.ref_id)),
      );
    }
    return referenced;
  }

  /**
   * Accounts that settings point at: the preferred accounts of forms and
   * items, and those a payment integration posts to. A form would otherwise
   * default to an account that no longer exists.
   * @param {Knex} knex
   */
  private async getAccountIdsInSettings(knex: Knex): Promise<number[]> {
    const options = SettingsOptions as Record<
      string,
      Record<string, { type?: string }>
    >;
    const settings = await knex('settings').select('group', 'key', 'value');

    // Every numeric setting holds an account id. Should one not, an account
    // is kept that could have gone, which is the safe way to be wrong.
    const fromSettings = settings
      .filter(
        (setting: Record<string, string>) =>
          options[setting.group]?.[setting.key]?.type === 'number',
      )
      .map((setting: Record<string, string>) => Number(setting.value));

    const integrations = await knex('payment_integrations').select('options');

    const fromIntegrations = integrations.flatMap(
      ({ options }: { options: unknown }) => {
        const parsed = parseJson(options);
        return [parsed?.bankAccountId, parsed?.clearingAccountId];
      },
    );
    return [...fromSettings, ...fromIntegrations]
      .map(Number)
      .filter((id) => Number.isInteger(id) && id > 0);
  }
}

const parseJson = (value: unknown): Record<string, unknown> | null => {
  if (typeof value !== 'string') {
    return (value as Record<string, unknown>) ?? null;
  }
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};
