// @ts-nocheck
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
import classNames from 'classnames';

import { DashboardActionsBar, FormattedMessage as T, Icon } from '@/components';

import withJournalActions from './withJournalActions';
import withJournal from './withJournal';

import { compose } from '@/utils';
import { useJournalSheetContext } from './JournalProvider';

/**
 * Journal sheet - Actions bar.
 */
function JournalActionsBar({
  // #withJournal
  isFilterDrawerOpen,

  // #withJournalActions
  toggleJournalSheetFilter,
}) {
  const { refetchSheet } = useJournalSheetContext();

  // Handle filter toggle click.
  const handleFilterToggleClick = () => {
    toggleJournalSheetFilter();
  };

  // Handle re-calc the report.
  const handleRecalcReport = () => {
    refetchSheet();
  };

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <Button
          className={classNames(Classes.MINIMAL, 'button--gray-highlight')}
          text={<T id={'recalc_report'} />}
          onClick={handleRecalcReport}
          icon={<Icon icon="refresh-16" iconSize={16} />}
        />
        <NavbarDivider />

        <Button
          className={classNames(Classes.MINIMAL, 'button--table-views')}
          icon={<Icon icon="cog-16" iconSize={16} />}
          text={
            isFilterDrawerOpen ? (
              <T id={'hide_customizer'} />
            ) : (
              <T id={'customize_report'} />
            )
          }
          active={isFilterDrawerOpen}
          onClick={handleFilterToggleClick}
        />
        <NavbarDivider />

        <Popover
          interactionKind={PopoverInteractionKind.CLICK}
          position={Position.BOTTOM_LEFT}
        >
          <Button
            className={classNames(Classes.MINIMAL, 'button--filter')}
            text={<T id={'filter'} />}
            icon={<Icon icon="filter-16" iconSize={16} />}
          />
        </Popover>

        <NavbarDivider />

        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="print-16" iconSize={16} />}
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
  withJournal(({ journalSheetDrawerFilter }) => ({
    isFilterDrawerOpen: journalSheetDrawerFilter,
  })),
  withJournalActions,
)(JournalActionsBar);
