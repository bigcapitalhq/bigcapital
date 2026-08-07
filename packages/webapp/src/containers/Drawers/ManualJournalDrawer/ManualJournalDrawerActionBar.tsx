import {
  Button,
  Classes,
  NavbarGroup,
  Intent,
  NavbarDivider,
} from '@blueprintjs/core';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useManualJournalDrawerContext } from './ManualJournalDrawerProvider';
import {
  Icon,
  DrawerActionsBar,
  Can,
  FormattedMessage as T,
} from '@/components';
import { ManualJournalAction, AbilitySubject } from '@/constants/abilityOption';
import { DRAWERS } from '@/constants/drawers';
import {
  withAlertActions,
  WithAlertActionsProps,
} from '@/containers/Alert/withAlertActions';
import {
  withDrawerActions,
  WithDrawerActionsProps,
} from '@/containers/Drawer/withDrawerActions';
import { compose } from '@/utils';

interface ManualJournalDrawerActionBarInnerProps
  extends WithAlertActionsProps,
    WithDrawerActionsProps {}

/**
 * Manual journal action bar.
 */
function ManualJournalDrawerActionBarInner({
  // #withAlertsDialog
  openAlert,

  // #withDrawerActions
  closeDrawer,
}: ManualJournalDrawerActionBarInnerProps) {
  const history = useHistory();
  const { manualJournalId } = useManualJournalDrawerContext();

  // Handle edit manual journal action.
  const handleEditManualJournal = () => {
    history.push(`/manual-journals/${manualJournalId}/edit`);
    closeDrawer(DRAWERS.JOURNAL_DETAILS);
  };

  // Handle manual journal delete action.
  const handleDeleteManualJournal = () => {
    openAlert('journal-delete', { manualJournalId });
  };

  return (
    <DrawerActionsBar>
      <NavbarGroup>
        <Can I={ManualJournalAction.Edit} a={AbilitySubject.ManualJournal}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="pen-18" />}
            text={<T id={'edit_journal'} />}
            onClick={handleEditManualJournal}
          />
        </Can>
        <Can I={ManualJournalAction.Delete} a={AbilitySubject.ManualJournal}>
          <NavbarDivider />
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="trash-16" iconSize={16} />}
            text={<T id={'delete'} />}
            intent={Intent.DANGER}
            onClick={handleDeleteManualJournal}
          />
        </Can>
      </NavbarGroup>
    </DrawerActionsBar>
  );
}

export const ManualJournalDrawerActionBar = compose(
  withAlertActions,
  withDrawerActions,
)(ManualJournalDrawerActionBarInner);
