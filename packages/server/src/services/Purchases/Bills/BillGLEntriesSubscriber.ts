import { Inject, Service } from 'typedi';
import events from '@/subscribers/events';
import {
  IBillCreatedPayload,
  IBillEditedPayload,
  IBIllEventDeletedPayload,
  IBillOpenedPayload,
} from '@/interfaces';
import { BillGLEntries } from './BillGLEntries';

@Service()
export class BillGLEntriesSubscriber {
  @Inject()
  private billGLEntries: BillGLEntries;

  /**
   * Attaches events with handles.
   */
  public attach(bus) {
    bus.subscribe(
      events.bill.onCreated,
      this.handlerWriteJournalEntriesOnCreate
    );
    bus.subscribe(
      events.bill.onOpened,
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
    bill,
    trx,
  }: IBillCreatedPayload | IBillOpenedPayload) => {
    if (!bill.openedAt) return null;

    await this.billGLEntries.writeBillGLEntries(tenantId, bill.id, trx);
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
    if (!bill.openedAt) return null;

    await this.billGLEntries.rewriteBillGLEntries(tenantId, billId, trx);
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
    await this.billGLEntries.revertBillGLEntries(tenantId, billId, trx);
  };
}
