import { Service, Inject } from 'typedi';
import { ServiceError } from '@/exceptions';
import { IManualJournalDTO, IManualJournalEntryDTO } from '@/interfaces';
import { ERRORS } from './constants';

@Service()
export class ManualJournalBranchesValidator {
  /**
   * Validates the DTO entries should have branch id.
   * @param {IManualJournalDTO} manualJournalDTO
   */
  public validateEntriesHasBranchId = async (
    manualJournalDTO: IManualJournalDTO
  ) => {
    const hasNoIdEntries = manualJournalDTO.entries.filter(
      (entry: IManualJournalEntryDTO) =>
        !entry.branchId && !manualJournalDTO.branchId
    );
    if (hasNoIdEntries.length > 0) {
      throw new ServiceError(ERRORS.MANUAL_JOURNAL_ENTRIES_HAVE_NO_BRANCH_ID);
    }
  };
}
