import { Import } from './models/Import';
import { ImportFileMetaTransformer } from './ImportFileMetaTransformer';
import { Injectable } from '@nestjs/common';
import { TransformerInjectable } from '../Transformer/TransformerInjectable.service';

@Injectable()
export class ImportFileMeta {
  constructor(private readonly transformer: TransformerInjectable) {}

  /**
   * Retrieves the import meta of the given import model id.
   * @param {number} tenantId
   * @param {number} importId
   * @returns {}
   */
  async getImportMeta(importId: string) {
    const importFile = await Import.query()
      .where('tenantId', tenantId)
      .findOne('importId', importId);

    // Retrieves the transformed accounts collection.
    return this.transformer.transform(
      importFile,
      new ImportFileMetaTransformer(),
    );
  }
}
