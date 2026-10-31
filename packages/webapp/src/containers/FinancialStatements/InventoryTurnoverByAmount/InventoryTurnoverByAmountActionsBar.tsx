import {
  Button,
  Classes,
  NavbarDivider,
  NavbarGroup,
  Popover,
  PopoverInteractionKind,
  Position,
} from '@blueprintjs/core';
import classNames from 'classnames';
import * as FF from 'fp-ts/function';
import React from 'react';
import { InventoryTurnoverByAmountExportMenu } from './components';
import { useInventoryTurnoverByAmountContext } from './InventoryTurnoverByAmountProvider';
import { withInventoryTurnoverByAmount } from './withInventoryTurnoverByAmount';
import {
  withInventoryTurnoverByAmountActions,
  WithInventoryTurnoverByAmountActionsProps,
} from './withInventoryTurnoverByAmountActions';
import { DashboardActionsBar, FormattedMessage as T, Icon } from '@/components';
import NumberFormatDropdown from '@/components/NumberFormatDropdown';
import { DialogsName } from '@/constants/dialogs';
import {
  withDialogActions,
  WithDialogActionsProps,
} from '@/containers/Dialog/withDialogActions';
import { saveInvoke } from '@/utils';

interface InventoryTurnoverByAmountActionsBarOwnProps {
  numberFormat: Record<string, unknown>;
  onNumberFormatSubmit: (values: Record<string, unknown>) => void;
}

type InventoryTurnoverByAmountActionsBarProps = {
  isFilterDrawerOpen: boolean;
} & Pick<
  WithInventoryTurnoverByAmountActionsProps,
  'toggleInventoryTurnoverByAmountFilterDrawer'
> &
  WithDialogActionsProps &
  InventoryTurnoverByAmountActionsBarOwnProps;

/**
 * Inventory turnover by amount actions bar.
 */
function InventoryTurnoverByAmountActionsBarInner({
  // #ownProps
  numberFormat,
  onNumberFormatSubmit,

  // #withInventoryTurnoverByAmount
  isFilterDrawerOpen,

  // #withInventoryTurnoverByAmountActions
  toggleInventoryTurnoverByAmountFilterDrawer: toggleFilterDrawer,

  // #withDialogActions
  openDialog,
}: InventoryTurnoverByAmountActionsBarProps) {
  const { refetchSheet, isLoading } = useInventoryTurnoverByAmountContext();

  const handleFilterToggleClick = () => {
    toggleFilterDrawer();
  };

  const handleRecalculateReport = () => {
    refetchSheet();
  };

  const handleNumberFormatSubmit = (values: Record<string, unknown>) => {
    saveInvoke(onNumberFormatSubmit, values);
  };

  const handlePrintBtnClick = () => {
    openDialog(DialogsName.InventoryTurnoverByAmountPdfPreview);
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
              submitDisabled={isLoading}
            />
          }
          interactionKind={PopoverInteractionKind.CLICK}
          position={Position.BOTTOM_LEFT}
          minimal
        >
          <Button
            className={classNames(Classes.MINIMAL, 'button--filter')}
            text={<T id={'format'} />}
            icon={<Icon icon="numbers" width={23} height={16} />}
          />
        </Popover>

        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="print-16" iconSize={16} />}
          text={<T id={'print'} />}
          onClick={handlePrintBtnClick}
        />
        <Popover
          content={<InventoryTurnoverByAmountExportMenu />}
          interactionKind={PopoverInteractionKind.CLICK}
          position={Position.BOTTOM_LEFT}
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

export const InventoryTurnoverByAmountActionsBar = FF.pipe(
  InventoryTurnoverByAmountActionsBarInner,
  withDialogActions,
  withInventoryTurnoverByAmountActions,
  withInventoryTurnoverByAmount(
    ({ inventoryTurnoverByAmountDrawerFilter }) => ({
      isFilterDrawerOpen: inventoryTurnoverByAmountDrawerFilter,
    }),
  ),
);
