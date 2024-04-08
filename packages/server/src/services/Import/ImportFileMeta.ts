import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import { Inject, Service } from 'typedi';
import HasTenancyService from '../Tenancy/TenancyService';
import { ImportFileMetaTransformer } from './ImportFileMetaTransformer';

@Service()
export class ImportFileMeta {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private transformer: TransformerInjectable;

  /**
   *
   * @param {number} tenantId
   * @param {number} importId
   * @returns {}
   */
  async getImportMeta(tenantId: number, importId: string) {
    const { Import } = this.tenancy.models(tenantId);

    const importFile = await Import.query().findOne('importId', importId);

    // Retrieves the transformed accounts collection.
    return this.transformer.transform(tenantId, importFile, new ImportFileMetaTransformer());
  }
}
