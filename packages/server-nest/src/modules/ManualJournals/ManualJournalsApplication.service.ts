import { Injectable } from '@nestjs/common';
import { CreateManualJournalService } from './commands/CreateManualJournal.service';
import { EditManualJournal } from './commands/EditManualJournal.service';
import { PublishManualJournal } from './commands/PublishManualJournal.service';
import { GetManualJournal } from './queries/GetManualJournal.service';
import { DeleteManualJournalService } from './commands/DeleteManualJournal.service';
import { IManualJournalDTO,  } from './types/ManualJournals.types';
// import { GetManualJournals } from './queries/GetManualJournals';

@Injectable()
export class ManualJournalsApplication {
  constructor(
    private createManualJournalService: CreateManualJournalService,
    private editManualJournalService: EditManualJournal,
    private deleteManualJournalService: DeleteManualJournalService,
    private publishManualJournalService: PublishManualJournal,
    private getManualJournalService: GetManualJournal,
    // private getManualJournalsService: GetManualJournals,
  ) {}

  /**
   * Make journal entries.
   * @param {number} tenantId
   * @param {IManualJournalDTO} manualJournalDTO
   * @returns {Promise<IManualJournal>}
   */
  public createManualJournal = (manualJournalDTO: IManualJournalDTO) => {
    return this.createManualJournalService.makeJournalEntries(manualJournalDTO);
  };

  /**
   * Edits jouranl entries.
   * @param {number} manualJournalId
   * @param {IMakeJournalDTO} manualJournalDTO
   */
  public editManualJournal = (
    manualJournalId: number,
    manualJournalDTO: IManualJournalDTO,
  ) => {
    return this.editManualJournalService.editJournalEntries(
      manualJournalId,
      manualJournalDTO,
    );
  };

  /**
   * Deletes the given manual journal
   * @param {number} manualJournalId
   * @return {Promise<void>}
   */
  public deleteManualJournal = (manualJournalId: number) => {
    return this.deleteManualJournalService.deleteManualJournal(
      manualJournalId,
    );
  };

  /**
   * Publish the given manual journal.
   * @param {number} manualJournalId - Manual journal id.
   */
  public publishManualJournal = (manualJournalId: number) => {
    return this.publishManualJournalService.publishManualJournal(
      manualJournalId,
    );
  };

  /**
   * Retrieves the specific manual journal.
   * @param {number} manualJournalId
   * @returns
   */
  public getManualJournal = (manualJournalId: number) => {
    return this.getManualJournalService.getManualJournal(
      manualJournalId,
    );
  };

  /**
   * Retrieves the paginated manual journals.
   * @param {number} tenantId
   * @param {IManualJournalsFilter} filterDTO
   * @returns
   */
  // public getManualJournals = (
  //   filterDTO: IManualJournalsFilter,
  // ) => {
  //   // return this.getManualJournalsService.getManualJournals(filterDTO);
  // };
}
