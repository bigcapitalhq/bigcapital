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
import React from 'react';
import { VendorTransactionsExportMenu } from './components';
import { useVendorsTransactionsContext } from './VendorsTransactionsProvider';
import {
  withVendorsTransaction,
  WithVendorsTransactionProps,
} from './withVendorsTransaction';
import {
  withVendorsTransactionsActions,
  WithVendorsTransactionsActionsProps,
} from './withVendorsTransactionsActions';
import { DashboardActionsBar, FormattedMessage as T, Icon } from '@/components';
import NumberFormatDropdown from '@/components/NumberFormatDropdown';
import { DialogsName } from '@/constants/dialogs';
import {
  withDialogActions,
  WithDialogActionsProps,
} from '@/containers/Dialog/withDialogActions';
import { compose, saveInvoke } from '@/utils';

interface VendorsTransactionsActionsBarOwnProps {
  numberFormat: Record<string, unknown>;
  onNumberFormatSubmit: (values: Record<string, unknown>) => void;
}

type VendorsTransactionsActionsBarProps = {
  isFilterDrawerOpen: boolean;
} & Pick<
  WithVendorsTransactionsActionsProps,
  'toggleVendorsTransactionsFilterDrawer'
> &
  WithDialogActionsProps &
  VendorsTransactionsActionsBarOwnProps;

/**
 * vendors transactions actions bar.
 */
function VendorsTransactionsActionsBarInner({
  // #ownProps
  numberFormat,
  onNumberFormatSubmit,

  //#withVendorsTransaction
  isFilterDrawerOpen,

  //#withVendorsTransactionsActions
  toggleVendorsTransactionsFilterDrawer,

  //#withDialogActions
  openDialog,
}: VendorsTransactionsActionsBarProps) {
  const { isVendorsTransactionsLoading, refetch } =
    useVendorsTransactionsContext();

  // Handle filter toggle click.
  const handleFilterToggleClick = () => {
    toggleVendorsTransactionsFilterDrawer(false);
  };

  // Handle recalculate the report button.
  const handleRecalcReport = () => {
    refetch();
  };

  // Handle number format form submit.
  const handleNumberFormatSubmit = (values: Record<string, unknown>) => {
    saveInvoke(onNumberFormatSubmit, values);
  };

  // Handle the print button click.
  const handlePrintBtnClick = () => {
    openDialog(DialogsName.VendorTransactionsPdfPreview);
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
          onClick={handleFilterToggleClick}
          active={isFilterDrawerOpen}
        />
        <NavbarDivider />
        <Popover
          content={
            <NumberFormatDropdown
              numberFormat={numberFormat}
              onSubmit={handleNumberFormatSubmit}
              submitDisabled={isVendorsTransactionsLoading}
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
          content={<VendorTransactionsExportMenu />}
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
export const VendorsTransactionsActionsBar = compose(
  withVendorsTransaction(({ vendorsTransactionsDrawerFilter }) => ({
    isFilterDrawerOpen: vendorsTransactionsDrawerFilter,
  })),
  withVendorsTransactionsActions,
  withDialogActions,
)(VendorsTransactionsActionsBarInner);
