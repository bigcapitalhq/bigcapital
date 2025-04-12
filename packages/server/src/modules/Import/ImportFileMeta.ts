import { Inject, Injectable } from '@nestjs/common';
import { ImportModel } from './models/Import';
import { ImportFileMetaTransformer } from './ImportFileMetaTransformer';
import { TransformerInjectable } from '../Transformer/TransformerInjectable.service';
import { TenancyContext } from '../Tenancy/TenancyContext.service';

@Injectable()
export class ImportFileMeta {
  constructor(
    private readonly transformer: TransformerInjectable,
    private readonly tenancyContext: TenancyContext,

    @Inject(ImportModel.name)
    private readonly importModel: () => typeof ImportModel,
  ) {}

  /**
   * Retrieves the import meta of the given import model id.
   * @param {number} importId
   */
  async getImportMeta(importId: string) {
    const tenant = await this.tenancyContext.getTenant();
    const tenantId = tenant.id;

    const importFile = await this.importModel()
      .query()
      .where('tenantId', tenantId)
      .findOne('importId', importId);

    // Retrieves the transformed accounts collection.
    return this.transformer.transform(
      importFile,
      new ImportFileMetaTransformer(),
    );
  }
}
