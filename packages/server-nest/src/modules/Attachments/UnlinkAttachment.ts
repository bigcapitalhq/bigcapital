import bluebird from 'bluebird';
import { difference } from 'lodash';
import {
  validateLinkModelEntryExists,
  validateLinkModelExists,
} from './_utils';
import { Knex } from 'knex';
import { Inject, Injectable } from '@nestjs/common';
import { DocumentLinkModel } from './models/DocumentLink.model';
import { TenantModelProxy } from '../System/models/TenantBaseModel';
import { DocumentModel } from './models/Document.model';
import { getAttachableModelsMap } from './decorators/InjectAttachable.decorator';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class UnlinkAttachment {
  constructor(
    private moduleRef: ModuleRef,

    @Inject(DocumentModel.name)
    private readonly documentModel: TenantModelProxy<typeof DocumentModel>,

    @Inject(DocumentLinkModel.name)
    private readonly documentLinkModel: TenantModelProxy<
      typeof DocumentLinkModel
    >,
  ) {}

  /**
   * Unlink the attachments from the model entry.
   * @param {string} filekey - File key.
   * @param {string} modelRef - Model reference.
   * @param {number} modelId - Model id.
   */
  async unlink(
    filekey: string,
    modelRef: string,
    modelId: number,
    trx?: Knex.Transaction,
  ): Promise<void> {
    const attachmentsAttachableModels = getAttachableModelsMap();
    const attachableModel = attachmentsAttachableModels.get(modelRef);

    validateLinkModelExists(attachableModel);

    const LinkModel = this.moduleRef.get(modelRef, { strict: false });
    const foundLinkModel = await LinkModel.query(trx).findById(modelId);
    validateLinkModelEntryExists(foundLinkModel);

    const document = await this.documentModel().query(trx).findOne('key', filekey);

    // Delete the document link.
    await this.documentLinkModel().query(trx)
      .where('modelRef', modelRef)
      .where('modelId', modelId)
      .where('documentId', document.id)
      .delete();
  }

  /**
   * Bulk unlink the attachments from the model entry.
   * @param {string} fieldkey
   * @param {string} modelRef
   * @param {number} modelId
   * @returns {Promise<void>}
   */
  async bulkUnlink(
    filekeys: string[],
    modelRef: string,
    modelId: number,
    trx?: Knex.Transaction,
  ): Promise<void> {
    await bluebird.each(filekeys, (fieldKey: string) => {
      try {
        this.unlink(fieldKey, modelRef, modelId, trx);
      } catch {
        // Ignore catching exceptions on bulk action.
      }
    });
  }

  /**
   * Unlink all the unpresented keys of the given model type and id.
   * @param {number} tenantId
   * @param {string[]} presentedKeys
   * @param {string} modelRef
   * @param {number} modelId
   * @param {Knex.Transaction} trx
   */
  async unlinkUnpresentedKeys(
    presentedKeys: string[],
    modelRef: string,
    modelId: number,
    trx?: Knex.Transaction,
  ): Promise<void> {
    const modelLinks = await this.documentLinkModel()
      .query(trx)
      .where('modelRef', modelRef)
      .where('modelId', modelId)
      .withGraphFetched('document');

    const modelLinkKeys = modelLinks.map((link) => link.document.key);
    const unpresentedKeys = difference(modelLinkKeys, presentedKeys);

    await this.bulkUnlink(unpresentedKeys, modelRef, modelId, trx);
  }

  /**
   * Unlink all attachments of the given model type and id.
   * @param {string} modelRef
   * @param {number} modelId
   * @param {Knex.Transaction} trx
   * @returns {Promise<void>}
   */
  async unlinkAllModelKeys(
    modelRef: string,
    modelId: number,
    trx?: Knex.Transaction,
  ): Promise<void> {
    // Get all the keys of the modelRef and modelId.
    const modelLinks = await this.documentLinkModel()
      .query(trx)
      .where('modelRef', modelRef)
      .where('modelId', modelId)
      .withGraphFetched('document');

    const modelLinkKeys = modelLinks.map((link) => link.document.key);

    await this.bulkUnlink(modelLinkKeys, modelRef, modelId, trx);
  }
}
