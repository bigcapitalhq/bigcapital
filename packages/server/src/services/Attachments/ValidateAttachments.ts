import { castArray, difference } from 'lodash';
import HasTenancyService from '../Tenancy/TenancyService';
import { ServiceError } from '@/exceptions';
import { Inject, Service } from 'typedi';

@Service()
export class ValidateAttachments {
  @Inject()
  tenancy: HasTenancyService;

  /**
   * Validates the given file keys existance.
   * @param {number} tenantId
   * @param {string|string[]} key
   */
  async validate(tenantId: number, key: string | string[]) {
    const { Document } = this.tenancy.models(tenantId);

    const keys = castArray(key);
    const documents = await Document.query().whereIn('key', key);
    const documentKeys = documents.map((document) => document.key);

    const notFoundKeys = difference(keys, documentKeys);

    if (notFoundKeys.length > 0) {
      throw new ServiceError('DOCUMENT_KEYS_INVALID');
    }
  }
}
