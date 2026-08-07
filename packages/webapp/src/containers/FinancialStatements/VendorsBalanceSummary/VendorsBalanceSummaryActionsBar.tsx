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
import { VendorSummarySheetExportMenu } from './components';
import { useVendorsBalanceSummaryContext } from './VendorsBalanceSummaryProvider';
import { withVendorsBalanceSummary } from './withVendorsBalanceSummary';
import {
  withVendorsBalanceSummaryActions,
  WithVendorsBalanceSummaryActionsProps,
} from './withVendorsBalanceSummaryActions';
import { DashboardActionsBar, Icon, FormattedMessage as T } from '@/components';
import NumberFormatDropdown from '@/components/NumberFormatDropdown';
import { DialogsName } from '@/constants/dialogs';
import {
  withDialogActions,
  WithDialogActionsProps,
} from '@/containers/Dialog/withDialogActions';
import { saveInvoke, compose } from '@/utils';

interface VendorsBalanceSummaryActionsBarOwnProps {
  numberFormat: Record<string, unknown>;
  onNumberFormatSubmit: (values: Record<string, unknown>) => void;
}

type VendorsBalanceSummaryActionsBarProps = {
  isFilterDrawerOpen: boolean;
} & Pick<
  WithVendorsBalanceSummaryActionsProps,
  'toggleVendorSummaryFilterDrawer'
> &
  WithDialogActionsProps &
  VendorsBalanceSummaryActionsBarOwnProps;

/**
 * Vendors balance summary action bar.
 */
function VendorsBalanceSummaryActionsBarInner({
  //#ownProps
  numberFormat,
  onNumberFormatSubmit,

  // #withVendorsBalanceSummary
  isFilterDrawerOpen,

  // #withVendorsBalanceSummaryActions
  toggleVendorSummaryFilterDrawer,

  // #withDialogActions
  openDialog,
}: VendorsBalanceSummaryActionsBarProps) {
  const { isVendorsBalanceLoading, refetch } =
    useVendorsBalanceSummaryContext();

  const handleFilterToggleClick = () => {
    toggleVendorSummaryFilterDrawer(false);
  };

  // handle recalculate report button.
  const handleRecalculateReport = () => {
    refetch();
  };

  // handle number format submit.
  const handleNumberFormatSubmit = (numberFormat: Record<string, unknown>) => {
    saveInvoke(onNumberFormatSubmit, numberFormat);
  };

  // Handle the print button click.
  const handlePrintBtnClick = () => {
    openDialog(DialogsName.VendorBalancePdfPreview);
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
              submitDisabled={isVendorsBalanceLoading}
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
          content={<VendorSummarySheetExportMenu />}
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
export const VendorsBalanceSummaryActionsBar = compose(
  withVendorsBalanceSummaryActions,
  withVendorsBalanceSummary(({ VendorsSummaryFilterDrawer }) => ({
    isFilterDrawerOpen: VendorsSummaryFilterDrawer,
  })),
  withDialogActions,
)(VendorsBalanceSummaryActionsBarInner);
