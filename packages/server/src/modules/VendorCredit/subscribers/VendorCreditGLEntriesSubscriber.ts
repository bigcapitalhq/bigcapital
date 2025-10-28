import { Injectable } from '@nestjs/common';
import {
  IVendorCreditCreatedPayload,
  IVendorCreditDeletedPayload,
  IVendorCreditEditedPayload,
  IVendorCreditOpenedPayload,
} from '../types/VendorCredit.types';
import { OnEvent } from '@nestjs/event-emitter';
import { VendorCreditGLEntries } from '../commands/VendorCreditGLEntries';
import { events } from '@/common/events/events';

@Injectable()
export class VendorCreditGlEntriesSubscriber {
  constructor(public readonly vendorCreditGLEntries: VendorCreditGLEntries) {}

  /**
   * Writes GL entries of vendor credit once the transaction created.
   * @param {IVendorCreditCreatedPayload} payload -
   */
  @OnEvent(events.vendorCredit.onCreated)
  public async writeGLEntriesOnceVendorCreditCreated({
    vendorCredit,
    trx,
  }: IVendorCreditCreatedPayload): Promise<void> {
    // Can't continue if the vendor credit is not open yet.
    if (!vendorCredit.isPublished) return;

    await this.vendorCreditGLEntries.writeVendorCreditGLEntries(
      vendorCredit.id,
      trx,
    );
  }

  /**
   * Writes Gl entries of vendor credit once the transaction opened.
   * @param {IVendorCreditOpenedPayload} payload -
   */
  @OnEvent(events.vendorCredit.onOpened)
  public async writeGLEntgriesOnceVendorCreditOpened({
    vendorCreditId,
    trx,
  }: IVendorCreditOpenedPayload): Promise<void> {
    await this.vendorCreditGLEntries.writeVendorCreditGLEntries(
      vendorCreditId,
      trx,
    );
  }

  /**
   * Edits associated GL entries once vendor credit edited.
   * @param {IVendorCreditEditedPayload} payload
   */
  @OnEvent(events.vendorCredit.onEdited)
  public async editGLEntriesOnceVendorCreditEdited({
    vendorCredit,
    trx,
  }: IVendorCreditEditedPayload): Promise<void> {
    // Can't continue if the vendor credit is not open yet.
    if (!vendorCredit.isPublished) return;

    await this.vendorCreditGLEntries.rewriteVendorCreditGLEntries(
      vendorCredit.id,
      trx,
    );
  }

  /**
   * Reverts the GL entries once vendor credit deleted.
   * @param {IVendorCreditDeletedPayload} payload -
   */
  @OnEvent(events.vendorCredit.onDeleted)
  public async revertGLEntriesOnceDeleted({
    vendorCreditId,
    oldVendorCredit,
  }: IVendorCreditDeletedPayload): Promise<void> {
    // Can't continue of the vendor credit is not open yet.
    if (!oldVendorCredit.isPublished) return;

    await this.vendorCreditGLEntries.revertVendorCreditGLEntries(
      vendorCreditId,
    );
  }
}
