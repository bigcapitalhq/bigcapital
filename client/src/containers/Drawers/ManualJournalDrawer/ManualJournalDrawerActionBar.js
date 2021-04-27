import React from 'react';
import { useHistory } from 'react-router-dom';
import Icon from 'components/Icon';
import { Button, Classes, NavbarGroup, Intent } from '@blueprintjs/core';
import { FormattedMessage as T } from 'react-intl';
import { safeCallback } from 'utils';

import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar';
import withAlertsActions from 'containers/Alert/withAlertActions';
import withDrawerActions from 'containers/Drawer/withDrawerActions';

import { compose } from 'utils';

/**
 * Manual journal action bar.
 */
function ManualJournalDrawerActionBar({
  // #ownProps
  manualJournal,

  // #withAlertsDialog
  openAlert,

  // #withDrawerActions
  closeDrawer,
}) {
  const history = useHistory();

  // Handle edit manual journal action.
  const onEditManualJournal = () => {
    if (manualJournal) {
      history.push(`/manual-journals/${manualJournal.id}/edit`);
      closeDrawer('journal-drawer');
    }
  };

  // Handle manual journal delete action.
  const onDeleteManualJournal = () => {
    if (manualJournal) {
      openAlert('journal-delete', { manualJournalId: manualJournal.id });
      closeDrawer('journal-drawer');
    }
  };

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="pen-18" />}
          text={<T id={'edit_journal'} />}
          onClick={safeCallback(onEditManualJournal)}
        />

        <Button
          className={Classes.MINIMAL}
          icon={<Icon style={{ color: 'red' }} icon="trash-18" iconSize={18} />}
          text={<T id={'delete'} />}
          onClick={safeCallback(onDeleteManualJournal)}
        />
      </NavbarGroup>
    </DashboardActionsBar>
  );
}

export default compose(
  withAlertsActions,
  withDrawerActions,
)(ManualJournalDrawerActionBar);
