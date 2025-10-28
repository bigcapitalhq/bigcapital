import { castArray, difference } from 'lodash';
import { Inject, Injectable } from '@nestjs/common';
import { TenantModelProxy } from '../System/models/TenantBaseModel';
import { DocumentModel } from './models/Document.model';
import { ServiceError } from '../Items/ServiceError';

@Injectable()
export class ValidateAttachments {
  constructor(
    @Inject(DocumentModel.name)
    private readonly documentModel: TenantModelProxy<typeof DocumentModel>,
  ) {}

  /**
   * Validates the given file keys existance.
   * @param {string|string[]} key
   */
  async validate(key: string | string[]) {
    const keys = castArray(key);
    const documents = await this.documentModel().query().whereIn('key', key);
    const documentKeys = documents.map((document) => document.key);

    const notFoundKeys = difference(keys, documentKeys);

    if (notFoundKeys.length > 0) {
      throw new ServiceError('DOCUMENT_KEYS_INVALID');
    }
  }
}
