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
import { useARAgingSummaryContext } from './ARAgingSummaryProvider';
import { ARAgingSummaryExportMenu } from './components';
import { withARAgingSummary } from './withARAgingSummary';
import {
  withARAgingSummaryActions,
  WithARAgingSummaryActionsProps,
} from './withARAgingSummaryActions';
import { DashboardActionsBar, FormattedMessage as T, Icon } from '@/components';
import NumberFormatDropdown from '@/components/NumberFormatDropdown';
import { DialogsName } from '@/constants/dialogs';
import {
  withDialogActions,
  WithDialogActionsProps,
} from '@/containers/Dialog/withDialogActions';
import { compose, safeInvoke } from '@/utils';

interface ARAgingSummaryActionsBarOwnProps {
  numberFormat: Record<string, unknown>;
  onNumberFormatSubmit: (numberFormat: Record<string, unknown>) => void;
}

type ARAgingSummaryActionsBarProps = {
  isFilterDrawerOpen: boolean;
} & Pick<WithARAgingSummaryActionsProps, 'toggleARAgingSummaryFilterDrawer'> &
  WithDialogActionsProps &
  ARAgingSummaryActionsBarOwnProps;

function ARAgingSummaryActionsBarInner({
  isFilterDrawerOpen,
  toggleARAgingSummaryFilterDrawer: toggleDisplayFilterDrawer,
  openDialog,
  numberFormat,
  onNumberFormatSubmit,
}: ARAgingSummaryActionsBarProps) {
  const { isARAgingFetching, refetch } = useARAgingSummaryContext();

  const handleFilterToggleClick = () => {
    toggleDisplayFilterDrawer();
  };
  const handleRecalcReport = () => {
    refetch();
  };
  const handleNumberFormatSubmit = (numberFormat: Record<string, unknown>) => {
    safeInvoke(onNumberFormatSubmit, numberFormat);
  };
  const handlePrintBtnClick = () => {
    openDialog(DialogsName.ARAgingSummaryPdfPreview);
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
              <T id="hide_customizer" />
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
              submitDisabled={isARAgingFetching}
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
          content={<ARAgingSummaryExportMenu />}
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

export const ARAgingSummaryActionsBar = compose(
  withARAgingSummaryActions,
  withARAgingSummary(({ ARAgingSummaryFilterDrawer }) => ({
    isFilterDrawerOpen: ARAgingSummaryFilterDrawer,
  })),
  withDialogActions,
)(ARAgingSummaryActionsBarInner);
