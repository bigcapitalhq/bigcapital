import { Inject, Injectable } from '@nestjs/common';
import type { ClickHouseClient } from '@clickhouse/client';
import { Knex } from 'knex';
import {
  ACCOUNTS_DIM_TABLE,
  CLICKHOUSE_CLIENT,
  IAccountBalanceRow,
  ILedgerDelta,
  LEDGER_DELTA_TABLE,
  OrgFinancialTotalsMap,
} from '../Analytics.constants';
import { ClickHouseSchemaService } from './ClickHouseSchema.service';
import { TenantConnectionFactory } from './TenantConnectionFactory';
import {
  aggregateFinancialTotals,
  getAccountTypeMeta,
} from './LedgerAnalyticsAggregation';

const PAGE_SIZE = 5000;

interface ILedgerTransactionPageRow {
  id: number;
  accountId: number;
  credit: number;
  debit: number;
}

@Injectable()
export class LedgerAnalyticsSyncService {
  constructor(
    @Inject(CLICKHOUSE_CLIENT)
    private readonly clickhouseClient: ClickHouseClient,
    private readonly schemaService: ClickHouseSchemaService,
    private readonly tenantConnectionFactory: TenantConnectionFactory,
  ) {}

  /**
   * Retrieves the ledger deltas per organization from ClickHouse
   * and aggregates them into total assets and liabilities.
   * @param {string[]} organizationIds
   * @returns {Promise<OrgFinancialTotalsMap>}
   */
  public async getFinancialTotals(
    organizationIds: string[],
  ): Promise<OrgFinancialTotalsMap> {
    if (organizationIds.length === 0) {
      return new Map();
    }
    const rows = await this.clickhouseClient.query({
      query: `
        SELECT
          d.organization_id AS organizationId,
          d.account_id AS accountId,
          a.account_type AS accountType,
          a.account_normal AS accountNormal,
          a.active AS active,
          sum(d.credit) AS credit,
          sum(d.debit) AS debit
        FROM ${this.schemaService.table(LEDGER_DELTA_TABLE)} AS d
        INNER JOIN (
          SELECT organization_id, account_id,
            argMax(account_type, version) AS account_type,
            argMax(account_normal, version) AS account_normal,
            argMax(active, version) AS active
          FROM ${this.schemaService.table(ACCOUNTS_DIM_TABLE)}
          GROUP BY organization_id, account_id
        ) AS a
          ON a.organization_id = d.organization_id
          AND a.account_id = d.account_id
        WHERE d.organization_id IN {organizationIds:Array(String)}
        GROUP BY d.organization_id, d.account_id,
          a.account_type, a.account_normal, a.active
      `,
      query_params: { organizationIds },
      format: 'JSONEachRow',
    });

    const data = (await rows.json()) as Array<Record<string, any>>;

    return aggregateFinancialTotals(
      data.map((row) => ({
        organizationId: row.organizationId,
        accountType: row.accountType,
        accountNormal: row.accountNormal,
        active: Number(row.active),
        credit: Number(row.credit),
        debit: Number(row.debit),
      })),
    );
  }

  /**
   * Computes the total assets and liabilities of the given organization
   * from its tenant database (fallback path).
   * @param {string} organizationId
   * @returns {Promise<IAccountBalanceRow[]>}
   */
  public async fetchTenantBalanceRows(
    organizationId: string,
  ): Promise<IAccountBalanceRow[]> {
    const knex = this.tenantConnectionFactory.getTenantKnex(organizationId);

    const rows = await knex('accounts_transactions as t')
      .join('accounts as a', 'a.id', 't.accountId')
      .where('a.active', 1)
      .groupBy('t.accountId', 'a.accountType')
      .select(
        'a.accountType as accountType',
        knex.raw('SUM(t.credit) as credit'),
        knex.raw('SUM(t.debit) as debit'),
      );

    return rows.map((row) => {
      const accountNormal =
        getAccountTypeMeta(row.accountType)?.normal ?? 'debit';
      return {
        organizationId,
        accountType: row.accountType,
        accountNormal,
        active: 1,
        credit: Number(row.credit) || 0,
        debit: Number(row.debit) || 0,
      };
    });
  }

