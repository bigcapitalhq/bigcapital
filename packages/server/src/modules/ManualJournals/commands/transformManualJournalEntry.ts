import { TrackingCategoryAssignmentDto } from '@/modules/TrackingCategories/dtos/TrackingCategory.dto';
import { ManualJournalEntryDto } from '../dtos/ManualJournal.dto';

/**
 * Picks only the storage columns of a tracking category assignment.
 * Read responses also include the related `category` and `option`, which
 * `upsertGraph` would otherwise treat as nested graphs to persist.
 */
const toTrackingCategoryAssignment = ({
  categoryId,
  optionId,
}: TrackingCategoryAssignmentDto): TrackingCategoryAssignmentDto => ({
  categoryId,
  optionId,
});

/**
 * Transforms a manual journal entry DTO into its persistence shape.
 * @param {ManualJournalEntryDto} entry - Manual journal entry DTO.
 * @returns {ManualJournalEntryDto}
 */
export const transformManualJournalEntry = (
  entry: ManualJournalEntryDto,
): ManualJournalEntryDto => ({
  ...entry,
  trackingCategories: (entry.trackingCategories ?? []).map(
    toTrackingCategoryAssignment,
  ),
});
