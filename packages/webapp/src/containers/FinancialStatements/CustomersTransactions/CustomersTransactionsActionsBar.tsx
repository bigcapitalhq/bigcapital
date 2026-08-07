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
import { CustomersTransactionsExportMenu } from './components';
import { useCustomersTransactionsContext } from './CustomersTransactionsProvider';
import {
  withCustomersTransactions,
  WithCustomersTransactionsProps,
} from './withCustomersTransactions';
import {
  withCustomersTransactionsActions,
  WithCustomersTransactionsActionsProps,
} from './withCustomersTransactionsActions';
import { DashboardActionsBar, FormattedMessage as T, Icon } from '@/components';
import NumberFormatDropdown from '@/components/NumberFormatDropdown';
import { DialogsName } from '@/constants/dialogs';
import {
  withDialogActions,
  WithDialogActionsProps,
} from '@/containers/Dialog/withDialogActions';
import { compose, saveInvoke } from '@/utils';

interface CustomersTransactionsActionsBarOwnProps {
  numberFormat: Record<string, unknown>;
  onNumberFormatSubmit: (values: Record<string, unknown>) => void;
}

type CustomersTransactionsActionsBarProps = {
  isFilterDrawerOpen: boolean;
} & Pick<
  WithCustomersTransactionsActionsProps,
  'toggleCustomersTransactionsFilterDrawer'
> &
  WithDialogActionsProps &
  CustomersTransactionsActionsBarOwnProps;

/**
 * Customers transactions actions bar.
 */
function CustomersTransactionsActionsBarInner({
  // #ownProps
  numberFormat,
  onNumberFormatSubmit,

  //#withCustomersTransactions
  isFilterDrawerOpen,

  //#withCustomersTransactionsActions
  toggleCustomersTransactionsFilterDrawer,

  // #withDialogActions
  openDialog,
}: CustomersTransactionsActionsBarProps) {
  const { isCustomersTransactionsLoading, CustomersTransactionsRefetch } =
    useCustomersTransactionsContext();

  // Handle filter toggle click.
  const handleFilterToggleClick = () => {
    toggleCustomersTransactionsFilterDrawer();
  };

  // Handle recalculate the report button.
  const handleRecalcReport = () => {
    CustomersTransactionsRefetch();
  };

  // Handle number format form submit.
  const handleNumberFormatSubmit = (values: Record<string, unknown>) => {
    saveInvoke(onNumberFormatSubmit, values);
  };

  // Handle print button click.
  const handlePrintBtnClick = () => {
    openDialog(DialogsName.CustomerTransactionsPdfPreview);
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
              submitDisabled={isCustomersTransactionsLoading}
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
          content={<CustomersTransactionsExportMenu />}
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

export const CustomersTransactionsActionsBar = compose(
  withCustomersTransactions(({ customersTransactionsDrawerFilter }) => ({
    isFilterDrawerOpen: customersTransactionsDrawerFilter,
  })),
  withCustomersTransactionsActions,
  withDialogActions,
)(CustomersTransactionsActionsBarInner);
