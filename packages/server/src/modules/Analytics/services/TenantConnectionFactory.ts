import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import knex, { Knex } from 'knex';
import * as LRUCache from 'lru-cache';
import { knexSnakeCaseMappers } from 'objection';

/**
 * Resolves raw knex connections to the tenant databases by organization id.
 * Used by the analytics sync/reconcile jobs and the workspaces financials
 * fallback, which run outside the tenant CLS context.
 */
@Injectable()
export class TenantConnectionFactory {
  private readonly lruCache = new LRUCache<string, Knex>();

  constructor(private readonly configService: ConfigService) {}

  /**
   * Retrieves a knex instance of the given organization tenant database.
   * @param {string} organizationId
   * @returns {Knex}
   */
  public getTenantKnex(organizationId: string): Knex {
    const databaseName = `${this.configService.get(
      'tenantDatabase.dbNamePrefix',
    )}${organizationId}`;
    const cached = this.lruCache.get(databaseName);
    if (cached) return cached;

    const knexInstance = knex({
      client: this.configService.get('tenantDatabase.client'),
      connection: {
        host: this.configService.get('tenantDatabase.host'),
        port: this.configService.get('tenantDatabase.port'),
        user: this.configService.get('tenantDatabase.user'),
        password: this.configService.get('tenantDatabase.password'),
        database: databaseName,
        charset: 'utf8',
      },
      pool: { min: 0, max: 5 },
      ...knexSnakeCaseMappers({ upperCase: true }),
    });
    this.lruCache.set(databaseName, knexInstance);

    return knexInstance;
  }
}
