import { Inject, Service } from 'typedi';
import HasTenancyService from '../Tenancy/TenancyService';
import {
  validateLinkModelEntryExists,
  validateLinkModelExists,
} from './_utils';

@Service()
export class UnlinkAttachment {
  @Inject()
  private tenancy: HasTenancyService;

  /**
   *
   * @param {number} tenantId
   * @param {string} filekey
   * @param {string} modelRef
   * @param {number} modelId
   */
  async unlink(
    tenantId: number,
    filekey: string,
    modelRef: string,
    modelId: number
  ) {
    const { DocumentLink, ...models } = this.tenancy.models(tenantId);
    const LinkModel = models[modelRef];
    validateLinkModelExists(LinkModel);

    const foundLinkModel = await LinkModel.query().findById(modelId);
    validateLinkModelEntryExists(foundLinkModel);

    // Delete the document link.
    await DocumentLink.query()
      .where('modelRef', modelRef)
      .where('modelId', modelId)
      .delete();
  }
}
