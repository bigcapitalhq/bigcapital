import { isEmpty } from 'lodash';
import {
  IBillPaymentCreatingPayload,
  IBillPaymentDeletingPayload,
  IBillPaymentEventCreatedPayload,
  IBillPaymentEventEditedPayload,
} from '@/modules/BillPayments/types/BillPayments.types';
import { ValidateAttachments } from '../ValidateAttachments';
import { Injectable } from '@nestjs/common';
import { LinkAttachment } from '../LinkAttachment';
import { UnlinkAttachment } from '../UnlinkAttachment';
import { events } from '@/common/events/events';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class AttachmentsOnBillPayments {
  constructor(
    private readonly linkAttachmentService: LinkAttachment,
    private readonly unlinkAttachmentService: UnlinkAttachment,
    private readonly validateDocuments: ValidateAttachments,
  ) {}

  /**
   * Validates the attachment keys on creating bill payment.
   * @param {IBillPaymentCreatingPayload}
   * @returns {Promise<void>}
   */
  @OnEvent(events.billPayment.onCreating)
  async validateAttachmentsOnBillPaymentCreate({
    billPaymentDTO,
  }: IBillPaymentCreatingPayload): Promise<void> {
    if (isEmpty(billPaymentDTO.attachments)) {
      return;
    }
    const documentKeys = billPaymentDTO?.attachments?.map((a) => a.key);

    await this.validateDocuments.validate(documentKeys);
  }

  /**
   * Handles linking the attachments of the created bill payment.
   * @param {IBillPaymentEventCreatedPayload}
   * @returns {Promise<void>}
   */
  @OnEvent(events.billPayment.onCreated)
  async handleAttachmentsOnBillPaymentCreated({
    billPaymentDTO,
    billPayment,
    trx,
  }: IBillPaymentEventCreatedPayload): Promise<void> {
    if (isEmpty(billPaymentDTO.attachments)) return;

    const keys = billPaymentDTO.attachments?.map(
      (attachment) => attachment.key,
    );
    await this.linkAttachmentService.bulkLink(
      keys,
      'BillPayment',
      billPayment.id,
      trx,
    );
  }

  /**
   * Handles unlinking all the unpresented keys of the edited bill payment.
   * @param {IBillPaymentEventEditedPayload}
   */
  @OnEvent(events.billPayment.onEdited)
  async handleUnlinkUnpresentedKeysOnBillPaymentEdited({
    billPaymentDTO,
    oldBillPayment,
    trx,
  }: IBillPaymentEventEditedPayload) {
    const keys = billPaymentDTO.attachments?.map(
      (attachment) => attachment.key,
    );
    await this.unlinkAttachmentService.unlinkUnpresentedKeys(
      keys,
      'BillPayment',
      oldBillPayment.id,
      trx,
    );
  }

  /**
   * Handles linking all the presented keys of the edited bill payment.
   * @param {IBillPaymentEventEditedPayload}
   * @returns {Promise<void>}
   */
  @OnEvent(events.billPayment.onEdited)
  async handleLinkPresentedKeysOnBillPaymentEdited({
    billPaymentDTO,
    oldBillPayment,
    trx,
  }: IBillPaymentEventEditedPayload) {
    if (isEmpty(billPaymentDTO.attachments)) return;

    const keys = billPaymentDTO.attachments?.map(
      (attachment) => attachment.key,
    );
    await this.linkAttachmentService.bulkLink(
      keys,
      'BillPayment',
      oldBillPayment.id,
      trx,
    );
  }

  /**
   * Unlink all attachments once the bill payment deleted.
   * @param {IBillPaymentDeletingPayload}
   * @returns {Promise<void>}
   */
  @OnEvent(events.billPayment.onDeleting)
  async handleUnlinkAttachmentsOnBillPaymentDeleted({
    oldBillPayment,
    trx,
  }: IBillPaymentDeletingPayload) {
    await this.unlinkAttachmentService.unlinkAllModelKeys(
      'BillPayment',
      oldBillPayment.id,
      trx,
    );
  }
}
