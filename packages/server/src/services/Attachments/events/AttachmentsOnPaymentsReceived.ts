import { Inject, Service } from 'typedi';
import { isEmpty } from 'lodash';
import {
  IPaymentReceiveCreatedPayload,
  IPaymentReceiveCreatingPayload,
  IPaymentReceiveDeletingPayload,
  IPaymentReceiveEditedPayload,
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
   * @param {IPaymentReceiveCreatingPayload}
   * @returns {Promise<void>}
   */
  private async validateAttachmentsOnPaymentCreate({
    paymentReceiveDTO,
    tenantId,
  }: IPaymentReceiveCreatingPayload): Promise<void> {
    if (isEmpty(paymentReceiveDTO.attachments)) {
      return;
    }
    const documentKeys = paymentReceiveDTO?.attachments?.map((a) => a.key);

    await this.validateDocuments.validate(tenantId, documentKeys);
  }

  /**
   * Handles linking the attachments of the created payment.
   * @param {IPaymentReceiveCreatedPayload}
   * @returns {Promise<void>}
   */
  private async handleAttachmentsOnPaymentCreated({
    tenantId,
    paymentReceiveDTO,
    paymentReceive,
    trx,
  }: IPaymentReceiveCreatedPayload): Promise<void> {
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
   * @param {IPaymentReceiveEditedPayload}
   */
  private async handleUnlinkUnpresentedKeysOnPaymentEdited({
    tenantId,
    paymentReceiveDTO,
    oldPaymentReceive,
    trx,
  }: IPaymentReceiveEditedPayload) {
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
   * @param {IPaymentReceiveEditedPayload}
   * @returns {Promise<void>}
   */
  private async handleLinkPresentedKeysOnPaymentEdited({
    tenantId,
    paymentReceiveDTO,
    oldPaymentReceive,
    trx,
  }: IPaymentReceiveEditedPayload) {
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
  }: IPaymentReceiveDeletingPayload) {
    await this.unlinkAttachmentService.unlinkAllModelKeys(
      tenantId,
      'PaymentReceive',
      oldPaymentReceive.id,
      trx
    );
  }
}
