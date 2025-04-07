import * as R from 'ramda';
import { Inject, Injectable } from '@nestjs/common';
import { WarehouseTransferTransformer } from './WarehouseTransferTransfomer';
import { IGetWarehousesTransfersFilterDTO } from '../../Warehouses/Warehouse.types';
import { TransformerInjectable } from '../../Transformer/TransformerInjectable.service';
import { DynamicListService } from '../../DynamicListing/DynamicList.service';
import { TenantModelProxy } from '../../System/models/TenantBaseModel';
import { WarehouseTransfer } from '../models/WarehouseTransfer';

@Injectable()
export class GetWarehouseTransfers {
  constructor(
    private readonly dynamicListService: DynamicListService,
    private readonly transformer: TransformerInjectable,

    @Inject(WarehouseTransfer.name)
    private readonly warehouseTransferModel: TenantModelProxy<
      typeof WarehouseTransfer
    >,
  ) {}

  /**
   * Parses the sale invoice list filter DTO.
   * @param filterDTO
   * @returns
   */
  private parseListFilterDTO(filterDTO) {
    return R.compose(this.dynamicListService.parseStringifiedFilter)(filterDTO);
  }

  /**
   * Retrieves warehouse transfers paginated list.
   * @param   {number} tenantId
   * @param   {IGetWarehousesTransfersFilterDTO} filterDTO
   * @returns {}
   */
  public getWarehouseTransfers = async (
    filterDTO: IGetWarehousesTransfersFilterDTO,
  ) => {
    // Parses stringified filter roles.
    const filter = this.parseListFilterDTO(filterDTO);

    // Dynamic list service.
    const dynamicFilter = await this.dynamicListService.dynamicList(
      this.warehouseTransferModel(),
      filter,
    );
    const { results, pagination } = await this.warehouseTransferModel()
      .query()
      .onBuild((query) => {
        query.withGraphFetched('entries.item');
        query.withGraphFetched('fromWarehouse');
        query.withGraphFetched('toWarehouse');

        dynamicFilter.buildQuery()(query);
      })
      .pagination(filter.page - 1, filter.pageSize);

    // Retrieves the transformed warehouse transfers
    const warehousesTransfers = await this.transformer.transform(
      results,
      new WarehouseTransferTransformer(),
    );
    return {
      warehousesTransfers,
      pagination,
      filter,
    };
  };
}
