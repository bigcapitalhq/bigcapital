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
import { CustomerBalanceSummaryExportMenu } from './components';
import { useCustomersBalanceSummaryContext } from './CustomersBalanceSummaryProvider';
import { withCustomersBalanceSummary } from './withCustomersBalanceSummary';
import {
  withCustomersBalanceSummaryActions,
  WithCustomersBalanceSummaryActionsProps,
} from './withCustomersBalanceSummaryActions';
import { Icon, FormattedMessage as T, DashboardActionsBar } from '@/components';
import NumberFormatDropdown from '@/components/NumberFormatDropdown';
import { DialogsName } from '@/constants/dialogs';
import {
  withDialogActions,
  WithDialogActionsProps,
} from '@/containers/Dialog/withDialogActions';
import { compose, saveInvoke } from '@/utils';

interface CustomersBalanceSummaryActionsBarOwnProps {
  numberFormat: Record<string, unknown>;
  onNumberFormatSubmit: (values: Record<string, unknown>) => void;
}

type CustomersBalanceSummaryActionsBarProps = {
  isFilterDrawerOpen: boolean;
} & Pick<
  WithCustomersBalanceSummaryActionsProps,
  'toggleCustomerBalanceFilterDrawer'
> &
  WithDialogActionsProps &
  CustomersBalanceSummaryActionsBarOwnProps;

function CustomersBalanceSummaryActionsBarInner({
  numberFormat,
  onNumberFormatSubmit,
  isFilterDrawerOpen,
  toggleCustomerBalanceFilterDrawer,
  openDialog,
}: CustomersBalanceSummaryActionsBarProps) {
  const { refetch, isCustomersBalanceLoading } =
    useCustomersBalanceSummaryContext();

  const handleFilterToggleClick = () => {
    toggleCustomerBalanceFilterDrawer();
  };

  const handleRecalcReport = () => {
    refetch();
  };

  const handleNumberFormatSubmit = (values: Record<string, unknown>) => {
    saveInvoke(onNumberFormatSubmit, values);
  };

  const handlePrintBtnClick = () => {
    openDialog(DialogsName.CustomerBalanceSummaryPdfPreview);
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
              submitDisabled={isCustomersBalanceLoading}
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
          content={<CustomerBalanceSummaryExportMenu />}
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

export const CustomersBalanceSummaryActionsBar = compose(
  withCustomersBalanceSummary(({ customersBalanceDrawerFilter }) => ({
    isFilterDrawerOpen: customersBalanceDrawerFilter,
  })),
  withCustomersBalanceSummaryActions,
  withDialogActions,
)(CustomersBalanceSummaryActionsBarInner);
