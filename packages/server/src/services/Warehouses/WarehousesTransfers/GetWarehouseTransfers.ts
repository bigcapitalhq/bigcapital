import * as R from 'ramda';
import { Service, Inject } from 'typedi';
import DynamicListingService from '@/services/DynamicListing/DynamicListService';
import { IGetWarehousesTransfersFilterDTO } from '@/interfaces';
import { WarehouseTransferTransformer } from './WarehouseTransferTransformer';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';

@Service()
export class GetWarehouseTransfers {
  @Inject()
  private dynamicListService: DynamicListingService;

  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private transformer: TransformerInjectable;

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
    tenantId: number,
    filterDTO: IGetWarehousesTransfersFilterDTO
  ) => {
    const { WarehouseTransfer } = this.tenancy.models(tenantId);

    // Parses stringified filter roles.
    const filter = this.parseListFilterDTO(filterDTO);

    // Dynamic list service.
    const dynamicFilter = await this.dynamicListService.dynamicList(
      tenantId,
      WarehouseTransfer,
      filter
    );
    const { results, pagination } = await WarehouseTransfer.query()
      .onBuild((query) => {
        query.withGraphFetched('entries.item');
        query.withGraphFetched('fromWarehouse');
        query.withGraphFetched('toWarehouse');

        dynamicFilter.buildQuery()(query);
      })
      .pagination(filter.page - 1, filter.pageSize);

    // Retrieves the transformed warehouse transfers
    const warehousesTransfers = await this.transformer.transform(
      tenantId,
      results,
      new WarehouseTransferTransformer()
    );
    return {
      warehousesTransfers,
      pagination,
      filter,
    };
  };
}
