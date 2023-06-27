import { Service, Inject } from 'typedi';
import events from '@/subscribers/events';
import {
  IVendorCreditCreatedPayload,
  IVendorCreditDeletedPayload,
  IVendorCreditEditedPayload,
  IVendorCreditOpenedPayload,
} from '@/interfaces';
import VendorCreditGLEntries from './VendorCreditGLEntries';

@Service()
export default class VendorCreditGlEntriesSubscriber {
  @Inject()
  private vendorCreditGLEntries: VendorCreditGLEntries;

  /***
   * Attaches events with handlers.
   */
  public attach(bus) {
    bus.subscribe(
      events.vendorCredit.onCreated,
      this.writeGLEntriesOnceVendorCreditCreated
    );
    bus.subscribe(
      events.vendorCredit.onOpened,
      this.writeGLEntriesOnceVendorCreditOpened
    );
    bus.subscribe(
      events.vendorCredit.onEdited,
      this.editGLEntriesOnceVendorCreditEdited
    );
    bus.subscribe(
      events.vendorCredit.onDeleted,
      this.revertGLEntriesOnceDeleted
    );
  }

  /**
   * Writes GL entries of vendor credit once the transaction created.
   * @param {IVendorCreditCreatedPayload} payload -
   */
  private writeGLEntriesOnceVendorCreditCreated = async ({
    tenantId,
    vendorCredit,
    trx,
  }: IVendorCreditCreatedPayload): Promise<void> => {
    // Can't continue if the vendor credit is not open yet.
    if (!vendorCredit.isPublished) return;

    await this.vendorCreditGLEntries.writeVendorCreditGLEntries(
      tenantId,
      vendorCredit.id,
      trx
    );
  };

  /**
   * Writes Gl entries of vendor credit once the transaction opened.
   * @param {IVendorCreditOpenedPayload} payload -
   */
  private writeGLEntriesOnceVendorCreditOpened = async ({
    tenantId,
    vendorCreditId,
    trx,
  }: IVendorCreditOpenedPayload) => {
    await this.vendorCreditGLEntries.writeVendorCreditGLEntries(
      tenantId,
      vendorCreditId,
      trx
    );
  };

  /**
   * Edits associated GL entries once vendor credit edited.
   * @param {IVendorCreditEditedPayload} payload
   */
  private editGLEntriesOnceVendorCreditEdited = async ({
    tenantId,
    vendorCreditId,
    vendorCredit,
    trx,
  }: IVendorCreditEditedPayload) => {
    // Can't continue if the vendor credit is not open yet.
    if (!vendorCredit.isPublished) return;

    await this.vendorCreditGLEntries.rewriteVendorCreditGLEntries(
      tenantId,
      vendorCreditId,
      trx
    );
  };

  /**
   * Reverts the GL entries once vendor credit deleted.
   * @param {IVendorCreditDeletedPayload} payload -
   */
  private revertGLEntriesOnceDeleted = async ({
    vendorCreditId,
    tenantId,
    oldVendorCredit,
  }: IVendorCreditDeletedPayload): Promise<void> => {
    // Can't continue of the vendor credit is not open yet.
    if (!oldVendorCredit.isPublished) return;

    await this.vendorCreditGLEntries.revertVendorCreditGLEntries(
      tenantId,
      vendorCreditId
    );
  };
}
