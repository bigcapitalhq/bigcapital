import { Inject, Service } from 'typedi';
import { isEmpty } from 'lodash';
import {
  ISaleEstimateCreatedPayload,
  ISaleEstimateCreatingPayload,
  ISaleEstimateDeletingPayload,
  ISaleEstimateEditedPayload,
} from '@/interfaces';
import events from '@/subscribers/events';
import { LinkAttachment } from '../LinkAttachment';
import { ValidateAttachments } from '../ValidateAttachments';
import { UnlinkAttachment } from '../UnlinkAttachment';

@Service()
export class AttachmentsOnSaleEstimates {
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
      events.saleEstimate.onCreating,
      this.validateAttachmentsOnSaleEstimateCreated.bind(this)
    );
    bus.subscribe(
      events.saleEstimate.onCreated,
      this.handleAttachmentsOnSaleEstimateCreated.bind(this)
    );
    bus.subscribe(
      events.saleEstimate.onEdited,
      this.handleUnlinkUnpresentedKeysOnSaleEstimateEdited.bind(this)
    );
    bus.subscribe(
      events.saleEstimate.onEdited,
      this.handleLinkPresentedKeysOnSaleEstimateEdited.bind(this)
    );
    bus.subscribe(
      events.saleEstimate.onDeleting,
      this.handleUnlinkAttachmentsOnSaleEstimateDelete.bind(this)
    );
  }

  /**
   * Validates the attachment keys on creating sale estimate.
   * @param {ISaleEstimateCreatingPayload}
   * @returns {Promise<void>}
   */
  private async validateAttachmentsOnSaleEstimateCreated({
    estimateDTO,
    tenantId,
  }: ISaleEstimateCreatingPayload): Promise<void> {
    if (isEmpty(estimateDTO.attachments)) {
      return;
    }
    const documentKeys = estimateDTO?.attachments?.map((a) => a.key);

    await this.validateDocuments.validate(tenantId, documentKeys);
  }

  /**
   * Handles linking the attachments of the created sale estimate.
   * @param {ISaleEstimateCreatedPayload}
   * @returns {Promise<void>}
   */
  private async handleAttachmentsOnSaleEstimateCreated({
    tenantId,
    saleEstimateDTO,
    saleEstimate,
    trx,
  }: ISaleEstimateCreatedPayload): Promise<void> {
    if (isEmpty(saleEstimateDTO.attachments)) return;

    const keys = saleEstimateDTO.attachments?.map(
      (attachment) => attachment.key
    );
    await this.linkAttachmentService.bulkLink(
      tenantId,
      keys,
      'SaleEstimate',
      saleEstimate.id,
      trx
    );
  }

  /**
   * Handles unlinking all the unpresented keys of the edited sale estimate.
   * @param {ISaleEstimateEditedPayload}
   */
  private async handleUnlinkUnpresentedKeysOnSaleEstimateEdited({
    tenantId,
    estimateDTO,
    oldSaleEstimate,
    trx
  }: ISaleEstimateEditedPayload) {
    const keys = estimateDTO.attachments?.map((attachment) => attachment.key);

    await this.unlinkAttachmentService.unlinkUnpresentedKeys(
      tenantId,
      keys,
      'SaleEstimate',
      oldSaleEstimate.id,
      trx
    );
  }

  /**
   * Handles linking all the presented keys of the edited sale estimate.
   * @param {ISaleEstimateEditedPayload}
   * @returns {Promise<void>}
   */
  private async handleLinkPresentedKeysOnSaleEstimateEdited({
    tenantId,
    estimateDTO,
    oldSaleEstimate,
    trx,
  }: ISaleEstimateEditedPayload) {
    if (isEmpty(estimateDTO.attachments)) return;

    const keys = estimateDTO.attachments?.map((attachment) => attachment.key);
    await this.linkAttachmentService.bulkLink(
      tenantId,
      keys,
      'SaleEstimate',
      oldSaleEstimate.id,
      trx
    );
  }

  /**
   * Unlink all attachments once the estimate deleted.
   * @param {ISaleEstimateDeletingPayload}
   * @returns {Promise<void>}
   */
  private async handleUnlinkAttachmentsOnSaleEstimateDelete({
    tenantId,
    oldSaleEstimate,
    trx,
  }: ISaleEstimateDeletingPayload) {
    await this.unlinkAttachmentService.unlinkAllModelKeys(
      tenantId,
      'SaleEstimate',
      oldSaleEstimate.id,
      trx
    );
  }
}
