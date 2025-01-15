// import { pick } from 'lodash';
// import { Inject, Injectable } from '@nestjs/common';
// import { EventEmitter2 } from '@nestjs/event-emitter';
// import { Knex } from 'knex';
// import {
//   IInventoryLotCost,
//   IInventoryTransaction,
//   TInventoryTransactionDirection,
//   IItemEntry,
//   IItemEntryTransactionType,
//   IInventoryTransactionsCreatedPayload,
//   IInventoryTransactionsDeletedPayload,
//   IInventoryItemCostScheduledPayload,
// } from '@/interfaces';
// import { InventoryAverageCostMethod } from './InventoryAverageCost';
// import { InventoryCostLotTracker } from './InventoryCostLotTracker';
// import { ItemsEntriesService } from '../Items/ItemsEntries.service';
// import { UnitOfWork } from '../Tenancy/TenancyDB/UnitOfWork.service';
// import { Item } from '../Items/models/Item';
// import { SETTINGS_PROVIDER } from '../Settings/Settings.types';
// import { SettingsStore } from '../Settings/SettingsStore';
// import { events } from '@/common/events/events';
// import { InventoryTransaction } from './models/InventoryTransaction';
// import InventoryCostMethod from './InventoryCostMethod';

// @Injectable()
// export class InventoryService {
//   constructor(
//     private readonly eventEmitter: EventEmitter2,
//     private readonly uow: UnitOfWork,

//     @Inject(InventoryTransaction.name)
//     private readonly inventoryTransactionModel: typeof InventoryTransaction,

//     @Inject(InventoryCostLotTracker.name)
//     private readonly inventoryCostLotTracker: typeof InventoryCostLotTracker,

//     @Inject(SETTINGS_PROVIDER)
//     private readonly settings: SettingsStore,
//   ) {}

//   /**
//    * Transforms the items entries to inventory transactions.
//    */
//   transformItemEntriesToInventory(transaction: {
//     transactionId: number;
//     transactionType: IItemEntryTransactionType;
//     transactionNumber?: string;

//     exchangeRate?: number;

//     warehouseId: number | null;

//     date: Date | string;
//     direction: TInventoryTransactionDirection;
//     entries: IItemEntry[];
//     createdAt: Date;
//   }): IInventoryTransaction[] {
//     const exchangeRate = transaction.exchangeRate || 1;

//     return transaction.entries.map((entry: IItemEntry) => ({
//       ...pick(entry, ['itemId', 'quantity']),
//       rate: entry.rate * exchangeRate,
//       transactionType: transaction.transactionType,
//       transactionId: transaction.transactionId,
//       direction: transaction.direction,
//       date: transaction.date,
//       entryId: entry.id,
//       createdAt: transaction.createdAt,
//       costAccountId: entry.costAccountId,

//       warehouseId: entry.warehouseId || transaction.warehouseId,
//       meta: {
//         transactionNumber: transaction.transactionNumber,
//         description: entry.description,
//       },
//     }));
//   }

//   async computeItemCost(fromDate: Date, itemId: number) {
//     return this.uow.withTransaction((trx: Knex.Transaction) => {
//       return this.computeInventoryItemCost(fromDate, itemId);
//     });
//   }

//   /**
//    * Computes the given item cost and records the inventory lots transactions
//    * and journal entries based on the cost method FIFO, LIFO or average cost rate.
//    * @param {Date} fromDate - From date.
//    * @param {number} itemId - Item id.
//    */
//   async computeInventoryItemCost(
//     fromDate: Date,
//     itemId: number,
//     trx?: Knex.Transaction,
//   ) {
//     // Fetches the item with associated item category.
//     const item = await Item.query().findById(itemId);

//     // Cannot continue if the given item was not inventory item.
//     if (item.type !== 'inventory') {
//       throw new Error('You could not compute item cost has no inventory type.');
//     }
//     let costMethodComputer: InventoryCostMethod;

//     // Switch between methods based on the item cost method.
//     switch ('AVG') {
//       case 'FIFO':
//       case 'LIFO':
//         costMethodComputer = new InventoryCostLotTracker(
//           tenantId,
//           fromDate,
//           itemId,
//         );
//         break;
//       case 'AVG':
//         costMethodComputer = new InventoryAverageCostMethod(
//           fromDate,
//           itemId,
//           trx,
//         );
//         break;
//     }
//     return costMethodComputer.computeItemCost();
//   }

//   /**
//    * Schedule item cost compute job.
//    * @param {number} tenantId
//    * @param {number} itemId
//    * @param {Date} startingDate
//    */
//   async scheduleComputeItemCost(
//     tenantId: number,
//     itemId: number,
//     startingDate: Date | string,
//   ) {
//     const agenda = Container.get('agenda');

//     const commonJobsQuery = {
//       name: 'compute-item-cost',
//       lastRunAt: { $exists: false },
//       'data.tenantId': tenantId,
//       'data.itemId': itemId,
//     };
//     // Cancel any `compute-item-cost` in the queue has upper starting date
//     // with the same given item.
//     await agenda.cancel({
//       ...commonJobsQuery,
//       'data.startingDate': { $lte: startingDate },
//     });
//     // Retrieve any `compute-item-cost` in the queue has lower starting date
//     // with the same given item.
//     const dependsJobs = await agenda.jobs({
//       ...commonJobsQuery,
//       'data.startingDate': { $gte: startingDate },
//     });
//     // If the depends jobs cleared.
//     if (dependsJobs.length === 0) {
//       await agenda.schedule(
//         config.scheduleComputeItemCost,
//         'compute-item-cost',
//         {
//           startingDate,
//           itemId,
//           tenantId,
//         },
//       );
//       // Triggers `onComputeItemCostJobScheduled` event.
//       await this.eventPublisher.emitAsync(
//         events.inventory.onComputeItemCostJobScheduled,
//         {
//           startingDate,
//           itemId,
//           tenantId,
//         } as IInventoryItemCostScheduledPayload,
//       );
//     } else {
//       // Re-schedule the jobs that have higher date from current moment.
//       await Promise.all(
//         dependsJobs.map((job) =>
//           job.schedule(config.scheduleComputeItemCost).save(),
//         ),
//       );
//     }
//   }


//   /**
//    * Mark item cost computing is running.
//    * @param {boolean} isRunning -
//    */
//   async markItemsCostComputeRunning(isRunning: boolean = true) {
//     this.settings.set({
//       key: 'cost_compute_running',
//       group: 'inventory',
//       value: isRunning,
//     });
//     await this.settings.save();
//   }

//   /**
//    * Checks if the items cost compute is running.
//    * @returns {boolean}
//    */
//   isItemsCostComputeRunning() {
//     return (
//       this.settings.get({
//         key: 'cost_compute_running',
//         group: 'inventory',
//       }) ?? false
//     );
//   }
// }
