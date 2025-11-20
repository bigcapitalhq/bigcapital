import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { PromisePool } from '@supercharge/promise-pool';
import { castArray, uniq } from 'lodash';
import { DeleteCreditNoteService } from './commands/DeleteCreditNote.service';

@Injectable()
export class BulkDeleteCreditNotesService {
  constructor(
    private readonly deleteCreditNoteService: DeleteCreditNoteService,
  ) { }

  async bulkDeleteCreditNotes(
    creditNoteIds: number | Array<number>,
    options?: { skipUndeletable?: boolean },
    trx?: Knex.Transaction,
  ): Promise<void> {
    const { skipUndeletable = false } = options ?? {};
    const notesIds = uniq(castArray(creditNoteIds));

    const results = await PromisePool.withConcurrency(1)
      .for(notesIds)
      .process(async (creditNoteId: number) => {
        try {
          await this.deleteCreditNoteService.deleteCreditNote(creditNoteId);
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

