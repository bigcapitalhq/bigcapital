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
    const databaseName = this.getDatabaseName(organizationId);
    const cached = this.lruCache.get(databaseName);
    if (cached) return cached;

    const knexInstance = this.buildKnex(databaseName);
    this.lruCache.set(databaseName, knexInstance);

    return knexInstance;
  }

  /**
   * Creates a new knex instance of the given organization tenant database
   * without caching it. Used by the batch jobs that should release the
   * connection after processing each organization.
   * @param {string} organizationId
   * @returns {Knex}
   */
  public createTenantKnex(organizationId: string): Knex {
    return this.buildKnex(this.getDatabaseName(organizationId));
  }

  /**
   * Retrieves the tenant database name of the given organization.
   * @param {string} organizationId
   * @returns {string}
   */
  private getDatabaseName(organizationId: string): string {
    return `${this.configService.get('tenantDatabase.dbNamePrefix')}${organizationId}`;
  }

  /**
   * Builds a new knex instance of the given tenant database.
   * @param {string} databaseName
   * @returns {Knex}
   */
  private buildKnex(databaseName: string): Knex {
    return knex({
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
  }
}
