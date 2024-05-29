import { Inject, Service } from 'typedi';
import { isEmpty } from 'lodash';
import {
  ISaleReceiptCreatedPayload,
  ISaleReceiptCreatingPayload,
  ISaleReceiptDeletingPayload,
  ISaleReceiptEditedPayload,
} from '@/interfaces';
import events from '@/subscribers/events';
import { LinkAttachment } from '../LinkAttachment';
import { ValidateAttachments } from '../ValidateAttachments';
import { UnlinkAttachment } from '../UnlinkAttachment';

@Service()
export class AttachmentsOnSaleReceipt {
  @Inject()
  private linkAttachmentService: LinkAttachment;

  @Inject()
  private unlinkAttachmentService: UnlinkAttachment;

  @Inject()
  private validateDocuments: ValidateAttachments;

  /**
   * Constructor method.
   */
  public attach(bus) {
    bus.subscribe(
      events.saleReceipt.onCreating,
      this.validateAttachmentsOnSaleInvoiceCreate.bind(this)
    );
    bus.subscribe(
      events.saleReceipt.onCreated,
      this.handleAttachmentsOnSaleInvoiceCreated.bind(this)
    );
    bus.subscribe(
      events.saleReceipt.onEdited,
      this.handleUnlinkUnpresentedKeysOnInvoiceEdited.bind(this)
    );
    bus.subscribe(
      events.saleReceipt.onEdited,
      this.handleLinkPresentedKeysOnInvoiceEdited.bind(this)
    );
    bus.subscribe(
      events.saleReceipt.onDeleting,
      this.handleUnlinkAttachmentsOnReceiptDeleted.bind(this)
    );
  }

  /**
   * Validates the attachment keys on creating sale receipt.
   * @param {ISaleReceiptCreatingPayload}
   * @returns {Promise<void>}
   */
  private async validateAttachmentsOnSaleInvoiceCreate({
    saleReceiptDTO,
    tenantId,
  }: ISaleReceiptCreatingPayload): Promise<void> {
    if (isEmpty(saleReceiptDTO.attachments)) {
      return;
    }
    const documentKeys = saleReceiptDTO?.attachments?.map((a) => a.key);

    await this.validateDocuments.validate(tenantId, documentKeys);
  }

  /**
   * Handles linking the attachments of the created sale receipt.
   * @param {ISaleReceiptCreatedPayload}
   * @returns {Promise<void>}
   */
  private async handleAttachmentsOnSaleInvoiceCreated({
    tenantId,
    saleReceiptDTO,
    saleReceipt,
    trx,
  }: ISaleReceiptCreatedPayload): Promise<void> {
    if (isEmpty(saleReceiptDTO.attachments)) return;

    const keys = saleReceiptDTO.attachments?.map(
      (attachment) => attachment.key
    );
    await this.linkAttachmentService.bulkLink(
      tenantId,
      keys,
      'SaleReceipt',
      saleReceipt.id,
      trx
    );
  }

  /**
   * Handles unlinking all the unpresented keys of the edited sale receipt.
   * @param {ISaleReceiptEditedPayload}
   */
  private async handleUnlinkUnpresentedKeysOnInvoiceEdited({
    tenantId,
    saleReceiptDTO,
    saleReceipt,
    trx,
  }: ISaleReceiptEditedPayload) {
    const keys = saleReceiptDTO.attachments?.map(
      (attachment) => attachment.key
    );
    await this.unlinkAttachmentService.unlinkUnpresentedKeys(
      tenantId,
      keys,
      'SaleReceipt',
      saleReceipt.id,
      trx
    );
  }

  /**
   * Handles linking all the presented keys of the edited sale receipt.
   * @param {ISaleReceiptEditedPayload}
   * @returns {Promise<void>}
   */
  private async handleLinkPresentedKeysOnInvoiceEdited({
    tenantId,
    saleReceiptDTO,
    oldSaleReceipt,
    trx,
  }: ISaleReceiptEditedPayload) {
    if (isEmpty(saleReceiptDTO.attachments)) return;

    const keys = saleReceiptDTO.attachments?.map(
      (attachment) => attachment.key
    );
    await this.linkAttachmentService.bulkLink(
      tenantId,
      keys,
      'SaleReceipt',
      oldSaleReceipt.id,
      trx
    );
  }

  /**
   * Unlink all attachments once the receipt deleted.
   * @param {ISaleReceiptDeletingPayload}
   * @returns {Promise<void>}
   */
  private async handleUnlinkAttachmentsOnReceiptDeleted({
    tenantId,
    oldSaleReceipt,
    trx,
  }: ISaleReceiptDeletingPayload) {
    await this.unlinkAttachmentService.unlinkAllModelKeys(
      tenantId,
      'SaleReceipt',
      oldSaleReceipt.id,
      trx
    );
  }
}
