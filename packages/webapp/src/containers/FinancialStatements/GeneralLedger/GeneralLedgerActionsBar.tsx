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
import { GeneralLedgerSheetExportMenu } from './components';
import { useGeneralLedgerContext } from './GeneralLedgerProvider';
import { withGeneralLedger } from './withGeneralLedger';
import { withGeneralLedgerActions } from './withGeneralLedgerActions';
import type { WithGeneralLedgerProps } from './withGeneralLedger';
import type { WithGeneralLedgerActionsProps } from './withGeneralLedgerActions';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { DashboardActionsBar, FormattedMessage as T, Icon } from '@/components';
import { DialogsName } from '@/constants/dialogs';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';

type GeneralLedgerActionsBarProps = {
  isFilterDrawerOpen: boolean;
} & Pick<WithGeneralLedgerActionsProps, 'toggleGeneralLedgerFilterDrawer'> &
  WithDialogActionsProps;

/**
 * General ledger - Actions bar.
 */
function GeneralLedgerActionsBarInner({
  // #withGeneralLedger
  isFilterDrawerOpen,

  // #withGeneralLedgerActions
  toggleGeneralLedgerFilterDrawer: toggleDisplayFilterDrawer,

  // #withDialogActions
  openDialog,
}: GeneralLedgerActionsBarProps) {
  const { sheetRefresh } = useGeneralLedgerContext();

  // Handle customize button click.
  const handleCustomizeClick = () => {
    toggleDisplayFilterDrawer();
  };

  // Handle re-calculate button click.
  const handleRecalcReport = () => {
    sheetRefresh();
  };

  // Handle the print button click.
  const handlePrintBtnClick = () => {
    openDialog(DialogsName.GeneralLedgerPdfPreview);
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
          onClick={handleCustomizeClick}
          active={isFilterDrawerOpen}
        />
        <NavbarDivider />

        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="print-16" iconSize={16} />}
          text={<T id={'print'} />}
          onClick={handlePrintBtnClick}
        />
        <Popover
          content={<GeneralLedgerSheetExportMenu />}
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

export const GeneralLedgerActionsBar = compose(
  withGeneralLedger(({ generalLedgerFilterDrawer }) => ({
    isFilterDrawerOpen: generalLedgerFilterDrawer,
  })),
  withGeneralLedgerActions,
  withDialogActions,
)(GeneralLedgerActionsBarInner);
