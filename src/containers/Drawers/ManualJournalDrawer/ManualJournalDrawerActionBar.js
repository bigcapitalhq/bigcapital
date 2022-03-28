import React from 'react';
import { useHistory } from 'react-router-dom';
import Icon from 'components/Icon';
import {
  Button,
  Classes,
  NavbarGroup,
  Intent,
  NavbarDivider,
} from '@blueprintjs/core';
import { DrawerActionsBar, Can, FormattedMessage as T } from 'components';

import withAlertsActions from 'containers/Alert/withAlertActions';
import withDrawerActions from 'containers/Drawer/withDrawerActions';

import { useManualJournalDrawerContext } from './ManualJournalDrawerProvider';
import {
  ManualJournalAction,
  AbilitySubject,
} from '../../../common/abilityOption';

import { compose } from 'utils';

/**
 * Manual journal action bar.
 */
function ManualJournalDrawerActionBar({
  // #withAlertsDialog
  openAlert,

  // #withDrawerActions
  closeDrawer,
}) {
  const history = useHistory();
  const { manualJournalId } = useManualJournalDrawerContext();

  // Handle edit manual journal action.
  const handleEditManualJournal = () => {
    history.push(`/manual-journals/${manualJournalId}/edit`);
    closeDrawer('journal-drawer');
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

export default compose(
  withAlertsActions,
  withDrawerActions,
)(ManualJournalDrawerActionBar);
