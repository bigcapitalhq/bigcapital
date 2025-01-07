// import { Inject, Service } from 'typedi';
// import { omit } from 'lodash';
// import moment from 'moment';
// import * as R from 'ramda';
// import { Knex } from 'knex';
// import { ServiceError } from '@/exceptions';
// import {
//   IInventoryAdjustment,
//   IPaginationMeta,
//   IInventoryAdjustmentsFilter,
//   IInventoryTransaction,
//   IInventoryAdjustmentEventPublishedPayload,
//   IInventoryAdjustmentEventDeletedPayload,
//   IInventoryAdjustmentDeletingPayload,
//   IInventoryAdjustmentPublishingPayload,
// } from '@/interfaces';
// import events from '@/subscribers/events';
// import DynamicListingService from '@/services/DynamicListing/DynamicListService';
// import HasTenancyService from '@/services/Tenancy/TenancyService';
// import InventoryService from './Inventory';
// import UnitOfWork from '@/services/UnitOfWork';
// import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
// import InventoryAdjustmentTransformer from './InventoryAdjustmentTransformer';
// import { BranchTransactionDTOTransform } from '@/services/Branches/Integrations/BranchTransactionDTOTransform';
// import { WarehouseTransactionDTOTransform } from '@/services/Warehouses/Integrations/WarehouseTransactionDTOTransform';
// import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';

// const ERRORS = {
//   INVENTORY_ADJUSTMENT_NOT_FOUND: 'INVENTORY_ADJUSTMENT_NOT_FOUND',
//   ITEM_SHOULD_BE_INVENTORY_TYPE: 'ITEM_SHOULD_BE_INVENTORY_TYPE',
//   INVENTORY_ADJUSTMENT_ALREADY_PUBLISHED:
//     'INVENTORY_ADJUSTMENT_ALREADY_PUBLISHED',
// };

// @Service()
// export default class InventoryAdjustmentService {
//   @Inject()
//   private tenancy: HasTenancyService;

//   @Inject()
//   private eventPublisher: EventPublisher;

//   @Inject()
//   private inventoryService: InventoryService;

//   @Inject()
//   private dynamicListService: DynamicListingService;

//   @Inject()
//   private uow: UnitOfWork;

//   @Inject()
//   private branchDTOTransform: BranchTransactionDTOTransform;

//   @Inject()
//   private warehouseDTOTransform: WarehouseTransactionDTOTransform;

//   @Inject()
//   private transfromer: TransformerInjectable;

//   /**
//    * Retrieve the inventory adjustment or throw not found service error.
//    * @param {number} tenantId -
//    * @param {number} adjustmentId -
//    */
//   async getInventoryAdjustmentOrThrowError(
//     tenantId: number,
//     adjustmentId: number
//   ) {
//     const { InventoryAdjustment } = this.tenancy.models(tenantId);

//     const inventoryAdjustment = await InventoryAdjustment.query()
//       .findById(adjustmentId)
//       .withGraphFetched('entries');

//     if (!inventoryAdjustment) {
//       throw new ServiceError(ERRORS.INVENTORY_ADJUSTMENT_NOT_FOUND);
//     }
//     return inventoryAdjustment;
//   }


//   /**
//    * Parses inventory adjustments list filter DTO.
//    * @param filterDTO -
//    */
//   private parseListFilterDTO(filterDTO) {
//     return R.compose(this.dynamicListService.parseStringifiedFilter)(filterDTO);
//   }

//   /**
//    * Writes the inventory transactions from the inventory adjustment transaction.
//    * @param  {number} tenantId -
//    * @param  {IInventoryAdjustment} inventoryAdjustment -
//    * @param  {boolean} override -
//    * @param  {Knex.Transaction} trx -
//    * @return {Promise<void>}
//    */
//   public async writeInventoryTransactions(
//     tenantId: number,
//     inventoryAdjustment: IInventoryAdjustment,
//     override: boolean = false,
//     trx?: Knex.Transaction
//   ): Promise<void> {
//     const commonTransaction = {
//       direction: inventoryAdjustment.inventoryDirection,
//       date: inventoryAdjustment.date,
//       transactionType: 'InventoryAdjustment',
//       transactionId: inventoryAdjustment.id,
//       createdAt: inventoryAdjustment.createdAt,
//       costAccountId: inventoryAdjustment.adjustmentAccountId,

//       branchId: inventoryAdjustment.branchId,
//       warehouseId: inventoryAdjustment.warehouseId,
//     };
//     const inventoryTransactions = [];

//     inventoryAdjustment.entries.forEach((entry) => {
//       inventoryTransactions.push({
//         ...commonTransaction,
//         itemId: entry.itemId,
//         quantity: entry.quantity,
//         rate: entry.cost,
//       });
//     });
//     // Saves the given inventory transactions to the storage.
//     await this.inventoryService.recordInventoryTransactions(
//       tenantId,
//       inventoryTransactions,
//       override,
//       trx
//     );
//   }

//   /**
//    * Reverts the inventory transactions from the inventory adjustment transaction.
//    * @param {number} tenantId
//    * @param {number} inventoryAdjustmentId
//    */
//   async revertInventoryTransactions(
//     tenantId: number,
//     inventoryAdjustmentId: number,
//     trx?: Knex.Transaction
//   ): Promise<{ oldInventoryTransactions: IInventoryTransaction[] }> {
//     return this.inventoryService.deleteInventoryTransactions(
//       tenantId,
//       inventoryAdjustmentId,
//       'InventoryAdjustment',
//       trx
//     );
//   }


// }
