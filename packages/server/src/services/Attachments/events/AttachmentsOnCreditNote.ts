import { Inject, Service } from 'typedi';
import { isEmpty } from 'lodash';
import {
  ICreditNoteCreatedPayload,
  ICreditNoteCreatingPayload,
  ICreditNoteDeletingPayload,
  ICreditNoteEditedPayload,
} from '@/interfaces';
import events from '@/subscribers/events';
import { LinkAttachment } from '../LinkAttachment';
import { ValidateAttachments } from '../ValidateAttachments';
import { UnlinkAttachment } from '../UnlinkAttachment';

@Service()
export class AttachmentsOnCreditNote {
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
      events.creditNote.onCreating,
      this.validateAttachmentsOnCreditNoteCreate.bind(this)
    );
    bus.subscribe(
      events.creditNote.onCreated,
      this.handleAttachmentsOnCreditNoteCreated.bind(this)
    );
    bus.subscribe(
      events.creditNote.onEdited,
      this.handleUnlinkUnpresentedKeysOnCreditNoteEdited.bind(this)
    );
    bus.subscribe(
      events.creditNote.onEdited,
      this.handleLinkPresentedKeysOnCreditNoteEdited.bind(this)
    );
    bus.subscribe(
      events.creditNote.onDeleting,
      this.handleUnlinkAttachmentsOnCreditNoteDeleted.bind(this)
    );
  }

  /**
   * Validates the attachment keys on creating credit note.
   * @param {ICreditNoteCreatingPayload}
   * @returns {Promise<void>}
   */
  private async validateAttachmentsOnCreditNoteCreate({
    creditNoteDTO,
    tenantId,
  }: ICreditNoteCreatingPayload): Promise<void> {
    if (isEmpty(creditNoteDTO.attachments)) {
      return;
    }
    const documentKeys = creditNoteDTO?.attachments?.map((a) => a.key);

    await this.validateDocuments.validate(tenantId, documentKeys);
  }

  /**
   * Handles linking the attachments of the created credit note.
   * @param {ICreditNoteCreatedPayload}
   * @returns {Promise<void>}
   */
  private async handleAttachmentsOnCreditNoteCreated({
    tenantId,
    creditNote,
    creditNoteDTO,
    trx,
  }: ICreditNoteCreatedPayload): Promise<void> {
    if (isEmpty(creditNoteDTO.attachments)) return;

    const keys = creditNoteDTO.attachments?.map((attachment) => attachment.key);
    await this.linkAttachmentService.bulkLink(
      tenantId,
      keys,
      'CreditNote',
      creditNote.id,
      trx
    );
  }

  /**
   * Handles unlinking all the unpresented keys of the edited credit note.
   * @param {ICreditNoteEditedPayload}
   */
  private async handleUnlinkUnpresentedKeysOnCreditNoteEdited({
    tenantId,
    creditNoteEditDTO,
    oldCreditNote,
    trx,
  }: ICreditNoteEditedPayload) {
    const keys = creditNoteEditDTO.attachments?.map(
      (attachment) => attachment.key
    );
    await this.unlinkAttachmentService.unlinkUnpresentedKeys(
      tenantId,
      keys,
      'CreditNote',
      oldCreditNote.id,
      trx
    );
  }

  /**
   * Handles linking all the presented keys of the edited credit note.
   * @param {ICreditNoteEditedPayload}
   * @returns {Promise<void>}
   */
  private async handleLinkPresentedKeysOnCreditNoteEdited({
    tenantId,
    creditNoteEditDTO,
    oldCreditNote,
    trx,
  }: ICreditNoteEditedPayload) {
    if (isEmpty(creditNoteEditDTO.attachments)) return;

    const keys = creditNoteEditDTO.attachments?.map(
      (attachment) => attachment.key
    );
    await this.linkAttachmentService.bulkLink(
      tenantId,
      keys,
      'CreditNote',
      oldCreditNote.id,
      trx
    );
  }

  /**
   * Unlink all attachments once the credit note deleted.
   * @param {ICreditNoteDeletingPayload}
   * @returns {Promise<void>}
   */
  private async handleUnlinkAttachmentsOnCreditNoteDeleted({
    tenantId,
    oldCreditNote,
    trx,
  }: ICreditNoteDeletingPayload) {
    await this.unlinkAttachmentService.unlinkAllModelKeys(
      tenantId,
      'CreditNote',
      oldCreditNote.id,
      trx
    );
  }
}
