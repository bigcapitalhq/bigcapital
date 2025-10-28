import { Knex } from 'knex';
import { Inject, Injectable } from '@nestjs/common';
import { ImportFilePreviewPOJO } from './interfaces';
import { ImportFileProcess } from './ImportFileProcess';
import { ImportAls } from './ImportALS';
import { TENANCY_DB_CONNECTION } from '../Tenancy/TenancyDB/TenancyDB.constants';

@Injectable()
export class ImportFilePreview {
  constructor(
    private readonly importFile: ImportFileProcess,
    private readonly importAls: ImportAls,

    @Inject(TENANCY_DB_CONNECTION)
    private readonly tenantKnex: () => Knex
  ) {}

  /**
   * Preview the imported file results before commiting the transactions.
   * @param {string} importId -
   * @returns {Promise<ImportFilePreviewPOJO>}
   */
  public async preview(importId: string): Promise<ImportFilePreviewPOJO> {
    return this.importAls.runPreview<Promise<ImportFilePreviewPOJO>>(() =>
      this.previewAlsRun(importId),
    );
  }

  /**
   * Preview the imported file results before commiting the transactions.
   * @param {number} importId
   * @returns {Promise<ImportFilePreviewPOJO>}
   */
  public async previewAlsRun(importId: string): Promise<ImportFilePreviewPOJO> {
    const trx = await this.tenantKnex().transaction({ isolationLevel: 'read uncommitted' });

    const meta = await this.importFile.import(importId, trx);

    // Rollback the successed transaction.
    await trx.rollback();

    return meta;
  }
}
