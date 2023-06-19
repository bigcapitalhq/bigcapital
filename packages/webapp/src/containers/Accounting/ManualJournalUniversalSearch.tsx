// @ts-nocheck
import intl from 'react-intl-universal';
import { RESOURCES_TYPES } from '@/constants/resourcesTypes';
import { AbilitySubject, ManualJournalAction } from '@/constants/abilityOption';
import withDrawerActions from '@/containers/Drawer/withDrawerActions';
import { DRAWERS } from '@/constants/drawers';

/**
 * Universal search manual journal item select action.
 */
function JournalUniversalSearchSelectComponent({
  // #ownProps
  resourceType,
  resourceId,
  onAction,

  // #withDrawerActions
  openDrawer,
}) {
  if (resourceType === RESOURCES_TYPES.MANUAL_JOURNAL) {
    openDrawer(DRAWERS.JOURNAL_DETAILS, { manualJournalId: resourceId });
    onAction && onAction();
  }
  return null;
}

export const JournalUniversalSearchSelectAction = withDrawerActions(
  JournalUniversalSearchSelectComponent,
);

/**
 * Maps the manual journal item to search item.
 */
const manualJournalsToSearch = (manualJournal) => ({
  id: manualJournal.id,
  text: manualJournal.journal_number,
  subText: manualJournal.formatted_date,
  label: manualJournal.formatted_amount,
  reference: manualJournal,
});

/**
 * Binds universal search invoice configure.
 */
export const universalSearchJournalBind = () => ({
  resourceType: RESOURCES_TYPES.MANUAL_JOURNAL,
  optionItemLabel: intl.get('manual_journals'),
  selectItemAction: JournalUniversalSearchSelectAction,
  itemSelect: manualJournalsToSearch,
  permission: {
    ability: ManualJournalAction.View,
    subject: AbilitySubject.ManualJournal,
  },
});
