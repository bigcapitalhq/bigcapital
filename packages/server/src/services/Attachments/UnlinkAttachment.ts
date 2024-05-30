import { Inject, Service } from 'typedi';
import bluebird from 'bluebird';
import HasTenancyService from '../Tenancy/TenancyService';
import {
  validateLinkModelEntryExists,
  validateLinkModelExists,
} from './_utils';
import { Knex } from 'knex';
import { difference } from 'lodash';

@Service()
export class UnlinkAttachment {
  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Unlink the attachments from the model entry.
   * @param {number} tenantId
   * @param {string} filekey
   * @param {string} modelRef
   * @param {number} modelId
   */
  async unlink(
    tenantId: number,
    filekey: string,
    modelRef: string,
    modelId: number,
    trx?: Knex.Transaction
  ): Promise<void> {
    const { DocumentLink, Document, ...models } = this.tenancy.models(tenantId);
    const LinkModel = models[modelRef];
    validateLinkModelExists(LinkModel);

    const foundLinkModel = await LinkModel.query(trx).findById(modelId);
    validateLinkModelEntryExists(foundLinkModel);

    const document = await Document.query(trx).findOne('key', filekey);

    // Delete the document link.
    await DocumentLink.query(trx)
      .where('modelRef', modelRef)
      .where('modelId', modelId)
      .where('documentId', document.id)
      .delete();
  }

  /**
   * Bulk unlink the attachments from the model entry.
   * @param {number} tenantId
   * @param {string} fieldkey
   * @param {string} modelRef
   * @param {number} modelId
   * @returns {Promise<void>}
   */
  async bulkUnlink(
    tenantId: number,
    filekeys: string[],
    modelRef: string,
    modelId: number,
    trx?: Knex.Transaction
  ): Promise<void> {
    await bluebird.each(filekeys, (fieldKey: string) => {
      try {
        this.unlink(tenantId, fieldKey, modelRef, modelId, trx);
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
    tenantId: number,
    presentedKeys: string[],
    modelRef: string,
    modelId: number,
    trx?: Knex.Transaction
  ): Promise<void> {
    const { DocumentLink } = this.tenancy.models(tenantId);

    const modelLinks = await DocumentLink.query(trx)
      .where('modelRef', modelRef)
      .where('modelId', modelId)
      .withGraphFetched('document');

    const modelLinkKeys = modelLinks.map((link) => link.document.key);
    const unpresentedKeys = difference(modelLinkKeys, presentedKeys);

    await this.bulkUnlink(tenantId, unpresentedKeys, modelRef, modelId, trx);
  }

  /**
   * Unlink all attachments of the given model type and id.
   * @param {number} tenantId
   * @param {string} modelRef
   * @param {number} modelId
   * @param {Knex.Transaction} trx
   * @returns {Promise<void>}
   */
  async unlinkAllModelKeys(
    tenantId: number,
    modelRef: string,
    modelId: number,
    trx?: Knex.Transaction
  ): Promise<void> {
    const { DocumentLink } = this.tenancy.models(tenantId);

    // Get all the keys of the modelRef and modelId.
    const modelLinks = await DocumentLink.query(trx)
      .where('modelRef', modelRef)
      .where('modelId', modelId)
      .withGraphFetched('document');

    const modelLinkKeys = modelLinks.map((link) => link.document.key);

    await this.bulkUnlink(tenantId, modelLinkKeys, modelRef, modelId, trx);
  }
}
