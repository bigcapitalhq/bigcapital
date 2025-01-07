// import { InventoryAdjustmentTransformer } from "../InventoryAdjustmentTransformer";
// import { InventoryAdjustment } from "../models/InventoryAdjustment";
// import { IInventoryAdjustmentsFilter } from "../types/InventoryAdjustments.types";

// import { TransformerInjectable } from "@/modules/Transformer/TransformerInjectable.service";

// export class GetInventoryAdjustmentsService {

//   constructor(
//     public readonly transformer: TransformerInjectable,
//     private readonly inventoryAdjustmentModel: typeof InventoryAdjustment,
//   ) {
    
//   }
//   /**
//    * Retrieve the inventory adjustments paginated list.
//    * @param {number} tenantId
//    * @param {IInventoryAdjustmentsFilter} adjustmentsFilter
//    */
//   public async getInventoryAdjustments(
//     tenantId: number,
//     filterDTO: IInventoryAdjustmentsFilter,
//   ): Promise<{
//     inventoryAdjustments: IInventoryAdjustment[];
//     pagination: IPaginationMeta;
//   }> {

//     // Parses inventory adjustments list filter DTO.
//     const filter = this.parseListFilterDTO(filterDTO);

//     // Dynamic list service.
//     const dynamicFilter = await this.dynamicListService.dynamicList(
//       tenantId,
//       InventoryAdjustment,
//       filter,
//     );
//     const { results, pagination } = await this.inventoryAdjustmentModel.query()
//       .onBuild((query) => {
//         query.withGraphFetched('entries.item');
//         query.withGraphFetched('adjustmentAccount');

//         dynamicFilter.buildQuery()(query);
//       })
//       .pagination(filter.page - 1, filter.pageSize);

//     // Retrieves the transformed inventory adjustments.
//     const inventoryAdjustments = await this.transformer.transform(
//       results,
//       new InventoryAdjustmentTransformer(),
//     );
//     return {
//       inventoryAdjustments,
//       pagination,
//     };
//   }
// }
