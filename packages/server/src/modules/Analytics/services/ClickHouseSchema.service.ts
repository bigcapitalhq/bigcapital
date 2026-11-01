import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { ClickHouseClient } from '@clickhouse/client';
import {
  ACCOUNTS_DIM_TABLE,
  CLICKHOUSE_CLIENT,
  LEDGER_DELTA_TABLE,
} from '../Analytics.constants';

@Injectable()
export class ClickHouseSchemaService {
  constructor(
    @Inject(CLICKHOUSE_CLIENT)
    private readonly clickhouseClient: ClickHouseClient,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Determines whether the ClickHouse integration is enabled.
   * @returns {boolean}
   */
  public isEnabled(): boolean {
    return this.configService.get<boolean>('clickhouse.enabled') === true;
  }

  /**
   * Fully-qualifies the given table name with the configured database.
   * @param {string} table
   * @returns {string}
   */
  public table(table: string): string {
    return `${this.configService.get('clickhouse.database')}.${table}`;
  }

  /**
   * Creates the analytics database if not exists.
   */
  public async ensureDatabase(): Promise<void> {
    const database = this.configService.get('clickhouse.database');
    await this.clickhouseClient.command({
      query: `CREATE DATABASE IF NOT EXISTS ${database}`,
    });
  }

  /**
   * Creates the analytics tables if not exists.
   */
  public async ensureTables(): Promise<void> {
    // Append-only ledger deltas of the tenant databases (all tenants).
    // Insertions are positive deltas, deletions are negated deltas.
    await this.clickhouseClient.command({
      query: `
        CREATE TABLE IF NOT EXISTS ${this.table(LEDGER_DELTA_TABLE)} (
          organization_id String,
          account_id UInt64,
          credit Float64,
          debit Float64
        )
        ENGINE = MergeTree
        ORDER BY (organization_id, account_id)
      `,
    });

    // Accounts dimension table with the last known account type and state.
    await this.clickhouseClient.command({
      query: `
        CREATE TABLE IF NOT EXISTS ${this.table(ACCOUNTS_DIM_TABLE)} (
          organization_id String,
          account_id UInt64,
          account_type String,
          account_normal String,
          active UInt8,
          version UInt64
        )
        ENGINE = ReplacingMergeTree(version)
        ORDER BY (organization_id, account_id)
      `,
    });
  }
}
