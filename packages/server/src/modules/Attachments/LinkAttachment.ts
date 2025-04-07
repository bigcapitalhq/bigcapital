import { ModuleRef } from '@nestjs/core';
import bluebird from 'bluebird';
import { Knex } from 'knex';
import {
  validateLinkModelEntryExists,
  validateLinkModelExists,
} from './_utils';
import { ERRORS } from './constants';
import { TenantModelProxy } from '../System/models/TenantBaseModel';
import { DocumentLink } from '../ChromiumlyTenancy/models/DocumentLink';
import { Inject, Injectable } from '@nestjs/common';
import { ServiceError } from '../Items/ServiceError';
import { getAttachableModelsMap } from './decorators/InjectAttachable.decorator';
import { DocumentModel } from './models/Document.model';
import { SaleInvoice } from '../SaleInvoices/models/SaleInvoice';

@Injectable()
export class LinkAttachment {
  constructor(
    private moduleRef: ModuleRef,

    @Inject(DocumentLink.name)
    private readonly documentLinkModel: TenantModelProxy<typeof DocumentLink>,

    @Inject(DocumentModel.name)
    private readonly documentModel: TenantModelProxy<typeof DocumentModel>,
  ) {}

  /**
   * Links the given file key to the given model type and id.
   * @param {string} filekey - File key.
   * @param {string} modelRef - Model reference.
   * @param {number} modelId - Model id.
   * @returns {Promise<void>}
   */
  async link(
    filekey: string,
    modelRef: string,
    modelId: number,
    trx?: Knex.Transaction,
  ) {
    const attachmentsAttachableModels = getAttachableModelsMap();
    const attachableModel = attachmentsAttachableModels.get(modelRef);

    validateLinkModelExists(attachableModel);

    const LinkModel = this.moduleRef.get(modelRef, { strict: false });
    const foundFile = await this.documentModel()
      .query(trx)
      .findOne('key', filekey)
      .throwIfNotFound();

    const foundLinkModel = await LinkModel().query(trx).findById(modelId);
    validateLinkModelEntryExists(foundLinkModel);

    const foundLinks = await this.documentLinkModel().query(trx)
      .where('modelRef', modelRef)
      .where('modelId', modelId)
      .where('documentId', foundFile.id);

    if (foundLinks.length > 0) {
      throw new ServiceError(ERRORS.DOCUMENT_LINK_ALREADY_LINKED);
    }
    await this.documentLinkModel().query(trx).insert({
      modelRef,
      modelId,
      documentId: foundFile.id,
    });
  }

  /**
   * Links the given file keys to the given model type and id.
   * @param {string[]} filekeys - File keys. 
   * @param {string} modelRef - Model reference.
   * @param {number} modelId - Model id.
   * @param {Knex.Transaction} trx - Knex transaction.
   * @returns {Promise<void>}
   */
  async bulkLink(
    filekeys: string[],
    modelRef: string,
    modelId: number,
    trx?: Knex.Transaction,
  ) {
    return bluebird.each(filekeys, async (fieldKey: string) => {
      try {
        await this.link(fieldKey, modelRef, modelId, trx);
      } catch {
        // Ignore catching exceptions in bulk action.
      }
    });
  }
}
