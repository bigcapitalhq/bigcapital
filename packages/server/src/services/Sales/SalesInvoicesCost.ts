import { Container, Service, Inject } from 'typedi';
import { chain } from 'lodash';
import moment from 'moment';
import { Knex } from 'knex';
import InventoryService from '@/services/Inventory/Inventory';
import TenancyService from '@/services/Tenancy/TenancyService';
import {
  IInventoryCostLotsGLEntriesWriteEvent,
  IInventoryTransaction,
} from '@/interfaces';
import UnitOfWork from '@/services/UnitOfWork';
import { SaleInvoiceCostGLEntries } from './Invoices/SaleInvoiceCostGLEntries';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import events from '@/subscribers/events';

@Service()
export default class SaleInvoicesCost {
  @Inject()
  private inventoryService: InventoryService;

  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private costGLEntries: SaleInvoiceCostGLEntries;

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
    const asyncOpers: Promise<[]>[] = [];

    inventoryItemsIds.forEach((inventoryItemId: number) => {
      const oper: Promise<[]> = this.inventoryService.scheduleComputeItemCost(
        tenantId,
        inventoryItemId,
        startingDate
      );
      asyncOpers.push(oper);
    });
    await Promise.all([...asyncOpers]);
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
        const comparatorDate = acc[transaction.itemId];

        if (
          !comparatorDate ||
          moment(comparatorDate.date).isBefore(transaction.date)
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
    const asyncOpers: Promise<[]>[] = [];
    const reducedTransactions = this.getMaxDateInventoryTransactions(
      inventoryTransactions
    );
    reducedTransactions.forEach((transaction) => {
      const oper: Promise<[]> = this.inventoryService.scheduleComputeItemCost(
        tenantId,
        transaction.itemId,
        transaction.date
      );
      asyncOpers.push(oper);
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
   * @param   {number} tenantId -
   * @param   {Date} startingDate -
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
