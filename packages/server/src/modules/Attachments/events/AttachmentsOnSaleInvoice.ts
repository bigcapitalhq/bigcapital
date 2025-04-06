import { Injectable } from '@nestjs/common';
import { isEmpty } from 'lodash';
import { OnEvent } from '@nestjs/event-emitter';
import {
  ISaleInvoiceCreatedPayload,
  ISaleInvoiceCreatingPaylaod,
  ISaleInvoiceDeletingPayload,
  ISaleInvoiceEditedPayload,
} from '@/modules/SaleInvoices/SaleInvoice.types';
import { ValidateAttachments } from '../ValidateAttachments';
import { LinkAttachment } from '../LinkAttachment';
import { UnlinkAttachment } from '../UnlinkAttachment';
import { events } from '@/common/events/events';

@Injectable()
export class AttachmentsOnSaleInvoiceCreated {
  constructor(
    private readonly linkAttachmentService: LinkAttachment,
    private readonly unlinkAttachmentService: UnlinkAttachment,
    private readonly validateDocuments: ValidateAttachments,
  ) {}

  /**
   * Validates the attachment keys on creating sale invoice.
   * @param {ISaleInvoiceCreatingPaylaod}
   * @returns {Promise<void>}
   */
  @OnEvent(events.saleInvoice.onCreating)
  async validateAttachmentsOnSaleInvoiceCreate({
    saleInvoiceDTO,
  }: ISaleInvoiceCreatingPaylaod): Promise<void> {
    if (isEmpty(saleInvoiceDTO.attachments)) {
      return;
    }
    const documentKeys = saleInvoiceDTO?.attachments?.map((a) => a.key);

    await this.validateDocuments.validate(documentKeys);
  }

  /**
   * Handles linking the attachments of the created sale invoice.
   * @param {ISaleInvoiceCreatedPayload}
   * @returns {Promise<void>}
   */
  @OnEvent(events.saleInvoice.onCreated)
  async handleAttachmentsOnSaleInvoiceCreated({
    saleInvoiceDTO,
    saleInvoice,
    trx,
  }: ISaleInvoiceCreatedPayload): Promise<void> {
    if (isEmpty(saleInvoiceDTO.attachments)) return;

    const keys = saleInvoiceDTO.attachments?.map(
      (attachment) => attachment.key,
    );
    await this.linkAttachmentService.bulkLink(
      keys,
      'SaleInvoice',
      saleInvoice.id,
      trx,
    );
  }

  /**
   * Handles unlinking all the unpresented keys of the edited sale invoice.
   * @param {ISaleInvoiceEditedPayload}
   */
  @OnEvent(events.saleInvoice.onEdited)
  async handleUnlinkUnpresentedKeysOnInvoiceEdited({
    saleInvoiceDTO,
    saleInvoice,
    trx,
  }: ISaleInvoiceEditedPayload) {
    // if (isEmpty(saleInvoiceDTO.attachments)) return;

    const keys = saleInvoiceDTO.attachments?.map(
      (attachment) => attachment.key,
    );
    await this.unlinkAttachmentService.unlinkUnpresentedKeys(
      keys,
      'SaleInvoice',
      saleInvoice.id,
      trx,
    );
  }

  /**
   * Handles linking all the presented keys of the edited sale invoice.
   * @param {ISaleInvoiceEditedPayload}
   * @returns {Promise<void>}
   */
  @OnEvent(events.saleInvoice.onEdited)
  async handleLinkPresentedKeysOnInvoiceEdited({
    saleInvoiceDTO,
    oldSaleInvoice,
    trx,
  }: ISaleInvoiceEditedPayload) {
    if (isEmpty(saleInvoiceDTO.attachments)) return;

    const keys = saleInvoiceDTO.attachments?.map(
      (attachment) => attachment.key,
    );
    await this.linkAttachmentService.bulkLink(
      keys,
      'SaleInvoice',
      oldSaleInvoice.id,
      trx,
    );
  }

  /**
   * Unlink all attachments once the invoice deleted.
   * @param {ISaleInvoiceDeletedPayload}
   * @returns {Promise<void>}
   */
  @OnEvent(events.saleInvoice.onDeleting)
  async handleUnlinkAttachmentsOnInvoiceDeleted({
    oldSaleInvoice,
    trx,
  }: ISaleInvoiceDeletingPayload) {
    await this.unlinkAttachmentService.unlinkAllModelKeys(
      'SaleInvoice',
      oldSaleInvoice.id,
      trx,
    );
  }
}
