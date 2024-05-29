import { Inject, Service } from 'typedi';
import { isEmpty } from 'lodash';
import {
  IBillPaymentCreatingPayload,
  IBillPaymentDeletingPayload,
  IBillPaymentEventCreatedPayload,
  IBillPaymentEventEditedPayload,
} from '@/interfaces';
import events from '@/subscribers/events';
import { LinkAttachment } from '../LinkAttachment';
import { ValidateAttachments } from '../ValidateAttachments';
import { UnlinkAttachment } from '../UnlinkAttachment';

@Service()
export class AttachmentsOnBillPayments {
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
      events.billPayment.onCreating,
      this.validateAttachmentsOnBillPaymentCreate.bind(this)
    );
    bus.subscribe(
      events.billPayment.onCreated,
      this.handleAttachmentsOnBillPaymentCreated.bind(this)
    );
    bus.subscribe(
      events.billPayment.onEdited,
      this.handleUnlinkUnpresentedKeysOnBillPaymentEdited.bind(this)
    );
    bus.subscribe(
      events.billPayment.onEdited,
      this.handleLinkPresentedKeysOnBillPaymentEdited.bind(this)
    );
    bus.subscribe(
      events.billPayment.onDeleting,
      this.handleUnlinkAttachmentsOnBillPaymentDeleted.bind(this)
    );
  }

  /**
   * Validates the attachment keys on creating bill payment.
   * @param {IBillPaymentCreatingPayload}
   * @returns {Promise<void>}
   */
  private async validateAttachmentsOnBillPaymentCreate({
    billPaymentDTO,
    tenantId,
  }: IBillPaymentCreatingPayload): Promise<void> {
    if (isEmpty(billPaymentDTO.attachments)) {
      return;
    }
    const documentKeys = billPaymentDTO?.attachments?.map((a) => a.key);

    await this.validateDocuments.validate(tenantId, documentKeys);
  }

  /**
   * Handles linking the attachments of the created bill payment.
   * @param {IBillPaymentEventCreatedPayload}
   * @returns {Promise<void>}
   */
  private async handleAttachmentsOnBillPaymentCreated({
    tenantId,
    billPaymentDTO,
    billPayment,
    trx,
  }: IBillPaymentEventCreatedPayload): Promise<void> {
    if (isEmpty(billPaymentDTO.attachments)) return;

    const keys = billPaymentDTO.attachments?.map(
      (attachment) => attachment.key
    );
    await this.linkAttachmentService.bulkLink(
      tenantId,
      keys,
      'BillPayment',
      billPayment.id,
      trx
    );
  }

  /**
   * Handles unlinking all the unpresented keys of the edited bill payment.
   * @param {IBillPaymentEventEditedPayload}
   */
  private async handleUnlinkUnpresentedKeysOnBillPaymentEdited({
    tenantId,
    billPaymentDTO,
    oldBillPayment,
    trx,
  }: IBillPaymentEventEditedPayload) {
    const keys = billPaymentDTO.attachments?.map(
      (attachment) => attachment.key
    );
    await this.unlinkAttachmentService.unlinkUnpresentedKeys(
      tenantId,
      keys,
      'BillPayment',
      oldBillPayment.id,
      trx
    );
  }

  /**
   * Handles linking all the presented keys of the edited bill payment.
   * @param {IBillPaymentEventEditedPayload}
   * @returns {Promise<void>}
   */
  private async handleLinkPresentedKeysOnBillPaymentEdited({
    tenantId,
    billPaymentDTO,
    oldBillPayment,
    trx,
  }: IBillPaymentEventEditedPayload) {
    if (isEmpty(billPaymentDTO.attachments)) return;

    const keys = billPaymentDTO.attachments?.map(
      (attachment) => attachment.key
    );
    await this.linkAttachmentService.bulkLink(
      tenantId,
      keys,
      'BillPayment',
      oldBillPayment.id,
      trx
    );
  }

  /**
   * Unlink all attachments once the bill payment deleted.
   * @param {IBillPaymentDeletingPayload}
   * @returns {Promise<void>}
   */
  private async handleUnlinkAttachmentsOnBillPaymentDeleted({
    tenantId,
    oldBillPayment,
    trx,
  }: IBillPaymentDeletingPayload) {
    await this.unlinkAttachmentService.unlinkAllModelKeys(
      tenantId,
      'BillPayment',
      oldBillPayment.id,
      trx
    );
  }
}
