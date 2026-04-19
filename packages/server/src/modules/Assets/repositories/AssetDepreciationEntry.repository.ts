import { Injectable, Scope } from '@nestjs/common';
import { Knex } from 'knex';
import { Inject } from '@nestjs/common';
import { TenantRepository } from '@/modules/Tenancy/TenancyDB/TenantRepository';
import { TENANCY_DB_CONNECTION } from '@/modules/Tenancy/TenancyDB/TenancyDB.constants';
import { AssetDepreciationEntry } from '../models/AssetDepreciationEntry.model';

@Injectable({ scope: Scope.REQUEST })
export class AssetDepreciationEntryRepository extends TenantRepository {
  constructor(
    @Inject(TENANCY_DB_CONNECTION)
    private readonly tenantDBKnex: () => Knex,
  ) {
    super();
  }

  get model(): typeof AssetDepreciationEntry {
    return AssetDepreciationEntry.bindKnex(this.tenantDBKnex());
  }

  /**
   * Find entries by asset ID.
   */
  async findByAssetId(assetId: number): Promise<AssetDepreciationEntry[]> {
    return this.model
      .query()
      .where('assetId', assetId)
      .orderBy(['periodYear', 'periodMonth']);
  }

  /**
   * Find unposted entries by period.
   */
  async findUnpostedByPeriod(year: number, month: number): Promise<AssetDepreciationEntry[]> {
    return this.model
      .query()
      .where('periodYear', year)
      .where('periodMonth', month)
      .where('isPosted', false);
  }

  /**
   * Find entries by asset and period.
   */
  async findByPeriod(assetId: number, year: number, month: number): Promise<AssetDepreciationEntry[]> {
    return this.model
      .query()
      .where('assetId', assetId)
      .where('periodYear', year)
      .where('periodMonth', month);
  }

  /**
   * Delete unposted entries for an asset.
   */
  async deleteUnpostedEntries(assetId: number): Promise<void> {
    await this.model
      .query()
      .where('assetId', assetId)
      .where('isPosted', false)
      .delete();
  }

  /**
   * Create a depreciation entry.
   */
  async create(data: Partial<AssetDepreciationEntry>): Promise<AssetDepreciationEntry> {
    return this.model.query().insert(data);
  }

  /**
   * Update a depreciation entry.
   */
  async update(id: number, data: Partial<AssetDepreciationEntry>): Promise<AssetDepreciationEntry> {
    return this.model.query().patchAndFetchById(id, data);
  }

  /**
   * Get the last posted entry for an asset.
   */
  async getLastPostedEntry(assetId: number): Promise<AssetDepreciationEntry | undefined> {
    return this.model
      .query()
      .where('assetId', assetId)
      .where('isPosted', true)
      .orderBy(['periodYear', 'periodMonth'], 'desc')
      .first();
  }
}
