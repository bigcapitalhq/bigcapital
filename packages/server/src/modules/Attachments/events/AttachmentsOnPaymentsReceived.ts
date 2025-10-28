import { isEmpty } from 'lodash';
import {
  IPaymentReceivedCreatedPayload,
  IPaymentReceivedCreatingPayload,
  IPaymentReceivedDeletingPayload,
  IPaymentReceivedEditedPayload,
} from '@/modules/PaymentReceived/types/PaymentReceived.types';
import { ValidateAttachments } from '../ValidateAttachments';
import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { UnlinkAttachment } from '../UnlinkAttachment';
import { LinkAttachment } from '../LinkAttachment';
import { events } from '@/common/events/events';

@Injectable()
export class AttachmentsOnPaymentsReceived {
  constructor(
    private readonly linkAttachmentService: LinkAttachment,
    private readonly unlinkAttachmentService: UnlinkAttachment,
    private readonly validateDocuments: ValidateAttachments,
  ) {}

  /**
   * Validates the attachment keys on creating payment.
   * @param {IPaymentReceivedCreatingPayload}
   * @returns {Promise<void>}
   */
  @OnEvent(events.paymentReceive.onCreating)
  async validateAttachmentsOnPaymentCreate({
    paymentReceiveDTO,
  }: IPaymentReceivedCreatingPayload): Promise<void> {
    if (isEmpty(paymentReceiveDTO.attachments)) {
      return;
    }
    const documentKeys = paymentReceiveDTO?.attachments?.map((a) => a.key);

    await this.validateDocuments.validate(documentKeys);
  }

  /**
   * Handles linking the attachments of the created payment.
   * @param {IPaymentReceivedCreatedPayload}
   * @returns {Promise<void>}
   */
  @OnEvent(events.paymentReceive.onCreated)
  async handleAttachmentsOnPaymentCreated({
    paymentReceiveDTO,
    paymentReceive,
    trx,
  }: IPaymentReceivedCreatedPayload): Promise<void> {
    if (isEmpty(paymentReceiveDTO.attachments)) return;

    const keys = paymentReceiveDTO.attachments?.map(
      (attachment) => attachment.key,
    );
    await this.linkAttachmentService.bulkLink(
      keys,
      'PaymentReceive',
      paymentReceive.id,
      trx,
    );
  }

  /**
   * Handles unlinking all the unpresented keys of the edited payment.
   * @param {IPaymentReceivedEditedPayload}
   */
  @OnEvent(events.paymentReceive.onEdited)
  private async handleUnlinkUnpresentedKeysOnPaymentEdited({
    paymentReceiveDTO,
    oldPaymentReceive,
    trx,
  }: IPaymentReceivedEditedPayload) {
    const keys = paymentReceiveDTO.attachments?.map(
      (attachment) => attachment.key,
    );
    await this.unlinkAttachmentService.unlinkUnpresentedKeys(
      keys,
      'PaymentReceive',
      oldPaymentReceive.id,
      trx,
    );
  }

  /**
   * Handles linking all the presented keys of the edited payment.
   * @param {IPaymentReceivedEditedPayload}
   * @returns {Promise<void>}
   */
  @OnEvent(events.paymentReceive.onEdited)
  async handleLinkPresentedKeysOnPaymentEdited({
    paymentReceiveDTO,
    oldPaymentReceive,
    trx,
  }: IPaymentReceivedEditedPayload) {
    if (isEmpty(paymentReceiveDTO.attachments)) return;

    const keys = paymentReceiveDTO.attachments?.map(
      (attachment) => attachment.key,
    );
    await this.linkAttachmentService.bulkLink(
      keys,
      'PaymentReceive',
      oldPaymentReceive.id,
      trx,
    );
  }

  /**
   * Unlink all attachments once the payment deleted.
   * @param {ISaleInvoiceDeletedPayload}
   * @returns {Promise<void>}
   */
  @OnEvent(events.paymentReceive.onDeleting)
  async handleUnlinkAttachmentsOnPaymentDelete({
    oldPaymentReceive,
    trx,
  }: IPaymentReceivedDeletingPayload) {
    await this.unlinkAttachmentService.unlinkAllModelKeys(
      'PaymentReceive',
      oldPaymentReceive.id,
      trx,
    );
  }
}
