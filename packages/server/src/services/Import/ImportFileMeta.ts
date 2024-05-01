import { Inject, Service } from 'typedi';
import HasTenancyService from '../Tenancy/TenancyService';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import { ImportFileMetaTransformer } from './ImportFileMetaTransformer';
import { Import } from '@/system/models';

@Service()
export class ImportFileMeta {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private transformer: TransformerInjectable;

  /**
   * Retrieves the import meta of the given import model id.
   * @param {number} tenantId
   * @param {number} importId
   * @returns {}
   */
  async getImportMeta(tenantId: number, importId: string) {
    const importFile = await Import.query()
      .where('tenantId', tenantId)
      .findOne('importId', importId);

    // Retrieves the transformed accounts collection.
    return this.transformer.transform(
      tenantId,
      importFile,
      new ImportFileMetaTransformer()
    );
  }
}
