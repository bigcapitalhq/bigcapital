import { Mutex } from 'async-mutex';
import { chain } from 'lodash';
import * as moment from 'moment';
import { Knex } from 'knex';
import { Injectable } from '@nestjs/common';
import { UnitOfWork } from '../Tenancy/TenancyDB/UnitOfWork.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { ModelObject } from 'objection';
import { InventoryTransaction } from '../InventoryCost/models/InventoryTransaction';
import { IInventoryCostLotsGLEntriesWriteEvent } from '../InventoryCost/types/InventoryCost.types';
import { InventoryComputeCostService } from '../InventoryCost/commands/InventoryComputeCost.service';

@Injectable()
export class SaleInvoicesCost {
  constructor(
    private readonly inventoryService: InventoryComputeCostService,
    private readonly uow: UnitOfWork,
    private readonly eventPublisher: EventEmitter2,
  ) {}

  /**
   * Schedule sale invoice re-compute based on the item
   * cost method and starting date.
   * @param {number[]} itemIds - Inventory items ids.
   * @param {Date} startingDate - Starting compute cost date.
   * @return {Promise<Agenda>}
   */
  async scheduleComputeCostByItemsIds(
    inventoryItemsIds: number[],
    startingDate: Date,
  ): Promise<void> {
    const mutex = new Mutex();
    const asyncOpers = inventoryItemsIds.map(
      async (inventoryItemId: number) => {
        // @todo refactor the lock acquire to be distrbuted using Redis
        // and run the cost schedule job after running invoice transaction.
        const release = await mutex.acquire();

        try {
          await this.inventoryService.scheduleComputeItemCost(
            inventoryItemId,
            startingDate,
          );
        } finally {
          release();
        }
      },
    );
    await Promise.all(asyncOpers);
  }

  /**
   * Retrieve the max dated inventory transactions in the transactions that
   * have the same item id.
   * @param {ModelObject<InventoryTransaction>[]} inventoryTransactions
   * @return {ModelObject<InventoryTransaction>[]}
   */
  getMaxDateInventoryTransactions(
    inventoryTransactions: ModelObject<InventoryTransaction>[],
  ): ModelObject<InventoryTransaction>[] {
    return chain(inventoryTransactions)
      .reduce((acc: any, transaction) => {
        const compatatorDate = acc[transaction.itemId];

        if (
          !compatatorDate ||
          moment(compatatorDate.date).isBefore(transaction.date)
        ) {
          return {
            ...acc,
            [transaction.itemId]: {
              ...transaction,
            },
          };
        }
        return acc;
      }, {})
      .values()
      .value();
  }

  /**
   * Computes items costs by the given inventory transaction.
   * @param {number} tenantId
   * @param {IInventoryTransaction[]} inventoryTransactions
   */
  async computeItemsCostByInventoryTransactions(
    inventoryTransactions: ModelObject<InventoryTransaction>[],
  ) {
    const mutex = new Mutex();
    const reducedTransactions = this.getMaxDateInventoryTransactions(
      inventoryTransactions,
    );
    const asyncOpers = reducedTransactions.map(async (transaction) => {
      const release = await mutex.acquire();

      try {
        await this.inventoryService.scheduleComputeItemCost(
          transaction.itemId,
          transaction.date,
        );
      } finally {
        release();
      }
    });
    await Promise.all([...asyncOpers]);
  }

  /**
   * Schedule writing journal entries.
   * @param {Date} startingDate - Starting date.
   * @return {Promise<agenda>}
   */
  scheduleWriteJournalEntries(startingDate?: Date) {
    // const agenda = Container.get('agenda');
    // return agenda.schedule('in 3 seconds', 'rewrite-invoices-journal-entries', {
    //   startingDate,
    //   tenantId,
    // });
  }

  /**
   * Writes cost GL entries from the inventory cost lots.
   * @param {Date} startingDate - Starting date.
   * @returns {Promise<void>}
   */
  public writeCostLotsGLEntries = async (startingDate: Date) => {
    await this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Triggers event `onInventoryCostLotsGLEntriesBeforeWrite`.
      await this.eventPublisher.emitAsync(
        events.inventory.onCostLotsGLEntriesBeforeWrite,
        {
          startingDate,
          trx,
        } as IInventoryCostLotsGLEntriesWriteEvent,
      );
      // Triggers event `onInventoryCostLotsGLEntriesWrite`.
      await this.eventPublisher.emitAsync(
        events.inventory.onCostLotsGLEntriesWrite,
        {
          startingDate,
          trx,
        } as IInventoryCostLotsGLEntriesWriteEvent,
      );
    });
    // Signal that cost entries have been written so cost_compute_running can be set to false.
    await this.eventPublisher.emitAsync(
      events.inventory.onInventoryCostEntriesWritten,
      {},
    );
  };
}
