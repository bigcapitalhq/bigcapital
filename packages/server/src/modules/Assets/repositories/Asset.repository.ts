import { Injectable, Scope } from '@nestjs/common';
import { Knex } from 'knex';
import { Inject } from '@nestjs/common';
import { TenantRepository } from '@/modules/Tenancy/TenancyDB/TenantRepository';
import { TENANCY_DB_CONNECTION } from '@/modules/Tenancy/TenancyDB/TenancyDB.constants';
import { Asset } from '../models/Asset.model';

@Injectable({ scope: Scope.REQUEST })
export class AssetRepository extends TenantRepository {
  constructor(
    @Inject(TENANCY_DB_CONNECTION)
    private readonly tenantDBKnex: () => Knex,
  ) {
    super();
  }

  get model(): typeof Asset {
    return Asset.bindKnex(this.tenantDBKnex());
  }

  /**
   * Find asset by ID with relations.
   */
  async findById(id: number): Promise<Asset | undefined> {
    return this.model
      .query()
      .findById(id)
      .withGraphFetched('[assetAccount, depreciationExpenseAccount, accumulatedDepreciationAccount, category]');
  }

  /**
   * Find asset by code.
   */
  async findByCode(code: string): Promise<Asset | undefined> {
    return this.model
      .query()
      .where('code', code)
      .first();
  }

  /**
   * Find one or fail.
   */
  async findOneOrFail(id: number): Promise<Asset> {
    const asset = await this.findById(id);
    if (!asset) {
      throw new Error(`Asset with id ${id} not found`);
    }
    return asset;
  }

  /**
   * Paginated list of assets.
   */
  async getAssets(filters: {
    q?: string;
    status?: string;
    assetAccountId?: number;
    page?: number;
    pageSize?: number;
  }): Promise<{ assets: Asset[]; total: number }> {
    const { q, status, assetAccountId, page = 1, pageSize = 20 } = filters;

    let query = this.model
      .query()
      .withGraphFetched('[assetAccount, category]');

    if (q) {
      query = query.where((builder) => {
        builder.where('name', 'like', `%${q}%`).orWhere('code', 'like', `%${q}%`);
      });
    }

    if (status) {
      query = query.where('status', status);
    }

    if (assetAccountId) {
      query = query.where('assetAccountId', assetAccountId);
    }

    const total = await query.clone().resultSize();
    const assets = await query
      .orderBy('createdAt', 'desc')
      .page(page - 1, pageSize);

    return { assets: assets.results, total };
  }
}
