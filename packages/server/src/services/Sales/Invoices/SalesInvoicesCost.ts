import { Mutex } from 'async-mutex';
import { Container, Service, Inject } from 'typedi';
import { chain } from 'lodash';
import moment from 'moment';
import { Knex } from 'knex';
import InventoryService from '@/services/Inventory/Inventory';
import {
  IInventoryCostLotsGLEntriesWriteEvent,
  IInventoryTransaction,
} from '@/interfaces';
import UnitOfWork from '@/services/UnitOfWork';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import events from '@/subscribers/events';

@Service()
export class SaleInvoicesCost {
  @Inject()
  private inventoryService: InventoryService;

  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private eventPublisher: EventPublisher;

  /**
   * Schedule sale invoice re-compute based on the item
   * cost method and starting date.
   * @param {number[]} itemIds - Inventory items ids.
   * @param {Date} startingDate - Starting compute cost date.
   * @return {Promise<Agenda>}
   */
  async scheduleComputeCostByItemsIds(
    tenantId: number,
    inventoryItemsIds: number[],
    startingDate: Date
  ): Promise<void> {
    const mutex = new Mutex();

    const asyncOpers = inventoryItemsIds.map(
      async (inventoryItemId: number) => {
        // @todo refactor the lock acquire to be distrbuted using Redis
        // and run the cost schedule job after running invoice transaction.
        const release = await mutex.acquire();

        try {
          await this.inventoryService.scheduleComputeItemCost(
            tenantId,
            inventoryItemId,
            startingDate
          );
        } finally {
          release();
        }
      }
    );
    await Promise.all(asyncOpers);
  }

  /**
   * Retrieve the max dated inventory transactions in the transactions that
   * have the same item id.
   * @param {IInventoryTransaction[]} inventoryTransactions
   * @return {IInventoryTransaction[]}
   */
  getMaxDateInventoryTransactions(
    inventoryTransactions: IInventoryTransaction[]
  ): IInventoryTransaction[] {
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
    tenantId: number,
    inventoryTransactions: IInventoryTransaction[]
  ) {
    const mutex = new Mutex();
    const reducedTransactions = this.getMaxDateInventoryTransactions(
      inventoryTransactions
    );
    const asyncOpers = reducedTransactions.map(async (transaction) => {
      const release = await mutex.acquire();

      try {
        await this.inventoryService.scheduleComputeItemCost(
          tenantId,
          transaction.itemId,
          transaction.date
        );
      } finally {
        release();
      }
    });
    await Promise.all([...asyncOpers]);
  }

  /**
   * Schedule writing journal entries.
   * @param {Date} startingDate
   * @return {Promise<agenda>}
   */
  scheduleWriteJournalEntries(tenantId: number, startingDate?: Date) {
    const agenda = Container.get('agenda');

    return agenda.schedule('in 3 seconds', 'rewrite-invoices-journal-entries', {
      startingDate,
      tenantId,
    });
  }

  /**
   * Writes cost GL entries from the inventory cost lots.
   * @param {number} tenantId -
   * @param {Date} startingDate -
   * @returns {Promise<void>}
   */
  public writeCostLotsGLEntries = (tenantId: number, startingDate: Date) => {
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers event `onInventoryCostLotsGLEntriesBeforeWrite`.
      await this.eventPublisher.emitAsync(
        events.inventory.onCostLotsGLEntriesBeforeWrite,
        {
          tenantId,
          startingDate,
          trx,
        } as IInventoryCostLotsGLEntriesWriteEvent
      );
      // Triggers event `onInventoryCostLotsGLEntriesWrite`.
      await this.eventPublisher.emitAsync(
        events.inventory.onCostLotsGLEntriesWrite,
        {
          tenantId,
          startingDate,
          trx,
        } as IInventoryCostLotsGLEntriesWriteEvent
      );
    });
  };
}
