import { Inject, Service } from 'typedi';
import events from '@/subscribers/events';
import TenancyService from '@/services/Tenancy/TenancyService';
import BillsService from '@/services/Purchases/Bills';
import {
  IBillCreatedPayload,
  IBillEditedPayload,
  IBIllEventDeletedPayload,
} from '@/interfaces';
import { BillGLEntries } from './BillGLEntries';

@Service()
export class BillGLEntriesSubscriber {
  @Inject()
  tenancy: TenancyService;

  @Inject()
  billGLEntries: BillGLEntries;

  /**
   * Attaches events with handles.
   */
  attach(bus) {
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
    trx,
  }: IBillCreatedPayload) => {
    await this.billGLEntries.writeBillGLEntries(tenantId, billId, trx);
  };

  /**
   * Handles the overwriting journal entries once bill edited.
   * @param {IBillEditedPayload} payload -
   */
  private handleOverwriteJournalEntriesOnEdit = async ({
    tenantId,
    billId,
    trx,
  }: IBillEditedPayload) => {
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
