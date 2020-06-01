import React from 'react';
import {
  NavbarGroup,
  Button,
  Classes,
  NavbarDivider,
  Popover,
  PopoverInteractionKind,
  Position,
} from '@blueprintjs/core';
import { FormattedMessage as T } from 'react-intl';
import Icon from 'components/Icon';
import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar';
import FilterDropdown from 'components/FilterDropdown';
import classNames from 'classnames';

import { If } from 'components';

import withJournalActions from './withJournalActions';
import withJournal from './withJournal';

import { compose } from 'utils';

function JournalActionsBar({
  // #withJournal
  journalSheetFilter,

  // #withJournalActions
  toggleJournalSheetFilter,
}) {
  const filterDropdown = FilterDropdown({
    fields: [],
    onFilterChange: (filterConditions) => {},
  });

  const handleFilterToggleClick = () => {
    toggleJournalSheetFilter();
  };

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <Button
          className={classNames(Classes.MINIMAL, 'button--table-views')}
          icon={<Icon icon="cog-16" iconSize={16} />}
          text={<T id={'customize_report'} />}
        />
        <NavbarDivider />

        <If condition={journalSheetFilter}>
          <Button
            className={Classes.MINIMAL}
            text={<T id={'hide_filter'} />}
            icon={<Icon icon="arrow-to-top" />}
            onClick={handleFilterToggleClick}
          />
        </If>

        <If condition={!journalSheetFilter}>
          <Button
            className={Classes.MINIMAL}
            text={<T id={'show_filter'} />}
            icon={<Icon icon="arrow-to-bottom" />}
            onClick={handleFilterToggleClick}
          />
        </If>
        <NavbarDivider />

        <Popover
          content={filterDropdown}
          interactionKind={PopoverInteractionKind.CLICK}
          position={Position.BOTTOM_LEFT}
        >
          <Button
            className={classNames(Classes.MINIMAL, 'button--filter')}
            text={<T id={'filter'} />}
            icon={<Icon icon="filter-16" iconSize={16} />}
          />
        </Popover>

        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon='print-16' iconSize={16} />}
          text={<T id={'print'} />}
        />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="file-export-16" iconSize={16} />}
          text={<T id={'export'} />}
        />
      </NavbarGroup>
    </DashboardActionsBar>
  );
}

export default compose(
  withJournal(({ journalSheetFilter }) => ({ journalSheetFilter })),
  withJournalActions,
)(JournalActionsBar);
