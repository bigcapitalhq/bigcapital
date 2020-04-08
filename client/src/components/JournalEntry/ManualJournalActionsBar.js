import React, { useMemo, useState } from 'react';
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
import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar';
import DialogConnect from 'connectors/Dialog.connector';
import { compose } from 'utils';
import FilterDropdown from 'components/FilterDropdown';
import ManualJournalsConnect from 'connectors/ManualJournals.connect';
import ResourceConnect from 'connectors/Resource.connector';

function ManualJournalActionsBar({
  openDialog,
  views,
  getResourceFields,
  addManualJournalsTableQueries,
  onFilterChanged
}) {
  const { path } = useRouteMatch();
  const history = useHistory();

  const manualJournalFields = getResourceFields('manual_journals');
  const viewsMenuItems = views.map(view => {
    return (
      <MenuItem href={`${path}/${view.id}/custom_view`} text={view.name} />
    );
  });

  const onClickNewManualJournal = () => {
    history.push('/dashboard/accounting/make-journal-entry');
  };
  const filterDropdown = FilterDropdown({
    fields: manualJournalFields,
    onFilterChange: filterConditions => {
      addManualJournalsTableQueries({
        filter_roles: filterConditions || ''
      });
      onFilterChanged && onFilterChanged(filterConditions);
    }
  });
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
            text='Table Views'
            rightIcon={'caret-down'}
          />
        </Popover>
        <NavbarDivider />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon='plus' />}
          text='New Journal'
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
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon='trash' iconSize={15} />}
          text='Delete'
          intent={Intent.DANGER}
        />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon='file-import' />}
          text='Import'
        />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon='file-export' />}
          text='Export'
        />
      </NavbarGroup>
    </DashboardActionsBar>
  );
}

export default compose(
  DialogConnect,
  ManualJournalsConnect,
  ResourceConnect
)(ManualJournalActionsBar);
