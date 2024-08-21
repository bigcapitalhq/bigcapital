import { Inject, Service } from 'typedi';
import { isEmpty } from 'lodash';
import {
  IPaymentReceivedCreatedPayload,
  IPaymentReceivedCreatingPayload,
  IPaymentReceivedDeletingPayload,
  IPaymentReceivedEditedPayload,
} from '@/interfaces';
import events from '@/subscribers/events';
import { LinkAttachment } from '../LinkAttachment';
import { ValidateAttachments } from '../ValidateAttachments';
import { UnlinkAttachment } from '../UnlinkAttachment';

@Service()
export class AttachmentsOnPaymentsReceived {
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
      events.paymentReceive.onCreating,
      this.validateAttachmentsOnPaymentCreate.bind(this)
    );
    bus.subscribe(
      events.paymentReceive.onCreated,
      this.handleAttachmentsOnPaymentCreated.bind(this)
    );
    bus.subscribe(
      events.paymentReceive.onEdited,
      this.handleUnlinkUnpresentedKeysOnPaymentEdited.bind(this)
    );
    bus.subscribe(
      events.paymentReceive.onEdited,
      this.handleLinkPresentedKeysOnPaymentEdited.bind(this)
    );
    bus.subscribe(
      events.paymentReceive.onDeleting,
      this.handleUnlinkAttachmentsOnPaymentDelete.bind(this)
    );
  }

  /**
   * Validates the attachment keys on creating payment.
   * @param {IPaymentReceivedCreatingPayload}
   * @returns {Promise<void>}
   */
  private async validateAttachmentsOnPaymentCreate({
    paymentReceiveDTO,
    tenantId,
  }: IPaymentReceivedCreatingPayload): Promise<void> {
    if (isEmpty(paymentReceiveDTO.attachments)) {
      return;
    }
    const documentKeys = paymentReceiveDTO?.attachments?.map((a) => a.key);

    await this.validateDocuments.validate(tenantId, documentKeys);
  }

  /**
   * Handles linking the attachments of the created payment.
   * @param {IPaymentReceivedCreatedPayload}
   * @returns {Promise<void>}
   */
  private async handleAttachmentsOnPaymentCreated({
    tenantId,
    paymentReceiveDTO,
    paymentReceive,
    trx,
  }: IPaymentReceivedCreatedPayload): Promise<void> {
    if (isEmpty(paymentReceiveDTO.attachments)) return;

    const keys = paymentReceiveDTO.attachments?.map(
      (attachment) => attachment.key
    );
    await this.linkAttachmentService.bulkLink(
      tenantId,
      keys,
      'PaymentReceive',
      paymentReceive.id,
      trx
    );
  }

  /**
   * Handles unlinking all the unpresented keys of the edited payment.
   * @param {IPaymentReceivedEditedPayload}
   */
  private async handleUnlinkUnpresentedKeysOnPaymentEdited({
    tenantId,
    paymentReceiveDTO,
    oldPaymentReceive,
    trx,
  }: IPaymentReceivedEditedPayload) {
    const keys = paymentReceiveDTO.attachments?.map(
      (attachment) => attachment.key
    );
    await this.unlinkAttachmentService.unlinkUnpresentedKeys(
      tenantId,
      keys,
      'PaymentReceive',
      oldPaymentReceive.id,
      trx
    );
  }

  /**
   * Handles linking all the presented keys of the edited payment.
   * @param {IPaymentReceivedEditedPayload}
   * @returns {Promise<void>}
   */
  private async handleLinkPresentedKeysOnPaymentEdited({
    tenantId,
    paymentReceiveDTO,
    oldPaymentReceive,
    trx,
  }: IPaymentReceivedEditedPayload) {
    if (isEmpty(paymentReceiveDTO.attachments)) return;

    const keys = paymentReceiveDTO.attachments?.map(
      (attachment) => attachment.key
    );
    await this.linkAttachmentService.bulkLink(
      tenantId,
      keys,
      'PaymentReceive',
      oldPaymentReceive.id,
      trx
    );
  }

  /**
   * Unlink all attachments once the payment deleted.
   * @param {ISaleInvoiceDeletedPayload}
   * @returns {Promise<void>}
   */
  private async handleUnlinkAttachmentsOnPaymentDelete({
    tenantId,
    oldPaymentReceive,
    trx,
  }: IPaymentReceivedDeletingPayload) {
    await this.unlinkAttachmentService.unlinkAllModelKeys(
      tenantId,
      'PaymentReceive',
      oldPaymentReceive.id,
      trx
    );
  }
}
