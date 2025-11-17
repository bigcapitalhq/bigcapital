import { Injectable } from '@nestjs/common';
import { CreateManualJournalService } from './commands/CreateManualJournal.service';
import { EditManualJournal } from './commands/EditManualJournal.service';
import { PublishManualJournal } from './commands/PublishManualJournal.service';
import { GetManualJournal } from './queries/GetManualJournal.service';
import { DeleteManualJournalService } from './commands/DeleteManualJournal.service';
import { IManualJournalsFilter } from './types/ManualJournals.types';
import {
  CreateManualJournalDto,
  EditManualJournalDto,
} from './dtos/ManualJournal.dto';
import { GetManualJournals } from './queries/GetManualJournals.service';
import { BulkDeleteManualJournalsService } from './BulkDeleteManualJournals.service';
import { ValidateBulkDeleteManualJournalsService } from './ValidateBulkDeleteManualJournals.service';
// import { GetManualJournals } from './queries/GetManualJournals';

@Injectable()
export class ManualJournalsApplication {
  constructor(
    private createManualJournalService: CreateManualJournalService,
    private editManualJournalService: EditManualJournal,
    private deleteManualJournalService: DeleteManualJournalService,
    private publishManualJournalService: PublishManualJournal,
    private getManualJournalService: GetManualJournal,
    private getManualJournalsService: GetManualJournals,
    private bulkDeleteManualJournalsService: BulkDeleteManualJournalsService,
    private validateBulkDeleteManualJournalsService: ValidateBulkDeleteManualJournalsService,
  ) {}

  /**
   * Make journal entries.
   * @param {number} tenantId
   * @param {IManualJournalDTO} manualJournalDTO
   * @returns {Promise<IManualJournal>}
   */
  public createManualJournal = (manualJournalDTO: CreateManualJournalDto) => {
    return this.createManualJournalService.makeJournalEntries(manualJournalDTO);
  };

  /**
   * Edits jouranl entries.
   * @param {number} manualJournalId
   * @param {IMakeJournalDTO} manualJournalDTO
   */
  public editManualJournal = (
    manualJournalId: number,
    manualJournalDTO: EditManualJournalDto,
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
    return this.deleteManualJournalService.deleteManualJournal(manualJournalId);
  };

  /**
   * Bulk deletes manual journals.
   * @param {number[]} manualJournalIds
   */
  public bulkDeleteManualJournals = (manualJournalIds: number[]) => {
    return this.bulkDeleteManualJournalsService.bulkDeleteManualJournals(
      manualJournalIds,
    );
  };

  /**
   * Validates which manual journals can be deleted.
   * @param {number[]} manualJournalIds
   */
  public validateBulkDeleteManualJournals = (manualJournalIds: number[]) => {
    return this.validateBulkDeleteManualJournalsService.validateBulkDeleteManualJournals(
      manualJournalIds,
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
   */
  public getManualJournal = (manualJournalId: number) => {
    return this.getManualJournalService.getManualJournal(manualJournalId);
  };

  /**
   * Retrieves the paginated manual journals.
   * @param {IManualJournalsFilter} filterDTO
   */
  public getManualJournals = (filterDTO: Partial<IManualJournalsFilter>) => {
    return this.getManualJournalsService.getManualJournals(filterDTO);
  };
}
