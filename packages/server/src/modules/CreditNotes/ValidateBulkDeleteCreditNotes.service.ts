import { Injectable, Inject } from '@nestjs/common';
import { Knex } from 'knex';
import { TENANCY_DB_CONNECTION } from '../Tenancy/TenancyDB/TenancyDB.constants';
import { DeleteCreditNoteService } from './commands/DeleteCreditNote.service';

@Injectable()
export class ValidateBulkDeleteCreditNotesService {
  constructor(
    private readonly deleteCreditNoteService: DeleteCreditNoteService,
    @Inject(TENANCY_DB_CONNECTION)
    private readonly tenantKnex: () => Knex,
  ) { }

  public async validateBulkDeleteCreditNotes(creditNoteIds: number[]): Promise<{
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

      for (const creditNoteId of creditNoteIds) {
        try {
          await this.deleteCreditNoteService.deleteCreditNote(
            creditNoteId,
            trx,
          );
          deletableIds.push(creditNoteId);
        } catch (error) {
          nonDeletableIds.push(creditNoteId);
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

