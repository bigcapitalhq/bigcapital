import { Injectable } from '@nestjs/common';
import {
  IBillCreatedPayload,
  IBillEditedPayload,
  IBIllEventDeletedPayload,
  IBillOpenedPayload,
} from '../Bills.types';
import { BillGLEntries } from '../commands/BillsGLEntries';
import { events } from '@/common/events/events';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class BillGLEntriesSubscriber {
  /**
   * @param {BillGLEntries} billGLEntries - Bill GL entries command.
   */
  constructor(private billGLEntries: BillGLEntries) {}

  /**
   * Handles writing journal entries once bill created.
   * @param {IBillCreatedPayload} payload -
   */
  @OnEvent(events.bill.onCreated)
  @OnEvent(events.bill.onOpened)
  public async handlerWriteJournalEntriesOnCreate({
    bill,
    trx,
  }: IBillCreatedPayload | IBillOpenedPayload) {
    if (!bill.openedAt) return null;

    await this.billGLEntries.writeBillGLEntries(bill.id, trx);
  };

  /**
   * Handles the overwriting journal entries once bill edited.
   * @param {IBillEditedPayload} payload -
   */
  @OnEvent(events.bill.onEdited)
  public async handleOverwriteJournalEntriesOnEdit({
    bill,
    trx,
  }: IBillEditedPayload) {
    if (!bill.openedAt) return null;

    await this.billGLEntries.rewriteBillGLEntries(bill.id, trx);
  };

  /**
   * Handles revert journal entries on bill deleted.
   * @param {IBIllEventDeletedPayload} payload -
   */
  @OnEvent(events.bill.onDeleted)
  public async handlerDeleteJournalEntries({
    oldBill,
    trx,
  }: IBIllEventDeletedPayload) {
    await this.billGLEntries.revertBillGLEntries(oldBill.id, trx);
  };
}
