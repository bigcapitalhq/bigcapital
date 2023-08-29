import { Inject, Service } from 'typedi';
import events from '@/subscribers/events';
import TenancyService from '@/services/Tenancy/TenancyService';
import BillsService from '@/services/Purchases/Bills';
import {
  IBillCreatedPayload,
  IBillEditedPayload,
  IBIllEventDeletedPayload,
} from '@/interfaces';

@Service()
export default class BillWriteGLEntriesSubscriber {
  @Inject()
  tenancy: TenancyService;

  @Inject()
  billsService: BillsService;

  /**
   * Attaches events with handles.
   */
  public attach(bus) {
    bus.subscribe(
      events.bill.onCreated,
      this.handlerWriteJournalEntriesOnCreate
    );
    bus.subscribe(
      events.bill.onEdited,
      this.handleOverwriteJournalEntriesOnEdit
    );
    bus.subscribe(events.bill.onDeleted, this.handlerDeleteJournalEntries);
  }

  /**
   * Handles writing journal entries once bill created.
   * @param {IBillCreatedPayload} payload -
   */
  private handlerWriteJournalEntriesOnCreate = async ({
    tenantId,
    billId,
    bill,
    trx,
  }: IBillCreatedPayload) => {
    // Can't continue if the bill is not opened yet.
    if (!bill.openedAt) return null;

    await this.billsService.recordJournalTransactions(
      tenantId,
      billId,
      false,
      trx
    );
  };

  /**
   * Handles the overwriting journal entries once bill edited.
   * @param {IBillEditedPayload} payload -
   */
  private handleOverwriteJournalEntriesOnEdit = async ({
    tenantId,
    billId,
    bill,
    trx,
  }: IBillEditedPayload) => {
    // Can't continue if the bill is not opened yet.
    if (!bill.openedAt) return null;

    await this.billsService.recordJournalTransactions(
      tenantId,
      billId,
      true,
      trx
    );
  };

  /**
   * Handles revert journal entries on bill deleted.
   * @param {IBIllEventDeletedPayload} payload -
   */
  private handlerDeleteJournalEntries = async ({
    tenantId,
    billId,
    trx,
  }: IBIllEventDeletedPayload) => {
    await this.billsService.revertJournalEntries(tenantId, billId, trx);
  };
}
