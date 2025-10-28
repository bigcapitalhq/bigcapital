import { isEmpty } from 'lodash';
import {
  ICreditNoteCreatedPayload,
  ICreditNoteCreatingPayload,
  ICreditNoteDeletingPayload,
  ICreditNoteEditedPayload,
} from '@/modules/CreditNotes/types/CreditNotes.types';
import { ValidateAttachments } from '../ValidateAttachments';
import { Injectable } from '@nestjs/common';
import { LinkAttachment } from '../LinkAttachment';
import { UnlinkAttachment } from '../UnlinkAttachment';
import { OnEvent } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';

@Injectable()
export class AttachmentsOnCreditNote {
  /**
   * @param {LinkAttachment} linkAttachmentService - 
   * @param {UnlinkAttachment} unlinkAttachmentService - 
   * @param {ValidateAttachments} validateDocuments - 
   */
  constructor(
    private readonly linkAttachmentService: LinkAttachment,
    private readonly unlinkAttachmentService: UnlinkAttachment,
    private readonly validateDocuments: ValidateAttachments,
  ) {}

  /**
   * Validates the attachment keys on creating credit note.
   * @param {ICreditNoteCreatingPayload}
   * @returns {Promise<void>}
   */
  @OnEvent(events.creditNote.onCreating)
  async validateAttachmentsOnCreditNoteCreate({
    creditNoteDTO,
  }: ICreditNoteCreatingPayload): Promise<void> {
    if (isEmpty(creditNoteDTO.attachments)) {
      return;
    }
    const documentKeys = creditNoteDTO?.attachments?.map((a) => a.key);

    await this.validateDocuments.validate(documentKeys);
  }

  /**
   * Handles linking the attachments of the created credit note.
   * @param {ICreditNoteCreatedPayload}
   * @returns {Promise<void>}
   */
  @OnEvent(events.creditNote.onCreated)
  async handleAttachmentsOnCreditNoteCreated({
    creditNote,
    creditNoteDTO,
    trx,
  }: ICreditNoteCreatedPayload): Promise<void> {
    if (isEmpty(creditNoteDTO.attachments)) return;

    const keys = creditNoteDTO.attachments?.map((attachment) => attachment.key);

    await this.linkAttachmentService.bulkLink(
      keys,
      'CreditNote',
      creditNote.id,
      trx,
    );
  }

  /**
   * Handles unlinking all the unpresented keys of the edited credit note.
   * @param {ICreditNoteEditedPayload}
   */
  @OnEvent(events.creditNote.onEdited)
  async handleUnlinkUnpresentedKeysOnCreditNoteEdited({
    creditNoteEditDTO,
    oldCreditNote,
    trx,
  }: ICreditNoteEditedPayload) {
    const keys = creditNoteEditDTO.attachments?.map(
      (attachment) => attachment.key,
    );
    await this.unlinkAttachmentService.unlinkUnpresentedKeys(
      keys,
      'CreditNote',
      oldCreditNote.id,
      trx,
    );
  }

  /**
   * Handles linking all the presented keys of the edited credit note.
   * @param {ICreditNoteEditedPayload}
   * @returns {Promise<void>}
   */
  @OnEvent(events.creditNote.onEdited)
  async handleLinkPresentedKeysOnCreditNoteEdited({
    creditNoteEditDTO,
    oldCreditNote,
    trx,
  }: ICreditNoteEditedPayload) {
    if (isEmpty(creditNoteEditDTO.attachments)) return;

    const keys = creditNoteEditDTO.attachments?.map(
      (attachment) => attachment.key,
    );
    await this.linkAttachmentService.bulkLink(
      keys,
      'CreditNote',
      oldCreditNote.id,
      trx,
    );
  }

  /**
   * Unlink all attachments once the credit note deleted.
   * @param {ICreditNoteDeletingPayload}
   * @returns {Promise<void>}
   */
  @OnEvent(events.creditNote.onDeleting)
  async handleUnlinkAttachmentsOnCreditNoteDeleted({
    oldCreditNote,
    trx,
  }: ICreditNoteDeletingPayload) {
    await this.unlinkAttachmentService.unlinkAllModelKeys(
      'CreditNote',
      oldCreditNote.id,
      trx,
    );
  }
}
