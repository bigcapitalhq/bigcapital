import intl from 'react-intl-universal';
import type { ManualJournal } from '@bigcapital/sdk-ts';
import { AbilitySubject, ManualJournalAction } from '@/constants/abilityOption';
import { DRAWERS } from '@/constants/drawers';
import { RESOURCES_TYPES } from '@/constants/resourcesTypes';
import {
  withDrawerActions,
  WithDrawerActionsProps,
} from '@/containers/Drawer/withDrawerActions';

interface JournalUniversalSearchSelectProps extends WithDrawerActionsProps {
  resourceType: string;
  resourceId: number;
  onAction?: () => void;
}

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
}: JournalUniversalSearchSelectProps) {
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
 * Mappes the manual journal item to search item.
 */
const manualJournalsToSearch = (manualJournal: ManualJournal) => ({
  id: manualJournal.id,
  text: manualJournal.journalNumber ?? '',
  subText: manualJournal.formattedDate ?? '',
  label: manualJournal.formattedAmount ?? '',
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
