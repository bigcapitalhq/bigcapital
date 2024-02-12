// @ts-nocheck
import React from 'react';
import {
  NavbarGroup,
  Button,
  Classes,
  NavbarDivider,
  Popover,
  PopoverInteractionKind,
  Position,
} from '@blueprintjs/core';
import { DashboardActionsBar, Icon, FormattedMessage as T } from '@/components';
import classNames from 'classnames';

import NumberFormatDropdown from '@/components/NumberFormatDropdown';
import { InventoryItemDetailsExportMenu } from './components';

import { useInventoryItemDetailsContext } from './InventoryItemDetailsProvider';
import withInventoryItemDetails from './withInventoryItemDetails';
import withInventoryItemDetailsActions from './withInventoryItemDetailsActions';

import { compose, saveInvoke } from '@/utils';
import { DialogsName } from '@/constants/dialogs';
import withDialogActions from '@/containers/Dialog/withDialogActions';

/**
 * Inventory item details actions bar.
 */
function InventoryItemDetailsActionsBar({
  // #ownProps
  numberFormat,
  onNumberFormatSubmit,

  //#withInventoryItemDetails
  isFilterDrawerOpen,

  // #withDialogActions
  openDialog,

  //#withInventoryItemDetailsActions
  toggleInventoryItemDetailsFilterDrawer: toggleFilterDrawer,
}) {
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
  const handleNumberFormatSubmit = (values) => {
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

        <Popover
          // content={}
          interactionKind={PopoverInteractionKind.CLICK}
          position={Position.BOTTOM_LEFT}
        >
          <Button
            className={classNames(Classes.MINIMAL, 'button--filter')}
            text={<T id={'filter'} />}
            icon={<Icon icon="filter-16" iconSize={16} />}
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

export default compose(
  withInventoryItemDetails(({ inventoryItemDetailDrawerFilter }) => ({
    isFilterDrawerOpen: inventoryItemDetailDrawerFilter,
  })),
  withInventoryItemDetailsActions,
  withDialogActions,
)(InventoryItemDetailsActionsBar);
