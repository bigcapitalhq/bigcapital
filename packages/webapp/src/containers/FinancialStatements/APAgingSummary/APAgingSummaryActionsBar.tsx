import {
  NavbarDivider,
  NavbarGroup,
  Classes,
  Button,
  Popover,
  PopoverInteractionKind,
  Position,
} from '@blueprintjs/core';
import classNames from 'classnames';
import React from 'react';
import { useAPAgingSummaryContext } from './APAgingSummaryProvider';
import { APAgingSummaryExportMenu } from './components';
import {
  withAPAgingSummary,
  WithAPAgingSummaryProps,
} from './withAPAgingSummary';
import {
  withAPAgingSummaryActions,
  WithAPAgingSummaryActionsProps,
} from './withAPAgingSummaryActions';
import { DashboardActionsBar, FormattedMessage as T, Icon } from '@/components';
import NumberFormatDropdown from '@/components/NumberFormatDropdown';
import { DialogsName } from '@/constants/dialogs';
import {
  withDialogActions,
  WithDialogActionsProps,
} from '@/containers/Dialog/withDialogActions';
import { saveInvoke, compose } from '@/utils';

interface APAgingSummaryActionsBarOwnProps {
  numberFormat: Record<string, unknown>;
  onNumberFormatSubmit: (numberFormat: Record<string, unknown>) => void;
}

type APAgingSummaryActionsBarProps = {
  isFilterDrawerOpen: boolean;
} & Pick<WithAPAgingSummaryActionsProps, 'toggleAPAgingSummaryFilterDrawer'> &
  WithDialogActionsProps &
  APAgingSummaryActionsBarOwnProps;

function APAgingSummaryActionsBarInner({
  isFilterDrawerOpen,
  toggleAPAgingSummaryFilterDrawer: toggleFilterDrawerDisplay,
  openDialog,
  numberFormat,
  onNumberFormatSubmit,
}: APAgingSummaryActionsBarProps) {
  const { isAPAgingFetching, refetch } = useAPAgingSummaryContext();

  const handleFilterToggleClick = () => {
    toggleFilterDrawerDisplay();
  };

  const handleRecalculateReport = () => {
    refetch();
  };

  const handleNumberFormatSubmit = (numberFormat: Record<string, unknown>) => {
    saveInvoke(onNumberFormatSubmit, numberFormat);
  };

  const handlePrintBtnClick = () => {
    openDialog(DialogsName.APAgingSummaryPdfPreview);
  };

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <Button
          className={classNames(Classes.MINIMAL, 'button--gray-highlight')}
          text={<T id={'recalc_report'} />}
          onClick={handleRecalculateReport}
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
          onClick={handleFilterToggleClick}
          active={isFilterDrawerOpen}
        />
        <NavbarDivider />
        <Popover
          content={
            <NumberFormatDropdown
              numberFormat={numberFormat}
              onSubmit={handleNumberFormatSubmit}
              submitDisabled={isAPAgingFetching}
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
          content={<APAgingSummaryExportMenu />}
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

export const APAgingSummaryActionsBar = compose(
  withAPAgingSummaryActions,
  withAPAgingSummary(({ APAgingSummaryFilterDrawer }) => ({
    isFilterDrawerOpen: APAgingSummaryFilterDrawer,
  })),
  withDialogActions,
)(APAgingSummaryActionsBarInner);