  /**
   * Upserts the accounts dimensions rows into ClickHouse.
   * @param {string} organizationId
   * @param {Knex} tenantKnex
   * @param {number[]} [accountIds] - Subset of accounts, defaults to all.
   */
  public async syncAccountsDim(
    organizationId: string,
    tenantKnex: Knex,
    accountIds?: number[],
  ): Promise<void> {
    const nowVersion = Date.now();

    let query = tenantKnex('accounts').select(
      'id as id',
      'accountType as accountType',
      'active as active',
    );
    if (accountIds && accountIds.length > 0) {
      query = query.whereIn('id', accountIds);
    }
    const accounts = await query;

    if (accounts.length === 0) return;

    const values = accounts.map((account) => ({
      organization_id: organizationId,
      account_id: account.id,
      account_type: account.accountType,
      account_normal:
        getAccountTypeMeta(account.accountType)?.normal ?? 'debit',
      active: account.active ? 1 : 0,
      version: nowVersion,
    }));

    await this.clickhouseClient.insert({
      table: this.schemaService.table(ACCOUNTS_DIM_TABLE),
      values,
      format: 'JSONEachRow',
    });
  }

  /**
   * Inserts the given ledger deltas into ClickHouse.
   * @param {string} organizationId
   * @param {ILedgerDelta[]} deltas
   */
  public async insertLedgerDeltas(
    organizationId: string,
    deltas: ILedgerDelta[],
  ): Promise<void> {
    const values = deltas
      .filter((d) => d.credit || d.debit)
      .map((delta) => ({
        organization_id: organizationId,
        account_id: delta.accountId,
        credit: delta.credit,
        debit: delta.debit,
      }));
    if (values.length === 0) return;

    await this.clickhouseClient.insert({
      table: this.schemaService.table(LEDGER_DELTA_TABLE),
      values,
      format: 'JSONEachRow',
    });
  }

  /**
   * Rebuilds the whole organization data in ClickHouse from the tenant
   * database (used by the reconcile job, the repair command and the backfill).
   * @param {string} organizationId
   * @param {Knex} [tenantKnex] - Optional existing tenant knex instance,
   *   defaults to a throwaway connection that is destroyed after the rebuild.
   */
  public async rebuildOrganization(
    organizationId: string,
    tenantKnex?: Knex,
  ): Promise<void> {
    const knex =
      tenantKnex ??
      this.tenantConnectionFactory.createTenantKnex(organizationId);
    const isThrowawayKnex = !tenantKnex;

    try {
      await this.rebuildOrganizationWithKnex(organizationId, knex);
    } finally {
      if (isThrowawayKnex) {
        await knex.destroy();
      }
    }
  }

  /**
   * Rebuilds the whole organization data in ClickHouse using the given
   * tenant database connection.
   * @param {string} organizationId
   * @param {Knex} knex
   */
  private async rebuildOrganizationWithKnex(
    organizationId: string,
    knex: Knex,
  ): Promise<void> {
    const orgFilter = `'${organizationId.replace(/'/g, "\\'")}'`;

    // Drop the existing organization rows.
    await this.clickhouseClient.command({
      query: `ALTER TABLE ${this.schemaService.table(
        LEDGER_DELTA_TABLE,
      )} DELETE WHERE organization_id = ${orgFilter}`,
    });
    await this.clickhouseClient.command({
      query: `ALTER TABLE ${this.schemaService.table(
        ACCOUNTS_DIM_TABLE,
      )} DELETE WHERE organization_id = ${orgFilter}`,
    });

    // Reload the accounts dimensions.
    await this.syncAccountsDim(organizationId, knex);

    // Reload the ledger transactions pages.
    let lastId = 0;

    while (true) {
      const page = (await knex('accounts_transactions')
        .select(
          'id as id',
          'accountId as accountId',
          'credit as credit',
          'debit as debit',
        )
        .where('id', '>', lastId)
        .orderBy('id')
        .limit(PAGE_SIZE)) as ILedgerTransactionPageRow[];

      if (page.length === 0) break;
      lastId = page[page.length - 1].id;

      const values = page.map((row) => ({
        organization_id: organizationId,
        account_id: row.accountId,
        credit: Number(row.credit) || 0,
        debit: Number(row.debit) || 0,
      }));

      await this.clickhouseClient.insert({
        table: this.schemaService.table(LEDGER_DELTA_TABLE),
        values,
        format: 'JSONEachRow',
      });
    }
  }
}
