import React from 'react';
import Icon from 'components/Icon';
import {
  Button,
  NavbarGroup,
  Classes,
  NavbarDivider,
  Intent,
  Alignment,
} from '@blueprintjs/core';
import { useHistory } from 'react-router-dom';
import {
  AdvancedFilterPopover,
  DashboardFilterButton,
  FormattedMessage as T,
} from 'components';

import { useRefreshJournals } from 'hooks/query/manualJournals';
import { useManualJournalsContext } from './ManualJournalsListProvider';
import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar';

import withDialogActions from 'containers/Dialog/withDialogActions';
import withManualJournalsActions from './withManualJournalsActions';
import withManualJournals from './withManualJournals';

import { If, DashboardActionViewsList } from 'components';

import { compose } from 'utils';

/**
 * Manual journal actions bar.
 */
function ManualJournalActionsBar({
  // #withManualJournalsActions
  setManualJournalsTableState,

  // #withManualJournals
  manualJournalsFilterConditions,
}) {
  // History context.
  const history = useHistory();

  // Manual journals context.
  const { journalsViews, fields } = useManualJournalsContext();

  // Manual journals refresh action.
  const { refresh } = useRefreshJournals();

  // Handle click a new manual journal.
  const onClickNewManualJournal = () => {
    history.push('/make-journal-entry');
  };
  // Handle delete button click.
  const handleBulkDelete = () => {};

  // Handle tab change.
  const handleTabChange = (customView) => {
    setManualJournalsTableState({ customViewId: customView.id || null });
  };
  // Handle click a refresh Journals
  const handleRefreshBtnClick = () => { refresh(); };

  console.log(manualJournalsFilterConditions, fields, 'XXX');

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <DashboardActionViewsList
          resourceName={'manual-journals'}
          views={journalsViews}
          onChange={handleTabChange}
        />
        <NavbarDivider />

        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="plus" />}
          text={<T id={'journal_entry'} />}
          onClick={onClickNewManualJournal}
        />
        <AdvancedFilterPopover
          advancedFilterProps={{
            conditions: manualJournalsFilterConditions,
            defaultFieldKey: 'journal_number',
            fields,
            onFilterChange: (filterConditions) => {
              setManualJournalsTableState({ filterRoles: filterConditions });
            },
          }}
        >
          <DashboardFilterButton
            conditionsCount={manualJournalsFilterConditions.length}
          />
        </AdvancedFilterPopover>

        <If condition={false}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="trash-16" iconSize={16} />}
            text={<T id={'delete'} />}
            intent={Intent.DANGER}
            onClick={handleBulkDelete}
          />
        </If>

        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="print-16" iconSize={16} />}
          text={<T id={'print'} />}
        />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="file-import-16" iconSize={16} />}
          text={<T id={'import'} />}
        />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="file-export-16" iconSize={16} />}
          text={<T id={'export'} />}
        />
      </NavbarGroup>
      <NavbarGroup align={Alignment.RIGHT}>
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="refresh-16" iconSize={14} />}
          onClick={handleRefreshBtnClick}
        />
      </NavbarGroup>
    </DashboardActionsBar>
  );
}

export default compose(
  withDialogActions,
  withManualJournalsActions,
  withManualJournals(({ manualJournalsTableState }) => ({
    manualJournalsFilterConditions: manualJournalsTableState.filterRoles,
  }))
)(ManualJournalActionsBar);
