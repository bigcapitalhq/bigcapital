// import { Injectable } from '@nestjs/common';
// import * as R from 'ramda';
// import {
//   IBill,
//   IBillsFilter,
//   IFilterMeta,
//   IPaginationMeta,
// } from '@/interfaces';
// import { BillTransformer } from './Bill.transformer';
// import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
// // import { DynamicListingService } from '@/modules/DynamicListing/DynamicListService';

// @Injectable()
// export class GetBills {
//   constructor(
//     private transformer: TransformerInjectable,
//     private dynamicListService: DynamicListingService,
//   ) {}

//   /**
//    * Retrieve bills data table list.
//    * @param {number} tenantId -
//    * @param {IBillsFilter} billsFilter -
//    */
//   public async getBills(
//     tenantId: number,
//     filterDTO: IBillsFilter,
//   ): Promise<{
//     bills: IBill;
//     pagination: IPaginationMeta;
//     filterMeta: IFilterMeta;
//   }> {
//     // Parses bills list filter DTO.
//     const filter = this.parseListFilterDTO(filterDTO);

//     // Dynamic list service.
//     const dynamicFilter = await this.dynamicListService.dynamicList(
//       tenantId,
//       Bill,
//       filter,
//     );
//     const { results, pagination } = await Bill.query()
//       .onBuild((builder) => {
//         builder.withGraphFetched('vendor');
//         builder.withGraphFetched('entries.item');
//         dynamicFilter.buildQuery()(builder);

//         // Filter query.
//         filterDTO?.filterQuery && filterDTO?.filterQuery(builder);
//       })
//       .pagination(filter.page - 1, filter.pageSize);

//     // Tranform the bills to POJO.
//     const bills = await this.transformer.transform(
//       results,
//       new PurchaseInvoiceTransformer(),
//     );
//     return {
//       bills,
//       pagination,
//       filterMeta: dynamicFilter.getResponseMeta(),
//     };
//   }

//   /**
//    * Parses bills list filter DTO.
//    * @param filterDTO -
//    */
//   private parseListFilterDTO(filterDTO) {
//     return R.compose(this.dynamicListService.parseStringifiedFilter)(filterDTO);
//   }
// }
