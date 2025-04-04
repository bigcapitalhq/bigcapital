import { castArray, difference } from 'lodash';
import HasTenancyService from '../Tenancy/TenancyService';
import { ServiceError } from '@/exceptions';
import { Inject, Service } from 'typedi';
import { TenantModelProxy } from '../System/models/TenantBaseModel';
import { DocumentModel } from './models/Document.model';

@Service()
export class ValidateAttachments {

  constructor(
    private readonly documentModel: TenantModelProxy<typeof DocumentModel>
  ) {

  }
  /**
   * Validates the given file keys existance.
   * @param {number} tenantId
   * @param {string|string[]} key
   */
  async validate(tenantId: number, key: string | string[]) {
    const keys = castArray(key);
    const documents = await this.documentModel().query().whereIn('key', key);
    const documentKeys = documents.map((document) => document.key);

    const notFoundKeys = difference(keys, documentKeys);

    if (notFoundKeys.length > 0) {
      throw new ServiceError('DOCUMENT_KEYS_INVALID');
    }
  }
}
