import { Knex } from 'knex';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IImportFileCommitedEventPayload, ImportFilePreviewPOJO } from './interfaces';
import { ImportFileProcess } from './ImportFileProcess';
import { ImportAls } from './ImportALS';
import { Inject, Injectable } from '@nestjs/common';
import { events } from '@/common/events/events';
import { TENANCY_DB_CONNECTION } from '../Tenancy/TenancyDB/TenancyDB.constants';

@Injectable()
export class ImportFileProcessCommit {
  constructor(
    private readonly importFile: ImportFileProcess,
    private readonly importAls: ImportAls,
    private readonly eventEmitter: EventEmitter2,

    @Inject(TENANCY_DB_CONNECTION)
    private readonly tenantKnex: () => Knex,
  ) {}

  /**
   * Commits the imported file under ALS.
   * @param {string} importId - The import ID.
   * @returns {Promise<ImportFilePreviewPOJO>}
   */
  public commit(importId: string): Promise<ImportFilePreviewPOJO> {
    return this.importAls.runCommit<Promise<ImportFilePreviewPOJO>>(() =>
      this.commitAlsRun(importId),
    );
  }

  /**
   * Commits the imported file.
   * @param {number} importId - The import ID.
   * @returns {Promise<ImportFilePreviewPOJO>}
   */
  public async commitAlsRun(importId: string): Promise<ImportFilePreviewPOJO> {
    const trx = await this.tenantKnex().transaction({
      isolationLevel: 'read uncommitted',
    });
    const meta = await this.importFile.import(importId, trx);

    // Commit the successed transaction.
    await trx.commit();

    // Triggers `onImportFileCommitted` event.
    await this.eventEmitter.emitAsync(events.import.onImportCommitted, {
      meta,
      importId,
    } as IImportFileCommitedEventPayload);

    return meta;
  }
}
