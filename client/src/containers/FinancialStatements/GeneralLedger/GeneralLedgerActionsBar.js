import React from 'react';
import {
  NavbarGroup,
  Button,
  Classes,
  NavbarHeading,
  NavbarDivider,
  Intent,
  Popover,
  PopoverInteractionKind,
  Position,
} from '@blueprintjs/core';
import Icon from 'components/Icon';
import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar'
import classNames from 'classnames';
import FilterDropdown from 'components/FilterDropdown';

export default function GeneralLedgerActionsBar({

}) {

  const filterDropdown = FilterDropdown({
    fields: [],
    onFilterChange: (filterConditions) => {
      
    },
  });

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <Button
          className={classNames(Classes.MINIMAL, 'button--table-views')}
          icon={<Icon icon='cog' />}
          text='Customize Report'
        />
        <NavbarDivider />

        <Popover
          content={filterDropdown}
          interactionKind={PopoverInteractionKind.CLICK}
          position={Position.BOTTOM_LEFT}>

          <Button
            className={classNames(Classes.MINIMAL, 'button--filter')}
            text="Filter"
            icon={ <Icon icon="filter" /> } />
        </Popover>

        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon='file-export' />}
          text='Print'
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