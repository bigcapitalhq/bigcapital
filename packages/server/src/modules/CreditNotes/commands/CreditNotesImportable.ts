import { Knex } from 'knex';
import { Injectable } from '@nestjs/common';
import { CreateCreditNoteService } from './CreateCreditNote.service';
import { Importable } from '@/modules/Import/Importable';
import { CreateCreditNoteDto } from '../dtos/CreditNote.dto';
import { ImportableService } from '@/modules/Import/decorators/Import.decorator';
import { CreditNote } from '../models/CreditNote';

@Injectable()
@ImportableService({ name: CreditNote.name })
export class CreditNotesImportable extends Importable {
  constructor(
    private readonly createCreditNoteImportable: CreateCreditNoteService,
  ) {
    super();
  }

  /**
   * Importing to credit note service.
   */
  public importable(
    createAccountDTO: CreateCreditNoteDto,
    trx?: Knex.Transaction,
  ) {
    return this.createCreditNoteImportable.creditCreditNote(
      createAccountDTO,
      trx,
    );
  }

  /**
   * Concurrrency controlling of the importing process.
   * @returns {number}
   */
  public get concurrency() {
    return 1;
  }

  /**
   * Retrieves the sample data that used to download accounts sample sheet.
   */
  public sampleData(): any[] {
    return [];
  }
}
