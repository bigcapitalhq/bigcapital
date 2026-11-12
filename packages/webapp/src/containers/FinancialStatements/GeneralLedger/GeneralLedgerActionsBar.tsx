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
import * as FF from 'fp-ts/function';
import React from 'react';
import { GeneralLedgerSheetExportMenu } from './components';
import { useGeneralLedgerContext } from './GeneralLedgerProvider';
import { withGeneralLedger } from './withGeneralLedger';
import { withGeneralLedgerActions } from './withGeneralLedgerActions';
import type { WithGeneralLedgerActionsProps } from './withGeneralLedgerActions';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { DashboardActionsBar, FormattedMessage as T, Icon } from '@/components';
import NumberFormatDropdown from '@/components/NumberFormatDropdown';
import { DialogsName } from '@/constants/dialogs';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { saveInvoke } from '@/utils';

interface GeneralLedgerActionsBarOwnProps {
  numberFormat: Record<string, unknown>;
  onNumberFormatSubmit: (values: Record<string, unknown>) => void;
}

type GeneralLedgerActionsBarProps = {
  isFilterDrawerOpen: boolean;
} & Pick<WithGeneralLedgerActionsProps, 'toggleGeneralLedgerFilterDrawer'> &
  WithDialogActionsProps &
  GeneralLedgerActionsBarOwnProps;

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

  // #ownProps
  numberFormat,
  onNumberFormatSubmit,
}: GeneralLedgerActionsBarProps) {
  const { sheetRefresh, isLoading } = useGeneralLedgerContext();

  // Handle customize button click.
  const handleCustomizeClick = () => {
    toggleDisplayFilterDrawer();
  };

  // Handle re-calculate button click.
  const handleRecalcReport = () => {
    sheetRefresh();
  };

  // Handle number format form submit.
  const handleNumberFormatSubmit = (values: Record<string, unknown>) => {
    saveInvoke(onNumberFormatSubmit, values);
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

        <Popover
          content={
            <NumberFormatDropdown
              numberFormat={numberFormat}
              onSubmit={handleNumberFormatSubmit}
              submitDisabled={isLoading}
            />
          }
          minimal={true}
          interactionKind={PopoverInteractionKind.CLICK}
          position={Position.BOTTOM_LEFT}
        >
          <Button
            className={classNames(Classes.MINIMAL, 'button--filter')}
            text={<T id={'format'} />}
            icon={<Icon icon="numbers" width={23} height={16} />}
          />
        </Popover>
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

export const GeneralLedgerActionsBar = FF.pipe(
  GeneralLedgerActionsBarInner,
  withDialogActions,
  withGeneralLedgerActions,
  withGeneralLedger(({ generalLedgerFilterDrawer }) => ({
    isFilterDrawerOpen: generalLedgerFilterDrawer,
  })),
);
