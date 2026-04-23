import { Inject, Injectable } from '@nestjs/common';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { SquareConnection } from '../models/SquareConnection.model';
import { SquareItemMapping } from '../models/SquareItemMapping.model';
import { SquareApiClient } from '../utils/SquareApiClient.service';

export interface SquareCatalogRow {
  squareCatalogObjectId: string;
  squareObjectType: string;
  squareName: string;
  squareSku: string | null;
  itemVariationPrice: number | null;
  itemVariationCurrency: string | null;
  mappedItemId: number | null;
}

@Injectable()
export class GetSquareCatalogItems {
  constructor(
    private readonly squareApi: SquareApiClient,

    @Inject(SquareConnection.name)
    private readonly connectionModel: TenantModelProxy<typeof SquareConnection>,

    @Inject(SquareItemMapping.name)
    private readonly itemMappingModel: TenantModelProxy<
      typeof SquareItemMapping
    >,
  ) {}

  /**
   * Pull a page of Square Catalog items (ITEM + ITEM_VARIATION) and merge in
   * any existing mappings so the UI can render state ("mapped" vs "ignore"
   * vs "unmapped"). Pagination cursor passes through — Square caps pages
   * around 100 objects.
   */
  public async list(
    connectionId: number,
    cursor?: string,
  ): Promise<{ items: SquareCatalogRow[]; nextCursor: string | null }> {
    const connection = await this.connectionModel()
      .query()
      .findById(connectionId)
      .throwIfNotFound();

    const res = await this.squareApi.request(connection, {
      method: 'GET',
      url: '/v2/catalog/list',
      params: {
        types: 'ITEM,ITEM_VARIATION',
        ...(cursor ? { cursor } : {}),
      },
    });
    if (res.status !== 200) {
      throw new Error(
        `Square catalog list failed: ${res.status} ${JSON.stringify(res.data)}`,
      );
    }

    const objects = (res.data?.objects ?? []) as any[];
    const ids = objects.map((o) => o.id);
    const mappings = ids.length
      ? await this.itemMappingModel()
          .query()
          .where('connectionId', connectionId)
          .whereIn('squareCatalogObjectId', ids)
      : [];
    const mappingByObjectId = new Map(
      mappings.map((m) => [m.squareCatalogObjectId, m]),
    );

    const rows: SquareCatalogRow[] = objects.map((o) => {
      const itemData = o.item_data ?? {};
      const variationData = o.item_variation_data ?? {};
      const name =
        itemData.name ??
        variationData.name ??
        o.custom_attribute_values?.name ??
        o.id;
      const priceMoney = variationData.price_money;
      return {
        squareCatalogObjectId: o.id,
        squareObjectType: o.type,
        squareName: name,
        squareSku: variationData.sku ?? null,
        itemVariationPrice: priceMoney?.amount != null
          ? Number(priceMoney.amount) / 100
          : null,
        itemVariationCurrency: priceMoney?.currency ?? null,
        mappedItemId: mappingByObjectId.get(o.id)?.itemId ?? null,
      };
    });

    return { items: rows, nextCursor: res.data?.cursor ?? null };
  }
}
