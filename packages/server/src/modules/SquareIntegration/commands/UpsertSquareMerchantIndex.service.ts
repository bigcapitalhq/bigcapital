import { Inject, Injectable } from '@nestjs/common';
import { SquareMerchantIndex } from '../models/SquareMerchantIndex.model';

/**
 * Maintains the system-DB index that maps (merchant_id, environment) →
 * (organizationId, connectionId). Called by the OAuth callback whenever
 * a connection is inserted or updated. The webhook receiver reads this
 * index to discover which tenant owns an inbound merchant_id without
 * needing tenant context up front.
 */
@Injectable()
export class UpsertSquareMerchantIndex {
  constructor(
    @Inject(SquareMerchantIndex.name)
    private readonly indexModel: typeof SquareMerchantIndex,
  ) {}

  public async upsert(params: {
    merchantId: string;
    environment: string;
    organizationId: string;
    connectionId: number;
  }): Promise<void> {
    const { merchantId, environment, organizationId, connectionId } = params;
    const existing = await this.indexModel.query().findOne({
      merchantId,
      environment,
    });
    if (existing) {
      if (
        existing.organizationId !== organizationId ||
        existing.connectionId !== connectionId
      ) {
        await this.indexModel.query().patchAndFetchById(existing.id, {
          organizationId,
          connectionId,
        });
      }
      return;
    }
    await this.indexModel.query().insert({
      merchantId,
      environment,
      organizationId,
      connectionId,
    });
  }

  public lookup(merchantId: string, environment: string) {
    return this.indexModel
      .query()
      .findOne({ merchantId, environment });
  }
}
