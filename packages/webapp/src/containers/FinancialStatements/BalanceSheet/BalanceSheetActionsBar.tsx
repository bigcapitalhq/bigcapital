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
import { useBalanceSheetContext } from './BalanceSheetProvider';
import { BalanceSheetExportMenu } from './components';
import { withBalanceSheet, WithBalanceSheetProps } from './withBalanceSheet';
import {
  withBalanceSheetActions,
  WithBalanceSheetActionsProps,
} from './withBalanceSheetActions';
import { DashboardActionsBar, FormattedMessage as T, Icon } from '@/components';
import NumberFormatDropdown from '@/components/NumberFormatDropdown';
import { DialogsName } from '@/constants/dialogs';
import {
  withDialogActions,
  WithDialogActionsProps,
} from '@/containers/Dialog/withDialogActions';
import { compose, saveInvoke } from '@/utils';

interface BalanceSheetActionsBarOwnProps {
  numberFormat: Record<string, unknown>;
  onNumberFormatSubmit: (values: Record<string, unknown>) => void;
}

type BalanceSheetActionsBarProps = WithBalanceSheetProps &
  Pick<WithBalanceSheetActionsProps, 'toggleBalanceSheetFilterDrawer'> &
  WithDialogActionsProps &
  BalanceSheetActionsBarOwnProps;

/**
 * Balance sheet - actions bar.
 */
function BalanceSheetActionsBarInner({
  // #withBalanceSheet
  balanceSheetDrawerFilter,

  // #withBalanceSheetActions
  toggleBalanceSheetFilterDrawer: toggleFilterDrawer,

  // #withDialogsActions
  openDialog,

  // #ownProps
  numberFormat,
  onNumberFormatSubmit,
}: BalanceSheetActionsBarProps) {
  const { isLoading, refetchBalanceSheet } = useBalanceSheetContext();

  // Handle filter toggle click.
  const handleFilterToggleClick = () => {
    toggleFilterDrawer();
  };

  // Handle recalculate the report button.
  const handleRecalcReport = () => {
    refetchBalanceSheet();
  };

  // Handle number format form submit.
  const handleNumberFormatSubmit = (values: Record<string, unknown>) => {
    saveInvoke(onNumberFormatSubmit, values);
  };

  // Handles the pdf print button click.
  const handlePdfPrintBtnSubmit = () => {
    openDialog(DialogsName.BalanceSheetPdfPreview);
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
            !balanceSheetDrawerFilter ? (
              <T id={'customize_report'} />
            ) : (
              <T id={'hide_customizer'} />
            )
          }
          onClick={handleFilterToggleClick}
          active={balanceSheetDrawerFilter}
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
          onClick={handlePdfPrintBtnSubmit}
          icon={<Icon icon="print-16" iconSize={16} />}
          text={<T id={'print'} />}
        />
        <Popover
          content={<BalanceSheetExportMenu />}
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

export const BalanceSheetActionsBar = compose(
  withBalanceSheet(({ balanceSheetDrawerFilter }) => ({
    balanceSheetDrawerFilter,
  })),
  withBalanceSheetActions,
  withDialogActions,
)(BalanceSheetActionsBarInner);
