import { isEmpty } from 'lodash';
import {
  IVendorCreditCreatedPayload,
  IVendorCreditCreatingPayload,
  IVendorCreditDeletingPayload,
  IVendorCreditEditedPayload,
} from '../../VendorCredit/types/VendorCredit.types';
import { ValidateAttachments } from '../ValidateAttachments';
import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { UnlinkAttachment } from '../UnlinkAttachment';
import { LinkAttachment } from '../LinkAttachment';
import { events } from '@/common/events/events';

@Injectable()
export class AttachmentsOnVendorCredits {
  constructor(
    private readonly linkAttachmentService: LinkAttachment,
    private readonly unlinkAttachmentService: UnlinkAttachment,
    private readonly validateDocuments: ValidateAttachments,
  ) {}

  /**
   * Validates the attachment keys on creating vendor credit.
   * @param {IVendorCreditCreatingPayload}
   * @returns {Promise<void>}
   */
  @OnEvent(events.vendorCredit.onCreating)
  async validateAttachmentsOnVendorCreditCreate({
    vendorCreditCreateDTO,
  }: IVendorCreditCreatingPayload): Promise<void> {
    if (isEmpty(vendorCreditCreateDTO.attachments)) {
      return;
    }
    const documentKeys = vendorCreditCreateDTO?.attachments?.map((a) => a.key);

    await this.validateDocuments.validate(documentKeys);
  }

  /**
   * Handles linking the attachments of the created vendor credit.
   * @param {IVendorCreditCreatedPayload}
   * @returns {Promise<void>}
   */
  @OnEvent(events.vendorCredit.onCreated)
  async handleAttachmentsOnVendorCreditCreated({
    vendorCreditCreateDTO,
    vendorCredit,
    trx,
  }: IVendorCreditCreatedPayload): Promise<void> {
    if (isEmpty(vendorCreditCreateDTO.attachments)) return;

    const keys = vendorCreditCreateDTO.attachments?.map(
      (attachment) => attachment.key,
    );
    await this.linkAttachmentService.bulkLink(
      keys,
      'VendorCredit',
      vendorCredit.id,
      trx,
    );
  }

  /**
   * Handles unlinking all the unpresented keys of the edited vendor credit.
   * @param {IVendorCreditEditedPayload}
   */
  @OnEvent(events.vendorCredit.onEdited)
  async handleUnlinkUnpresentedKeysOnVendorCreditEdited({
    vendorCreditDTO,
    oldVendorCredit,
    trx,
  }: IVendorCreditEditedPayload) {
    const keys = vendorCreditDTO.attachments?.map(
      (attachment) => attachment.key,
    );
    await this.unlinkAttachmentService.unlinkUnpresentedKeys(
      keys,
      'VendorCredit',
      oldVendorCredit.id,
      trx,
    );
  }

  /**
   * Handles linking all the presented keys of the edited vendor credit.
   * @param {IVendorCreditEditedPayload}
   * @returns {Promise<void>}
   */
  @OnEvent(events.vendorCredit.onEdited)
  async handleLinkPresentedKeysOnVendorCreditEdited({
    vendorCreditDTO,
    oldVendorCredit,
    trx,
  }: IVendorCreditEditedPayload) {
    if (isEmpty(vendorCreditDTO.attachments)) return;

    const keys = vendorCreditDTO.attachments?.map(
      (attachment) => attachment.key,
    );
    await this.linkAttachmentService.bulkLink(
      keys,
      'VendorCredit',
      oldVendorCredit.id,
      trx,
    );
  }

  /**
   * Unlink all attachments once the vendor credit deleted.
   * @param {IVendorCreditDeletingPayload}
   * @returns {Promise<void>}
   */
  @OnEvent(events.vendorCredit.onDeleting)
  async handleUnlinkAttachmentsOnVendorCreditDeleted({
    oldVendorCredit,
    trx,
  }: IVendorCreditDeletingPayload) {
    await this.unlinkAttachmentService.unlinkAllModelKeys(
      'VendorCredit',
      oldVendorCredit.id,
      trx,
    );
  }
}
