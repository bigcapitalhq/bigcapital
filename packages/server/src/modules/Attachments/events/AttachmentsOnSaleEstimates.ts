import { isEmpty } from 'lodash';
import {
  ISaleEstimateCreatedPayload,
  ISaleEstimateCreatingPayload,
  ISaleEstimateDeletingPayload,
  ISaleEstimateEditedPayload,
} from '@/modules/SaleEstimates/types/SaleEstimates.types';
import { ValidateAttachments } from '../ValidateAttachments';
import { Injectable } from '@nestjs/common';
import { UnlinkAttachment } from '../UnlinkAttachment';
import { LinkAttachment } from '../LinkAttachment';
import { OnEvent } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';

@Injectable()
export class AttachmentsOnSaleEstimates {
  constructor(
    private readonly linkAttachmentService: LinkAttachment,
    private readonly unlinkAttachmentService: UnlinkAttachment,
    private readonly validateDocuments: ValidateAttachments,
  ) {}

  /**
   * Validates the attachment keys on creating sale estimate.
   * @param {ISaleEstimateCreatingPayload}
   * @returns {Promise<void>}
   */
  @OnEvent(events.saleEstimate.onCreating)
  async validateAttachmentsOnSaleEstimateCreated({
    estimateDTO,
  }: ISaleEstimateCreatingPayload): Promise<void> {
    if (isEmpty(estimateDTO.attachments)) {
      return;
    }
    const documentKeys = estimateDTO?.attachments?.map((a) => a.key);

    await this.validateDocuments.validate(documentKeys);
  }

  /**
   * Handles linking the attachments of the created sale estimate.
   * @param {ISaleEstimateCreatedPayload}
   * @returns {Promise<void>}
   */
  @OnEvent(events.saleEstimate.onCreated)
  async handleAttachmentsOnSaleEstimateCreated({
    saleEstimateDTO,
    saleEstimate,
    trx,
  }: ISaleEstimateCreatedPayload): Promise<void> {
    if (isEmpty(saleEstimateDTO.attachments)) return;

    const keys = saleEstimateDTO.attachments?.map(
      (attachment) => attachment.key,
    );
    await this.linkAttachmentService.bulkLink(
      keys,
      'SaleEstimate',
      saleEstimate.id,
      trx,
    );
  }

  /**
   * Handles unlinking all the unpresented keys of the edited sale estimate.
   * @param {ISaleEstimateEditedPayload}
   */
  @OnEvent(events.saleEstimate.onEdited)
  async handleUnlinkUnpresentedKeysOnSaleEstimateEdited({
    estimateDTO,
    oldSaleEstimate,
    trx,
  }: ISaleEstimateEditedPayload) {
    const keys = estimateDTO.attachments?.map((attachment) => attachment.key);

    await this.unlinkAttachmentService.unlinkUnpresentedKeys(
      keys,
      'SaleEstimate',
      oldSaleEstimate.id,
      trx,
    );
  }

  /**
   * Handles linking all the presented keys of the edited sale estimate.
   * @param {ISaleEstimateEditedPayload}
   * @returns {Promise<void>}
   */
  @OnEvent(events.saleEstimate.onEdited)
  async handleLinkPresentedKeysOnSaleEstimateEdited({
    estimateDTO,
    oldSaleEstimate,
    trx,
  }: ISaleEstimateEditedPayload) {
    if (isEmpty(estimateDTO.attachments)) return;

    const keys = estimateDTO.attachments?.map((attachment) => attachment.key);

    await this.linkAttachmentService.bulkLink(
      keys,
      'SaleEstimate',
      oldSaleEstimate.id,
      trx,
    );
  }

  /**
   * Unlink all attachments once the estimate deleted.
   * @param {ISaleEstimateDeletingPayload}
   * @returns {Promise<void>}
   */
  @OnEvent(events.saleEstimate.onDeleting)
  async handleUnlinkAttachmentsOnSaleEstimateDelete({
    oldSaleEstimate,
    trx,
  }: ISaleEstimateDeletingPayload) {
    await this.unlinkAttachmentService.unlinkAllModelKeys(
      'SaleEstimate',
      oldSaleEstimate.id,
      trx,
    );
  }
}
