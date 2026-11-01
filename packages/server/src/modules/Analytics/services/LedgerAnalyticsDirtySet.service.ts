import { Injectable } from '@nestjs/common';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { LEDGER_ANALYTICS_DIRTY_SET_KEY } from '../Analytics.constants';

/**
 * Tracks the organizations whose ledger deltas failed to sync to
 * the ClickHouse analytics store, so the reconcile job rebuilds them.
 */
@Injectable()
export class LedgerAnalyticsDirtySet {
  constructor(private readonly redisService: RedisService) {}

  /**
   * Marks the given organization as dirty.
   * @param {string} organizationId
   */
  public async mark(organizationId: string): Promise<void> {
    try {
      await this.redisService
        .getOrThrow()
        .sadd(LEDGER_ANALYTICS_DIRTY_SET_KEY, organizationId);
    } catch {
      // Ignore, the full reconcile job will catch the drift.
    }
  }

  /**
   * Removes the given organization from the dirty set.
   * @param {string} organizationId
   */
  public async unmark(organizationId: string): Promise<void> {
    try {
      await this.redisService
        .getOrThrow()
        .srem(LEDGER_ANALYTICS_DIRTY_SET_KEY, organizationId);
    } catch {
      // Ignore.
    }
  }

  /**
   * Retrieves the dirty organizations.
   * @returns {Promise<string[]>}
   */
  public async list(): Promise<string[]> {
    try {
      return await this.redisService
        .getOrThrow()
        .smembers(LEDGER_ANALYTICS_DIRTY_SET_KEY);
    } catch {
      return [];
    }
  }
}
