import { isEmpty } from 'lodash';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  ISaleReceiptCreatedPayload,
  ISaleReceiptCreatingPayload,
  ISaleReceiptDeletingPayload,
  ISaleReceiptEditedPayload,
} from '../../SaleReceipts/types/SaleReceipts.types';
import { ValidateAttachments } from '../ValidateAttachments';
import { LinkAttachment } from '../LinkAttachment';
import { UnlinkAttachment } from '../UnlinkAttachment';
import { events } from '@/common/events/events';

@Injectable()
export class AttachmentsOnSaleReceipt {
  constructor(
    private readonly linkAttachmentService: LinkAttachment,
    private readonly unlinkAttachmentService: UnlinkAttachment,
    private readonly validateDocuments: ValidateAttachments,
  ) {}

  /**
   * Validates the attachment keys on creating sale receipt.
   * @param {ISaleReceiptCreatingPayload}
   * @returns {Promise<void>}
   */
  @OnEvent(events.saleReceipt.onCreating)
  async validateAttachmentsOnSaleInvoiceCreate({
    saleReceiptDTO,
  }: ISaleReceiptCreatingPayload): Promise<void> {
    if (isEmpty(saleReceiptDTO.attachments)) {
      return;
    }
    const documentKeys = saleReceiptDTO?.attachments?.map((a) => a.key);

    await this.validateDocuments.validate(documentKeys);
  }

  /**
   * Handles linking the attachments of the created sale receipt.
   * @param {ISaleReceiptCreatedPayload}
   * @returns {Promise<void>}
   */
  @OnEvent(events.saleReceipt.onCreated)
  async handleAttachmentsOnSaleInvoiceCreated({
    saleReceiptDTO,
    saleReceipt,
    trx,
  }: ISaleReceiptCreatedPayload): Promise<void> {
    if (isEmpty(saleReceiptDTO.attachments)) return;

    const keys = saleReceiptDTO.attachments?.map(
      (attachment) => attachment.key,
    );
    await this.linkAttachmentService.bulkLink(
      keys,
      'SaleReceipt',
      saleReceipt.id,
      trx,
    );
  }

  /**
   * Handles unlinking all the unpresented keys of the edited sale receipt.
   * @param {ISaleReceiptEditedPayload}
   */
  @OnEvent(events.saleReceipt.onEdited)
  async handleUnlinkUnpresentedKeysOnInvoiceEdited({
    saleReceiptDTO,
    saleReceipt,
    trx,
  }: ISaleReceiptEditedPayload) {
    const keys = saleReceiptDTO.attachments?.map(
      (attachment) => attachment.key,
    );
    await this.unlinkAttachmentService.unlinkUnpresentedKeys(
      keys,
      'SaleReceipt',
      saleReceipt.id,
      trx,
    );
  }

  /**
   * Handles linking all the presented keys of the edited sale receipt.
   * @param {ISaleReceiptEditedPayload}
   * @returns {Promise<void>}
   */
  @OnEvent(events.saleReceipt.onEdited)
  async handleLinkPresentedKeysOnInvoiceEdited({
    saleReceiptDTO,
    oldSaleReceipt,
    trx,
  }: ISaleReceiptEditedPayload) {
    if (isEmpty(saleReceiptDTO.attachments)) return;

    const keys = saleReceiptDTO.attachments?.map(
      (attachment) => attachment.key,
    );
    await this.linkAttachmentService.bulkLink(
      keys,
      'SaleReceipt',
      oldSaleReceipt.id,
      trx,
    );
  }

  /**
   * Unlink all attachments once the receipt deleted.
   * @param {ISaleReceiptDeletingPayload}
   * @returns {Promise<void>}
   */
  @OnEvent(events.saleReceipt.onDeleting)
  async handleUnlinkAttachmentsOnReceiptDeleted({
    oldSaleReceipt,
    trx,
  }: ISaleReceiptDeletingPayload) {
    await this.unlinkAttachmentService.unlinkAllModelKeys(
      'SaleReceipt',
      oldSaleReceipt.id,
      trx,
    );
  }
}
