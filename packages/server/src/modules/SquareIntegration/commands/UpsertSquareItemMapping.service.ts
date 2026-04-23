import { Inject, Injectable } from '@nestjs/common';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { SquareItemMapping } from '../models/SquareItemMapping.model';
import { UpsertItemMappingDto } from '../dtos/UpsertItemMapping.dto';

@Injectable()
export class UpsertSquareItemMapping {
  constructor(
    @Inject(SquareItemMapping.name)
    private readonly itemMappingModel: TenantModelProxy<
      typeof SquareItemMapping
    >,
  ) {}

  public async upsert(connectionId: number, dto: UpsertItemMappingDto) {
    const existing = await this.itemMappingModel()
      .query()
      .findOne({
        connectionId,
        squareCatalogObjectId: dto.squareCatalogObjectId,
      });
    if (existing) {
      return this.itemMappingModel()
        .query()
        .patchAndFetchById(existing.id, {
          squareObjectType: dto.squareObjectType,
          squareName: dto.squareName ?? null,
          squareSku: dto.squareSku ?? null,
          itemId: dto.itemId ?? null,
          autoCreated: false,
        });
    }
    return this.itemMappingModel()
      .query()
      .insert({
        connectionId,
        squareCatalogObjectId: dto.squareCatalogObjectId,
        squareObjectType: dto.squareObjectType,
        squareName: dto.squareName ?? null,
        squareSku: dto.squareSku ?? null,
        itemId: dto.itemId ?? null,
        autoCreated: false,
      });
  }
}
