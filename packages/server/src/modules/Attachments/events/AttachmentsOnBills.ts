import { isEmpty } from 'lodash';
import {
  IBIllEventDeletedPayload,
  IBillCreatedPayload,
  IBillCreatingPayload,
  IBillEditedPayload,
} from '@/modules/Bills/Bills.types';
import { ValidateAttachments } from '../ValidateAttachments';
import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { UnlinkAttachment } from '../UnlinkAttachment';
import { LinkAttachment } from '../LinkAttachment';
import { events } from '@/common/events/events';

@Injectable()
export class AttachmentsOnBills {
  /**
   * @param {LinkAttachment} linkAttachmentService 
   * @param {UnlinkAttachment} unlinkAttachmentService 
   * @param {ValidateAttachments} validateDocuments 
   */
  constructor(
    private readonly linkAttachmentService: LinkAttachment,
    private readonly unlinkAttachmentService: UnlinkAttachment,
    private readonly validateDocuments: ValidateAttachments,
  ) {}

  /**
   * Validates the attachment keys on creating bill.
   * @param {ISaleInvoiceCreatingPaylaod}
   * @returns {Promise<void>}
   */
  @OnEvent(events.bill.onCreating)
  async validateAttachmentsOnBillCreate({
    billDTO,
  }: IBillCreatingPayload): Promise<void> {
    if (isEmpty(billDTO.attachments)) {
      return;
    }
    const documentKeys = billDTO?.attachments?.map((a) => a.key);

    await this.validateDocuments.validate(documentKeys);
  }

  /**
   * Handles linking the attachments of the created bill.
   * @param {ISaleInvoiceCreatedPayload}
   * @returns {Promise<void>}
   */
  @OnEvent(events.bill.onCreated)
  async handleAttachmentsOnBillCreated({
    bill,
    billDTO,
    trx,
  }: IBillCreatedPayload): Promise<void> {
    if (isEmpty(billDTO.attachments)) return;

    const keys = billDTO.attachments?.map((attachment) => attachment.key);

    await this.linkAttachmentService.bulkLink(keys, 'Bill', bill.id, trx);
  }

  /**
   * Handles unlinking all the unpresented keys of the edited bill.
   * @param {IBillEditedPayload}
   */
  @OnEvent(events.bill.onEdited)
  async handleUnlinkUnpresentedKeysOnBillEdited({
    billDTO,
    bill,
    trx,
  }: IBillEditedPayload) {
    const keys = billDTO.attachments?.map((attachment) => attachment.key);

    await this.unlinkAttachmentService.unlinkUnpresentedKeys(
      keys,
      'Bill',
      bill.id,
      trx,
    );
  }

  /**
   * Handles linking all the presented keys of the edited bill.
   * @param {ISaleInvoiceEditedPayload}
   * @returns {Promise<void>}
   */
  @OnEvent(events.bill.onEdited)
  async handleLinkPresentedKeysOnBillEdited({
    billDTO,
    oldBill,
    trx,
  }: IBillEditedPayload) {
    if (isEmpty(billDTO.attachments)) return;

    const keys = billDTO.attachments?.map((attachment) => attachment.key);

    await this.linkAttachmentService.bulkLink(keys, 'Bill', oldBill.id, trx);
  }

  /**
   * Unlink all attachments once the bill deleted.
   * @param {ISaleInvoiceDeletedPayload}
   * @returns {Promise<void>}
   */
  @OnEvent(events.bill.onDeleting)
  async handleUnlinkAttachmentsOnBillDeleted({
    oldBill,
    trx,
  }: IBIllEventDeletedPayload) {
    await this.unlinkAttachmentService.unlinkAllModelKeys(
      'Bill',
      oldBill.id,
      trx,
    );
  }
}
