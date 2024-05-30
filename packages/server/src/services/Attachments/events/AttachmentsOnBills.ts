import { Inject, Service } from 'typedi';
import { isEmpty } from 'lodash';
import {
  IBIllEventDeletedPayload,
  IBillCreatedPayload,
  IBillCreatingPayload,
  IBillEditedPayload,
} from '@/interfaces';
import events from '@/subscribers/events';
import { LinkAttachment } from '../LinkAttachment';
import { ValidateAttachments } from '../ValidateAttachments';
import { UnlinkAttachment } from '../UnlinkAttachment';

@Service()
export class AttachmentsOnBills {
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
      events.bill.onCreating,
      this.validateAttachmentsOnBillCreate.bind(this)
    );
    bus.subscribe(
      events.bill.onCreated,
      this.handleAttachmentsOnBillCreated.bind(this)
    );
    bus.subscribe(
      events.bill.onEdited,
      this.handleUnlinkUnpresentedKeysOnBillEdited.bind(this)
    );
    bus.subscribe(
      events.bill.onEdited,
      this.handleLinkPresentedKeysOnBillEdited.bind(this)
    );
    bus.subscribe(
      events.bill.onDeleting,
      this.handleUnlinkAttachmentsOnBillDeleted.bind(this)
    );
  }

  /**
   * Validates the attachment keys on creating bill.
   * @param {ISaleInvoiceCreatingPaylaod}
   * @returns {Promise<void>}
   */
  private async validateAttachmentsOnBillCreate({
    billDTO,
    tenantId,
  }: IBillCreatingPayload): Promise<void> {
    if (isEmpty(billDTO.attachments)) {
      return;
    }
    const documentKeys = billDTO?.attachments?.map((a) => a.key);

    await this.validateDocuments.validate(tenantId, documentKeys);
  }

  /**
   * Handles linking the attachments of the created bill.
   * @param {ISaleInvoiceCreatedPayload}
   * @returns {Promise<void>}
   */
  private async handleAttachmentsOnBillCreated({
    tenantId,
    bill,
    billDTO,
    trx,
  }: IBillCreatedPayload): Promise<void> {
    if (isEmpty(billDTO.attachments)) return;

    const keys = billDTO.attachments?.map((attachment) => attachment.key);
    await this.linkAttachmentService.bulkLink(
      tenantId,
      keys,
      'Bill',
      bill.id,
      trx
    );
  }

  /**
   * Handles unlinking all the unpresented keys of the edited bill.
   * @param {IBillEditedPayload}
   */
  private async handleUnlinkUnpresentedKeysOnBillEdited({
    tenantId,
    billDTO,
    bill,
    trx
  }: IBillEditedPayload) {
    const keys = billDTO.attachments?.map((attachment) => attachment.key);
    await this.unlinkAttachmentService.unlinkUnpresentedKeys(
      tenantId,
      keys,
      'Bill',
      bill.id,
      trx
    );
  }

  /**
   * Handles linking all the presented keys of the edited bill.
   * @param {ISaleInvoiceEditedPayload}
   * @returns {Promise<void>}
   */
  private async handleLinkPresentedKeysOnBillEdited({
    tenantId,
    billDTO,
    oldBill,
    trx,
  }: IBillEditedPayload) {
    if (isEmpty(billDTO.attachments)) return;

    const keys = billDTO.attachments?.map((attachment) => attachment.key);
    await this.linkAttachmentService.bulkLink(
      tenantId,
      keys,
      'Bill',
      oldBill.id,
      trx
    );
  }

  /**
   * Unlink all attachments once the bill deleted.
   * @param {ISaleInvoiceDeletedPayload}
   * @returns {Promise<void>}
   */
  private async handleUnlinkAttachmentsOnBillDeleted({
    tenantId,
    oldBill,
    trx,
  }: IBIllEventDeletedPayload) {
    await this.unlinkAttachmentService.unlinkAllModelKeys(
      tenantId,
      'Bill',
      oldBill.id,
      trx
    );
  }
}
