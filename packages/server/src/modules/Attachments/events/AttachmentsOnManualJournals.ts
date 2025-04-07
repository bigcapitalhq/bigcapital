import { isEmpty } from 'lodash';
import {
  IManualJournalCreatingPayload,
  IManualJournalEventCreatedPayload,
  IManualJournalEventDeletedPayload,
  IManualJournalEventEditedPayload,
} from '@/modules/ManualJournals/types/ManualJournals.types';
import { ValidateAttachments } from '../ValidateAttachments';
import { OnEvent } from '@nestjs/event-emitter';
import { UnlinkAttachment } from '../UnlinkAttachment';
import { LinkAttachment } from '../LinkAttachment';
import { Injectable } from '@nestjs/common';
import { events } from '@/common/events/events';

@Injectable()
export class AttachmentsOnManualJournals {
  constructor(
    private readonly linkAttachmentService: LinkAttachment,
    private readonly unlinkAttachmentService: UnlinkAttachment,
    private readonly validateDocuments: ValidateAttachments,
  ) {}

  /**
   * Validates the attachment keys on creating manual journal.
   * @param {IManualJournalCreatingPayload}
   * @returns {Promise<void>}
   */
  @OnEvent(events.manualJournals.onCreating)
  async validateAttachmentsOnManualJournalCreate({
    manualJournalDTO,
  }: IManualJournalCreatingPayload): Promise<void> {
    if (isEmpty(manualJournalDTO.attachments)) {
      return;
    }
    const documentKeys = manualJournalDTO?.attachments?.map((a) => a.key);

    await this.validateDocuments.validate(documentKeys);
  }

  /**
   * Handles linking the attachments of the created manual journal.
   * @param {IManualJournalEventCreatedPayload}
   * @returns {Promise<void>}
   */
  @OnEvent(events.manualJournals.onCreated)
  async handleAttachmentsOnManualJournalCreated({
    manualJournalDTO,
    manualJournal,
    trx,
  }: IManualJournalEventCreatedPayload): Promise<void> {
    if (isEmpty(manualJournalDTO.attachments)) return;

    const keys = manualJournalDTO.attachments?.map(
      (attachment) => attachment.key,
    );
    await this.linkAttachmentService.bulkLink(
      keys,
      'ManualJournal',
      manualJournal.id,
      trx,
    );
  }

  /**
   * Handles unlinking all the unpresented keys of the edited manual journal.
   * @param {ISaleInvoiceEditedPayload}
   */
  @OnEvent(events.manualJournals.onEdited)
  async handleUnlinkUnpresentedKeysOnManualJournalEdited({
    manualJournalDTO,
    manualJournal,
    trx,
  }: IManualJournalEventEditedPayload) {
    const keys = manualJournalDTO.attachments?.map(
      (attachment) => attachment.key,
    );
    await this.unlinkAttachmentService.unlinkUnpresentedKeys(
      keys,
      'SaleInvoice',
      manualJournal.id,
      trx,
    );
  }

  /**
   * Handles linking all the presented keys of the edited manual journal.
   * @param {ISaleInvoiceEditedPayload}
   * @returns {Promise<void>}
   */
  @OnEvent(events.manualJournals.onEdited)
  async handleLinkPresentedKeysOnManualJournalEdited({
    manualJournalDTO,
    oldManualJournal,
    trx,
  }: IManualJournalEventEditedPayload) {
    if (isEmpty(manualJournalDTO.attachments)) return;

    const keys = manualJournalDTO.attachments?.map(
      (attachment) => attachment.key,
    );
    await this.linkAttachmentService.bulkLink(
      keys,
      'ManualJournal',
      oldManualJournal.id,
      trx,
    );
  }

  /**
   * Unlink all attachments once the manual journal deleted.
   * @param {ISaleInvoiceDeletedPayload}
   * @returns {Promise<void>}
   */
  @OnEvent(events.manualJournals.onDeleting)
  async handleUnlinkAttachmentsOnManualJournalDeleted({
    oldManualJournal,
    trx,
  }: IManualJournalEventDeletedPayload) {
    await this.unlinkAttachmentService.unlinkAllModelKeys(
      'SaleInvoice',
      oldManualJournal.id,
      trx,
    );
  }
}
