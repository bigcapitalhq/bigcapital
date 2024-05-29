import { Inject, Service } from 'typedi';
import { isEmpty } from 'lodash';
import {
  ISaleInvoiceCreatedPayload,
  ISaleInvoiceCreatingPaylaod,
  ISaleInvoiceDeletePayload,
  ISaleInvoiceEditedPayload,
} from '@/interfaces';
import events from '@/subscribers/events';
import { LinkAttachment } from '../LinkAttachment';
import { ValidateAttachments } from '../ValidateAttachments';
import { UnlinkAttachment } from '../UnlinkAttachment';

@Service()
export class AttachmentsOnSaleInvoiceCreated {
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
      events.saleInvoice.onCreating,
      this.validateAttachmentsOnSaleInvoiceCreate.bind(this)
    );
    bus.subscribe(
      events.saleInvoice.onCreated,
      this.handleAttachmentsOnSaleInvoiceCreated.bind(this)
    );
    bus.subscribe(
      events.saleInvoice.onEdited,
      this.handleUnlinkUnpresentedKeysOnInvoiceEdited.bind(this)
    );
    bus.subscribe(
      events.saleInvoice.onEdited,
      this.handleLinkPresentedKeysOnInvoiceEdited.bind(this)
    );
    bus.subscribe(
      events.saleInvoice.onDeleting,
      this.handleUnlinkAttachmentsOnInvoiceDeleted.bind(this)
    );
  }

  /**
   * Validates the attachment keys on creating sale invoice.
   * @param {ISaleInvoiceCreatingPaylaod}
   * @returns {Promise<void>}
   */
  private async validateAttachmentsOnSaleInvoiceCreate({
    saleInvoiceDTO,
    tenantId,
  }: ISaleInvoiceCreatingPaylaod): Promise<void> {
    if (isEmpty(saleInvoiceDTO.attachments)) {
      return;
    }
    const documentKeys = saleInvoiceDTO?.attachments?.map((a) => a.key);

    await this.validateDocuments.validate(tenantId, documentKeys);
  }

  /**
   * Handles linking the attachments of the created sale invoice.
   * @param {ISaleInvoiceCreatedPayload}
   * @returns {Promise<void>}
   */
  private async handleAttachmentsOnSaleInvoiceCreated({
    tenantId,
    saleInvoiceDTO,
    saleInvoice,
    trx,
  }: ISaleInvoiceCreatedPayload): Promise<void> {
    if (isEmpty(saleInvoiceDTO.attachments)) return;

    const keys = saleInvoiceDTO.attachments?.map(
      (attachment) => attachment.key
    );
    await this.linkAttachmentService.bulkLink(
      tenantId,
      keys,
      'SaleInvoice',
      saleInvoice.id,
      trx
    );
  }

  /**
   * Handles unlinking all the unpresented keys of the edited sale invoice.
   * @param {ISaleInvoiceEditedPayload}
   */
  private async handleUnlinkUnpresentedKeysOnInvoiceEdited({
    tenantId,
    saleInvoiceDTO,
    saleInvoice,
    trx,
  }: ISaleInvoiceEditedPayload) {
    // if (isEmpty(saleInvoiceDTO.attachments)) return;

    const keys = saleInvoiceDTO.attachments?.map(
      (attachment) => attachment.key
    );
    await this.unlinkAttachmentService.unlinkUnpresentedKeys(
      tenantId,
      keys,
      'SaleInvoice',
      saleInvoice.id,
      trx
    );
  }

  /**
   * Handles linking all the presented keys of the edited sale invoice.
   * @param {ISaleInvoiceEditedPayload}
   * @returns {Promise<void>}
   */
  private async handleLinkPresentedKeysOnInvoiceEdited({
    tenantId,
    saleInvoiceDTO,
    oldSaleInvoice,
    trx,
  }: ISaleInvoiceEditedPayload) {
    if (isEmpty(saleInvoiceDTO.attachments)) return;

    const keys = saleInvoiceDTO.attachments?.map(
      (attachment) => attachment.key
    );
    await this.linkAttachmentService.bulkLink(
      tenantId,
      keys,
      'SaleInvoice',
      oldSaleInvoice.id,
      trx
    );
  }

  /**
   * Unlink all attachments once the invoice deleted.
   * @param {ISaleInvoiceDeletedPayload}
   * @returns {Promise<void>}
   */
  private async handleUnlinkAttachmentsOnInvoiceDeleted({
    tenantId,
    saleInvoice,
    trx,
  }: ISaleInvoiceDeletePayload) {
    await this.unlinkAttachmentService.unlinkAllModelKeys(
      tenantId,
      'SaleInvoice',
      saleInvoice.id,
      trx
    );
  }
}
