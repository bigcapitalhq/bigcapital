import { Inject, Service } from 'typedi';
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
   *
   * @param {number} tenantId
   * @param {string} filekey
   * @param {string} modelRef
   * @param {number} modelId
   */
  async link(
    tenantId: number,
    filekey: string,
    modelRef: string,
    modelId: number
  ) {
    const { DocumentLink, Document, ...models } = this.tenancy.models(tenantId);
    const LinkModel = models[modelRef];
    validateLinkModelExists(LinkModel);

    const foundLinkModel = await LinkModel.query().findById(modelId);
    validateLinkModelEntryExists(foundLinkModel);

    const foundLinks = await DocumentLink.query()
      .where('modelRef', modelRef)
      .where('modelId', modelId);

    if (foundLinks.length > 0) {
      throw new ServiceError('');
    }
    const foundFile = await Document.query().findOne('key', filekey);

    await DocumentLink.query().insert({
      modelRef,
      modelId,
      documentId: foundFile.id,
    });
  }
}
