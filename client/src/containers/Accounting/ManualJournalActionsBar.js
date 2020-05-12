import React, { useMemo, useState, useCallback } from 'react';
import Icon from 'components/Icon';
import {
  Button,
  NavbarGroup,
  Classes,
  NavbarDivider,
  MenuItem,
  Menu,
  Popover,
  PopoverInteractionKind,
  Position,
  Intent
} from '@blueprintjs/core';
import classNames from 'classnames';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { compose } from 'utils';

import FilterDropdown from 'components/FilterDropdown';
import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar';
import DialogConnect from 'connectors/Dialog.connector';
import { If } from 'components';

import withResourceDetail from 'containers/Resources/withResourceDetails';
import withManualJournals from 'containers/Accounting/withManualJournals';
import withManualJournalsActions from 'containers/Accounting/withManualJournalsActions';

import { FormattedMessage as T, useIntl } from 'react-intl';


function ManualJournalActionsBar({
  // #withResourceDetail
  resourceName = 'manual_journal',
  resourceFields,

  // #withManualJournals
  manualJournalsViews,

  // #withManualJournalsActions
  addManualJournalsTableQueries,

  onFilterChanged,
  selectedRows,
  onBulkDelete
}) {
  const { path } = useRouteMatch();
  const history = useHistory();
  const {formatMessage} = useIntl();

  const viewsMenuItems = manualJournalsViews.map(view => {
    return (
      <MenuItem href={`${path}/${view.id}/custom_view`} text={view.name} />
    );
  });

  const onClickNewManualJournal = useCallback(() => {
    history.push('/dashboard/accounting/make-journal-entry');
  }, [history]);

  const filterDropdown = FilterDropdown({
    fields: resourceFields,
    onFilterChange: filterConditions => {
      addManualJournalsTableQueries({
        filter_roles: filterConditions || ''
      });
      onFilterChanged && onFilterChanged(filterConditions);
    }
  });
  const hasSelectedRows = useMemo(() => selectedRows.length > 0, [selectedRows]);

  // Handle delete button click.
  const handleBulkDelete = useCallback(() => {
    onBulkDelete && onBulkDelete(selectedRows.map(r => r.id));
  }, [onBulkDelete, selectedRows]);

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <Popover
          content={<Menu>{viewsMenuItems}</Menu>}
          minimal={true}
          interactionKind={PopoverInteractionKind.HOVER}
          position={Position.BOTTOM_LEFT}
        >
          <Button
            className={classNames(Classes.MINIMAL, 'button--table-views')}
            icon={<Icon icon='table' />}
            text={<T id={'table_views'}/>}
            rightIcon={'caret-down'}
          />
        </Popover>

        <NavbarDivider />

        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon='plus' />}
          text={<T id={'new_journal'}/>}
          onClick={onClickNewManualJournal}
        />
        <Popover
          content={filterDropdown}
          interactionKind={PopoverInteractionKind.CLICK}
          position={Position.BOTTOM_LEFT}
        >
          <Button
            className={classNames(Classes.MINIMAL, 'button--filter')}
            text='Filter'
            icon={<Icon icon='filter' />}
          />
        </Popover>

        <If condition={hasSelectedRows}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon='trash' iconSize={15} />}
            text={<T id={'delete'}/>}
            intent={Intent.DANGER}
            onClick={handleBulkDelete}
          />
        </If>

        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon='file-import' />}
          text={<T id={'import'}/>}
        />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon='file-export' />}
          text={<T id={'export'}/>}
        />
      </NavbarGroup>
    </DashboardActionsBar>
  );
}

export default compose(
  DialogConnect,
  withResourceDetail(({ resourceFields }) => ({
    resourceFields,
  })),
  withManualJournals(({ manualJournalsViews }) => ({
    manualJournalsViews,
  })),
  withManualJournalsActions,
)(ManualJournalActionsBar);
