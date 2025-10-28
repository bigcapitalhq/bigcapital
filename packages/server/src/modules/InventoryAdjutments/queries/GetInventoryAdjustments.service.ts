import { Inject, Injectable } from '@nestjs/common';
import * as R from 'ramda';
import { IPaginationMeta } from '@/interfaces/Model';
import { InventoryAdjustmentTransformer } from '../InventoryAdjustmentTransformer';
import { InventoryAdjustment } from '../models/InventoryAdjustment';
import { IInventoryAdjustmentsFilter } from '../types/InventoryAdjustments.types';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { DynamicListService } from '@/modules/DynamicListing/DynamicList.service';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { ISortOrder } from '@/modules/DynamicListing/DynamicFilter/DynamicFilter.types';

@Injectable()
export class GetInventoryAdjustmentsService {
  constructor(
    private readonly transformer: TransformerInjectable,
    private readonly dynamicListService: DynamicListService,

    @Inject(InventoryAdjustment.name)
    private readonly inventoryAdjustmentModel: TenantModelProxy<
      typeof InventoryAdjustment
    >,
  ) {}
  /**
   * Retrieve the inventory adjustments paginated list.
   * @param {number} tenantId
   * @param {IInventoryAdjustmentsFilter} adjustmentsFilter
   */
  public async getInventoryAdjustments(
    filterDTO: IInventoryAdjustmentsFilter,
  ): Promise<{
    data: InventoryAdjustment[];
    pagination: IPaginationMeta;
  }> {
    const parsedFilterDto = {
      sortOrder: ISortOrder.DESC,
      columnSortBy: 'created_at',
      page: 1,
      pageSize: 12,
      ...filterDTO,
    };
    // Parses inventory adjustments list filter DTO.
    const filter = this.parseListFilterDTO(parsedFilterDto);

    // Dynamic list service.
    const dynamicFilter = await this.dynamicListService.dynamicList(
      this.inventoryAdjustmentModel(),
      filter,
    );
    const { results, pagination } = await this.inventoryAdjustmentModel()
      .query()
      .onBuild((query) => {
        query.withGraphFetched('entries.item');
        query.withGraphFetched('adjustmentAccount');

        dynamicFilter.buildQuery()(query);
      })
      .pagination(filter.page - 1, filter.pageSize);

    // Retrieves the transformed inventory adjustments.
    const data = await this.transformer.transform(
      results,
      new InventoryAdjustmentTransformer(),
    );
    return { data, pagination };
  }

  /**
   * Parses inventory adjustments list filter DTO.
   * @param filterDTO -
   */
  private parseListFilterDTO(filterDTO) {
    return R.compose(this.dynamicListService.parseStringifiedFilter)(filterDTO);
  }
}
