import { Inject, Service } from 'typedi';
import { isEmpty } from 'lodash';
import {
  IManualJournalCreatingPayload,
  IManualJournalEventCreatedPayload,
  IManualJournalEventDeletedPayload,
  IManualJournalEventEditedPayload,
} from '@/interfaces';
import events from '@/subscribers/events';
import { LinkAttachment } from '../LinkAttachment';
import { ValidateAttachments } from '../ValidateAttachments';
import { UnlinkAttachment } from '../UnlinkAttachment';

@Service()
export class AttachmentsOnManualJournals {
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
      events.manualJournals.onCreating,
      this.validateAttachmentsOnManualJournalCreate.bind(this)
    );
    bus.subscribe(
      events.manualJournals.onCreated,
      this.handleAttachmentsOnManualJournalCreated.bind(this)
    );
    bus.subscribe(
      events.manualJournals.onEdited,
      this.handleUnlinkUnpresentedKeysOnManualJournalEdited.bind(this)
    );
    bus.subscribe(
      events.manualJournals.onEdited,
      this.handleLinkPresentedKeysOnManualJournalEdited.bind(this)
    );
    bus.subscribe(
      events.manualJournals.onDeleting,
      this.handleUnlinkAttachmentsOnManualJournalDeleted.bind(this)
    );
  }

  /**
   * Validates the attachment keys on creating manual journal.
   * @param {IManualJournalCreatingPayload}
   * @returns {Promise<void>}
   */
  private async validateAttachmentsOnManualJournalCreate({
    manualJournalDTO,
    tenantId,
  }: IManualJournalCreatingPayload): Promise<void> {
    if (isEmpty(manualJournalDTO.attachments)) {
      return;
    }
    const documentKeys = manualJournalDTO?.attachments?.map((a) => a.key);

    await this.validateDocuments.validate(tenantId, documentKeys);
  }

  /**
   * Handles linking the attachments of the created manual journal.
   * @param {IManualJournalEventCreatedPayload}
   * @returns {Promise<void>}
   */
  private async handleAttachmentsOnManualJournalCreated({
    tenantId,
    manualJournalDTO,
    manualJournal,
    trx,
  }: IManualJournalEventCreatedPayload): Promise<void> {
    if (isEmpty(manualJournalDTO.attachments)) return;

    const keys = manualJournalDTO.attachments?.map(
      (attachment) => attachment.key
    );
    await this.linkAttachmentService.bulkLink(
      tenantId,
      keys,
      'ManualJournal',
      manualJournal.id,
      trx
    );
  }

  /**
   * Handles unlinking all the unpresented keys of the edited manual journal.
   * @param {ISaleInvoiceEditedPayload}
   */
  private async handleUnlinkUnpresentedKeysOnManualJournalEdited({
    tenantId,
    manualJournalDTO,
    manualJournal,
    trx
  }: IManualJournalEventEditedPayload) {
    const keys = manualJournalDTO.attachments?.map(
      (attachment) => attachment.key
    );
    await this.unlinkAttachmentService.unlinkUnpresentedKeys(
      tenantId,
      keys,
      'SaleInvoice',
      manualJournal.id,
      trx
    );
  }

  /**
   * Handles linking all the presented keys of the edited manual journal.
   * @param {ISaleInvoiceEditedPayload}
   * @returns {Promise<void>}
   */
  private async handleLinkPresentedKeysOnManualJournalEdited({
    tenantId,
    manualJournalDTO,
    oldManualJournal,
    trx,
  }: IManualJournalEventEditedPayload) {
    if (isEmpty(manualJournalDTO.attachments)) return;

    const keys = manualJournalDTO.attachments?.map(
      (attachment) => attachment.key
    );
    await this.linkAttachmentService.bulkLink(
      tenantId,
      keys,
      'ManualJournal',
      oldManualJournal.id,
      trx
    );
  }

  /**
   * Unlink all attachments once the manual journal deleted.
   * @param {ISaleInvoiceDeletedPayload}
   * @returns {Promise<void>}
   */
  private async handleUnlinkAttachmentsOnManualJournalDeleted({
    tenantId,
    oldManualJournal,
    trx,
  }: IManualJournalEventDeletedPayload) {
    await this.unlinkAttachmentService.unlinkAllModelKeys(
      tenantId,
      'SaleInvoice',
      oldManualJournal.id,
      trx
    );
  }
}
