import { Inject, Service } from 'typedi';
import HasTenancyService from '../Tenancy/TenancyService';
import { ImportFilePreviewPOJO } from './interfaces';
import { ImportFileProcess } from './ImportFileProcess';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import events from '@/subscribers/events';
import { IImportFileCommitedEventPayload } from '@/interfaces/Import';

@Service()
export class ImportFileProcessCommit {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private importFile: ImportFileProcess;

  @Inject()
  private eventPublisher: EventPublisher;

  /**
   * Commits the imported file.
   * @param {number} tenantId
   * @param {number} importId
   * @returns {Promise<ImportFilePreviewPOJO>}
   */
  public async commit(
    tenantId: number,
    importId: number
  ): Promise<ImportFilePreviewPOJO> {
    const knex = this.tenancy.knex(tenantId);
    const trx = await knex.transaction({ isolationLevel: 'read uncommitted' });

    const meta = await this.importFile.import(tenantId, importId, trx);

    // Commit the successed transaction.
    await trx.commit();

    // Triggers `onImportFileCommitted` event.
    await this.eventPublisher.emitAsync(events.import.onImportCommitted, {
      meta,
      importId,
      tenantId,
    } as IImportFileCommitedEventPayload);

    return meta;
  }
}
