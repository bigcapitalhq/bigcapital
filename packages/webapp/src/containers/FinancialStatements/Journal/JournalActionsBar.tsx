import {
  NavbarGroup,
  Button,
  Classes,
  NavbarDivider,
  Popover,
  PopoverInteractionKind,
} from '@blueprintjs/core';
import classNames from 'classnames';
import React from 'react';
import { JournalSheetExportMenu } from './components';
import { useJournalSheetContext } from './JournalProvider';
import { withJournal } from './withJournal';
import { withJournalActions } from './withJournalActions';
import type { WithJournalActionsProps } from './withJournalActions';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { DashboardActionsBar, FormattedMessage as T, Icon } from '@/components';
import { DialogsName } from '@/constants/dialogs';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';

type JournalActionsBarProps = {
  isFilterDrawerOpen: boolean;
} & Pick<WithJournalActionsProps, 'toggleJournalSheetFilter'> &
  WithDialogActionsProps;

/**
 * Journal sheeet - Actions bar.
 */
function JournalActionsBarInner({
  // #withJournal
  isFilterDrawerOpen,

  // #withJournalActions
  toggleJournalSheetFilter,

  // #withDialogActions
  openDialog,
}: JournalActionsBarProps) {
  const { refetchSheet } = useJournalSheetContext();

  // Handle filter toggle click.
  const handleFilterToggleClick = () => {
    toggleJournalSheetFilter();
  };

  // Handle re-calc the report.
  const handleRecalcReport = () => {
    refetchSheet();
  };

  // Handle the print button click.
  const handlePrintBtnClick = () => {
    openDialog(DialogsName.JournalPdfPreview);
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

        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="print-16" iconSize={16} />}
          text={<T id={'print'} />}
          onClick={handlePrintBtnClick}
        />
        <Popover
          content={<JournalSheetExportMenu />}
          interactionKind={PopoverInteractionKind.CLICK}
          placement="bottom-start"
          minimal
        >
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="file-export-16" iconSize={16} />}
            text={<T id={'export'} />}
          />
        </Popover>
      </NavbarGroup>
    </DashboardActionsBar>
  );
}

export const JournalActionsBar = compose(
  withJournal(({ journalSheetDrawerFilter }) => ({
    isFilterDrawerOpen: journalSheetDrawerFilter,
  })),
  withJournalActions,
  withDialogActions,
)(JournalActionsBarInner);
