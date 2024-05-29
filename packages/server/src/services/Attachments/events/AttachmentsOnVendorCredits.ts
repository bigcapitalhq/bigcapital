import { Inject, Service } from 'typedi';
import { isEmpty } from 'lodash';
import {
  IVendorCreditCreatedPayload,
  IVendorCreditCreatingPayload,
  IVendorCreditDeletingPayload,
  IVendorCreditEditedPayload,
} from '@/interfaces';
import events from '@/subscribers/events';
import { LinkAttachment } from '../LinkAttachment';
import { ValidateAttachments } from '../ValidateAttachments';
import { UnlinkAttachment } from '../UnlinkAttachment';

@Service()
export class AttachmentsOnVendorCredits {
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
      events.vendorCredit.onCreating,
      this.validateAttachmentsOnVendorCreditCreate.bind(this)
    );
    bus.subscribe(
      events.vendorCredit.onCreated,
      this.handleAttachmentsOnVendorCreditCreated.bind(this)
    );
    bus.subscribe(
      events.vendorCredit.onEdited,
      this.handleUnlinkUnpresentedKeysOnVendorCreditEdited.bind(this)
    );
    bus.subscribe(
      events.vendorCredit.onEdited,
      this.handleLinkPresentedKeysOnVendorCreditEdited.bind(this)
    );
    bus.subscribe(
      events.vendorCredit.onDeleting,
      this.handleUnlinkAttachmentsOnVendorCreditDeleted.bind(this)
    );
  }

  /**
   * Validates the attachment keys on creating vendor credit.
   * @param {IVendorCreditCreatingPayload}
   * @returns {Promise<void>}
   */
  private async validateAttachmentsOnVendorCreditCreate({
    vendorCreditCreateDTO,
    tenantId,
  }: IVendorCreditCreatingPayload): Promise<void> {
    if (isEmpty(vendorCreditCreateDTO.attachments)) {
      return;
    }
    const documentKeys = vendorCreditCreateDTO?.attachments?.map((a) => a.key);

    await this.validateDocuments.validate(tenantId, documentKeys);
  }

  /**
   * Handles linking the attachments of the created vendor credit.
   * @param {IVendorCreditCreatedPayload}
   * @returns {Promise<void>}
   */
  private async handleAttachmentsOnVendorCreditCreated({
    tenantId,
    vendorCreditCreateDTO,
    vendorCredit,
    trx,
  }: IVendorCreditCreatedPayload): Promise<void> {
    if (isEmpty(vendorCreditCreateDTO.attachments)) return;

    const keys = vendorCreditCreateDTO.attachments?.map(
      (attachment) => attachment.key
    );
    await this.linkAttachmentService.bulkLink(
      tenantId,
      keys,
      'VendorCredit',
      vendorCredit.id,
      trx
    );
  }

  /**
   * Handles unlinking all the unpresented keys of the edited vendor credit.
   * @param {IVendorCreditEditedPayload}
   */
  private async handleUnlinkUnpresentedKeysOnVendorCreditEdited({
    tenantId,
    vendorCreditDTO,
    oldVendorCredit,
    trx,
  }: IVendorCreditEditedPayload) {
    const keys = vendorCreditDTO.attachments?.map(
      (attachment) => attachment.key
    );
    await this.unlinkAttachmentService.unlinkUnpresentedKeys(
      tenantId,
      keys,
      'VendorCredit',
      oldVendorCredit.id,
      trx
    );
  }

  /**
   * Handles linking all the presented keys of the edited vendor credit.
   * @param {IVendorCreditEditedPayload}
   * @returns {Promise<void>}
   */
  private async handleLinkPresentedKeysOnVendorCreditEdited({
    tenantId,
    vendorCreditDTO,
    oldVendorCredit,
    trx,
  }: IVendorCreditEditedPayload) {
    if (isEmpty(vendorCreditDTO.attachments)) return;

    const keys = vendorCreditDTO.attachments?.map(
      (attachment) => attachment.key
    );
    await this.linkAttachmentService.bulkLink(
      tenantId,
      keys,
      'VendorCredit',
      oldVendorCredit.id,
      trx
    );
  }

  /**
   * Unlink all attachments once the vendor credit deleted.
   * @param {IVendorCreditDeletingPayload}
   * @returns {Promise<void>}
   */
  private async handleUnlinkAttachmentsOnVendorCreditDeleted({
    tenantId,
    oldVendorCredit,
    trx,
  }: IVendorCreditDeletingPayload) {
    await this.unlinkAttachmentService.unlinkAllModelKeys(
      tenantId,
      'VendorCredit',
      oldVendorCredit.id,
      trx
    );
  }
}
