import { Injectable, Inject } from '@nestjs/common';
import { Knex } from 'knex';
import { TENANCY_DB_CONNECTION } from '../Tenancy/TenancyDB/TenancyDB.constants';
import { DeleteManualJournalService } from './commands/DeleteManualJournal.service';

@Injectable()
export class ValidateBulkDeleteManualJournalsService {
  constructor(
    private readonly deleteManualJournalService: DeleteManualJournalService,
    @Inject(TENANCY_DB_CONNECTION)
    private readonly tenantKnex: () => Knex,
  ) {}

  public async validateBulkDeleteManualJournals(
    manualJournalIds: number[],
  ): Promise<{
    deletableCount: number;
    nonDeletableCount: number;
    deletableIds: number[];
    nonDeletableIds: number[];
  }> {
    const trx = await this.tenantKnex().transaction({
      isolationLevel: 'read uncommitted',
    });

    try {
      const deletableIds: number[] = [];
      const nonDeletableIds: number[] = [];

      for (const manualJournalId of manualJournalIds) {
        try {
          await this.deleteManualJournalService.deleteManualJournal(
            manualJournalId,
            trx,
          );
          deletableIds.push(manualJournalId);
        } catch (error) {
          nonDeletableIds.push(manualJournalId);
        }
      }

      await trx.rollback();

      return {
        deletableCount: deletableIds.length,
        nonDeletableCount: nonDeletableIds.length,
        deletableIds,
        nonDeletableIds,
      };
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }
}

