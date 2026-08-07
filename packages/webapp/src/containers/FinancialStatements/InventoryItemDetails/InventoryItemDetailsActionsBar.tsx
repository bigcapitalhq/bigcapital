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
import { InventoryItemDetailsExportMenu } from './components';
import { useInventoryItemDetailsContext } from './InventoryItemDetailsProvider';
import {
  withInventoryItemDetails,
  WithInventoryItemDetailsProps,
} from './withInventoryItemDetails';
import {
  withInventoryItemDetailsActions,
  WithInventoryItemDetailsActionsProps,
} from './withInventoryItemDetailsActions';
import { DashboardActionsBar, Icon, FormattedMessage as T } from '@/components';
import NumberFormatDropdown from '@/components/NumberFormatDropdown';
import { DialogsName } from '@/constants/dialogs';
import {
  withDialogActions,
  WithDialogActionsProps,
} from '@/containers/Dialog/withDialogActions';
import { compose, saveInvoke } from '@/utils';

interface InventoryItemDetailsActionsBarOwnProps {
  numberFormat: Record<string, unknown>;
  onNumberFormatSubmit: (values: Record<string, unknown>) => void;
}

type InventoryItemDetailsActionsBarProps = {
  isFilterDrawerOpen: boolean;
} & Pick<
  WithInventoryItemDetailsActionsProps,
  'toggleInventoryItemDetailsFilterDrawer'
> &
  WithDialogActionsProps &
  InventoryItemDetailsActionsBarOwnProps;

/**
 * Inventory item details actions bar.
 */
function InventoryItemDetailsActionsBarInner({
  // #ownProps
  numberFormat,
  onNumberFormatSubmit,

  //#withInventoryItemDetails
  isFilterDrawerOpen,

  // #withDialogActions
  openDialog,

  //#withInventoryItemDetailsActions
  toggleInventoryItemDetailsFilterDrawer: toggleFilterDrawer,
}: InventoryItemDetailsActionsBarProps) {
  const { isInventoryItemDetailsLoading, inventoryItemDetailsRefetch } =
    useInventoryItemDetailsContext();

  // Handle filter toggle click.
  const handleFilterToggleClick = () => {
    toggleFilterDrawer();
  };
  //Handle recalculate the report button.
  const handleRecalcReport = () => {
    inventoryItemDetailsRefetch();
  };
  // Handle number format form submit.
  const handleNumberFormatSubmit = (values: Record<string, unknown>) => {
    saveInvoke(onNumberFormatSubmit, values);
  };
  // Handle print button click.
  const handlePrintBtnClick = () => {
    openDialog(DialogsName.InventoryItemDetailsPdfPreview);
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
              submitDisabled={isInventoryItemDetailsLoading}
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
          content={<InventoryItemDetailsExportMenu />}
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

export const InventoryItemDetailsActionsBar = compose(
  withInventoryItemDetails(({ inventoryItemDetailDrawerFilter }) => ({
    isFilterDrawerOpen: inventoryItemDetailDrawerFilter,
  })),
  withInventoryItemDetailsActions,
  withDialogActions,
)(InventoryItemDetailsActionsBarInner);
