// @ts-nocheck
import React from 'react';
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
  Icon,
  AdvancedFilterPopover,
  DashboardFilterButton,
  DashboardRowsHeightButton,
  FormattedMessage as T,
  Can,
  If,
  DashboardActionViewsList,
  DashboardActionsBar
} from '@/components';
import { useRefreshJournals } from '@/hooks/query/manualJournals';
import { useManualJournalsContext } from './ManualJournalsListProvider';
import { ManualJournalAction, AbilitySubject } from '@/constants/abilityOption';

import withManualJournals from './withManualJournals';
import withManualJournalsActions from './withManualJournalsActions';
import withSettings from '@/containers/Settings/withSettings';
import withSettingsActions from '@/containers/Settings/withSettingsActions';
import withDialogActions from '@/containers/Dialog/withDialogActions';

import { compose } from '@/utils';

/**
 * Manual journal actions bar.
 */
function ManualJournalActionsBar({
  // #withManualJournalsActions
  setManualJournalsTableState,

  // #withManualJournals
  manualJournalsFilterConditions,

  // #withSettings
  manualJournalsTableSize,

  // #withSettingsActions
  addSetting,
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
  const handleTabChange = (view) => {
    setManualJournalsTableState({ viewSlug: view ? view.slug : null });
  };
  // Handle click a refresh Journals
  const handleRefreshBtnClick = () => {
    refresh();
  };

  // Handle table row size change.
  const handleTableRowSizeChange = (size) => {
    addSetting('manualJournals', 'tableSize', size);
  };

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <DashboardActionViewsList
          resourceName={'manual-journals'}
          allMenuItem={true}
          views={journalsViews}
          onChange={handleTabChange}
        />
        <NavbarDivider />
        <Can I={ManualJournalAction.Create} a={AbilitySubject.ManualJournal}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="plus" />}
            text={<T id={'journal_entry'} />}
            onClick={onClickNewManualJournal}
          />
        </Can>
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
        <NavbarDivider />
        <DashboardRowsHeightButton
          initialValue={manualJournalsTableSize}
          onChange={handleTableRowSizeChange}
        />
        <NavbarDivider />
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
  withSettingsActions,
  withManualJournals(({ manualJournalsTableState }) => ({
    manualJournalsFilterConditions: manualJournalsTableState.filterRoles,
  })),
  withSettings(({ manualJournalsSettings }) => ({
    manualJournalsTableSize: manualJournalsSettings?.tableSize,
  })),
)(ManualJournalActionsBar);
