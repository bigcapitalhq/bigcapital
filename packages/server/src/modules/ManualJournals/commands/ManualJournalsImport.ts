import { Knex } from 'knex';
import * as Yup from 'yup';
import { Importable } from '../../Import/Importable';
import { CreateManualJournalService } from './CreateManualJournal.service';
import { ImportableContext } from '../../Import/interfaces';
import { ManualJournalsSampleData } from '../constants';
import { CreateManualJournalDto } from '../dtos/ManualJournal.dto';

export class ManualJournalImportable extends Importable {
  constructor(
    private readonly createManualJournalService: CreateManualJournalService,
  ) {
    super();
  }

  /**
   * Importing to account service.
   * @param {CreateManualJournalDto} createAccountDTO
   */
  public importable(
    createJournalDTO: CreateManualJournalDto,
    trx?: Knex.Transaction,
  ) {
    return this.createManualJournalService.makeJournalEntries(
      createJournalDTO,
      trx,
    );
  }

  /**
   * Transformes the DTO before passing it to importable and validation.
   * @param {Record<string, any>} createDTO
   * @param {ImportableContext} context
   * @returns {Record<string, any>}
   */
  public transform(createDTO: Record<string, any>, context: ImportableContext) {
    return createDTO;
  }

  /**
   * Params validation schema.
   * @returns {ValidationSchema[]}
   */
  public paramsValidationSchema() {
    return Yup.object().shape({
      autoIncrement: Yup.boolean(),
    });
  }

  /**
   * Retrieves the sample data of manual journals that used to download sample sheet.
   * @returns {Record<string, any>}
   */
  public sampleData(): Record<string, any>[] {
    return ManualJournalsSampleData;
  }
}
