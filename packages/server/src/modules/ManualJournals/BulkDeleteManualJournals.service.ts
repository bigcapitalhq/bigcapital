import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { PromisePool } from '@supercharge/promise-pool';
import { castArray, uniq } from 'lodash';
import { DeleteManualJournalService } from './commands/DeleteManualJournal.service';

@Injectable()
export class BulkDeleteManualJournalsService {
  constructor(
    private readonly deleteManualJournalService: DeleteManualJournalService,
  ) { }

  async bulkDeleteManualJournals(
    manualJournalIds: number | Array<number>,
    options?: { skipUndeletable?: boolean },
    trx?: Knex.Transaction,
  ): Promise<void> {
    const { skipUndeletable = false } = options ?? {};
    const journalsIds = uniq(castArray(manualJournalIds));

    const results = await PromisePool.withConcurrency(1)
      .for(journalsIds)
      .process(async (manualJournalId: number) => {
        try {
          await this.deleteManualJournalService.deleteManualJournal(
            manualJournalId,
          );
        } catch (error) {
          if (!skipUndeletable) {
            throw error;
          }
        }
      });

    if (!skipUndeletable && results.errors && results.errors.length > 0) {
      throw results.errors[0].raw;
    }
  }
}

