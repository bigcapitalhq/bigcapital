import { Inject, Service } from 'typedi';
import HasTenancyService from '../Tenancy/TenancyService';
import { ImportFilePreviewPOJO } from './interfaces';
import { ImportFileProcess } from './ImportFileProcess';

@Service()
export class ImportFilePreview {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private importFile: ImportFileProcess;

  /**
   * Preview the imported file results before commiting the transactions.
   * @param {number} tenantId
   * @param {number} importId
   * @returns {Promise<ImportFilePreviewPOJO>}
   */
  public async preview(
    tenantId: number,
    importId: number
  ): Promise<ImportFilePreviewPOJO> {
    const knex = this.tenancy.knex(tenantId);
    const trx = await knex.transaction({ isolationLevel: 'read uncommitted' });

    const meta = await this.importFile.import(tenantId, importId, trx);

    // Rollback the successed transaction.
    await trx.rollback();

    return meta;
  }
}
