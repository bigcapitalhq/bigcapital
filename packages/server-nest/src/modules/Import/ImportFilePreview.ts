import { Inject, Service } from 'typedi';
import HasTenancyService from '../Tenancy/TenancyService';
import { ImportFilePreviewPOJO } from './interfaces';
import { ImportFileProcess } from './ImportFileProcess';
import { ImportAls } from './ImportALS';

@Service()
export class ImportFilePreview {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private importFile: ImportFileProcess;

  @Inject()
  private importAls: ImportAls;

  /**
   * Preview the imported file results before commiting the transactions.
   * @param {number} tenantId - 
   * @param {string} importId - 
   * @returns {Promise<ImportFilePreviewPOJO>}
   */
  public async preview(
    tenantId: number,
    importId: string
  ): Promise<ImportFilePreviewPOJO> {
    return this.importAls.runPreview<Promise<ImportFilePreviewPOJO>>(() =>
      this.previewAlsRun(tenantId, importId)
    );
  }

  /**
   * Preview the imported file results before commiting the transactions.
   * @param {number} tenantId
   * @param {number} importId
   * @returns {Promise<ImportFilePreviewPOJO>}
   */
  public async previewAlsRun(
    tenantId: number,
    importId: string
  ): Promise<ImportFilePreviewPOJO> {
    const knex = this.tenancy.knex(tenantId);
    const trx = await knex.transaction({ isolationLevel: 'read uncommitted' });

    const meta = await this.importFile.import(tenantId, importId, trx);

    // Rollback the successed transaction.
    await trx.rollback();

    return meta;
  }
}
