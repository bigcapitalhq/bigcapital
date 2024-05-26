import { Inject, Service } from 'typedi';
import bluebird from 'bluebird';
import { Knex } from 'knex';
import {
  validateLinkModelEntryExists,
  validateLinkModelExists,
} from './_utils';
import HasTenancyService from '../Tenancy/TenancyService';
import { ServiceError } from '@/exceptions';

@Service()
export class LinkAttachment {
  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Links the given file key to the given model type and id.
   * @param {number} tenantId
   * @param {string} filekey
   * @param {string} modelRef
   * @param {number} modelId
   * @returns {Promise<void>}
   */
  async link(
    tenantId: number,
    filekey: string,
    modelRef: string,
    modelId: number,
    trx?: Knex.Transaction
  ) {
    const { DocumentLink, Document, ...models } = this.tenancy.models(tenantId);
    const LinkModel = models[modelRef];
    validateLinkModelExists(LinkModel);

    const foundLinkModel = await LinkModel.query(trx).findById(modelId);
    validateLinkModelEntryExists(foundLinkModel);

    const foundLinks = await DocumentLink.query(trx)
      .where('modelRef', modelRef)
      .where('modelId', modelId);

    if (foundLinks.length > 0) {
      throw new ServiceError('DOCUMENT_LINK_ALREADY_LINKED');
    }
    const foundFile = await Document.query(trx).findOne('key', filekey);

    await DocumentLink.query(trx).insert({
      modelRef,
      modelId,
      documentId: foundFile.id,
    });
  }

  /**
   * Links the given file keys to the given model type and id.
   * @param {number} tenantId
   * @param {string[]} filekeys
   * @param {string} modelRef
   * @param {number} modelId
   * @param {Knex.Transaction} trx
   * @returns {Promise<void>}
   */
  async bulkLink(
    tenantId: number,
    filekeys: string[],
    modelRef: string,
    modelId: number,
    trx?: Knex.Transaction
  ) {
    await bluebird.map(
      filekeys,
      (fieldKey: string) =>
        this.link(tenantId, fieldKey, modelRef, modelId, trx),
      {
        concurrency: CONCURRENCY_ASYNC,
      }
    );
  }
}

const CONCURRENCY_ASYNC = 10;
