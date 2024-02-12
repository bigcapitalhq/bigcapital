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
import classNames from 'classnames';
import { DashboardActionsBar, Icon, FormattedMessage as T } from '@/components';

import NumberFormatDropdown from '@/components/NumberFormatDropdown';

import withSalesByItems from './withSalesByItems';
import withSalesByItemsActions from './withSalesByItemsActions';

import { compose, saveInvoke } from '@/utils';
import { useSalesByItemsContext } from './SalesByItemProvider';
import { SalesByItemsSheetExportMenu } from './components';
import withDialogActions from '@/containers/Dialog/withDialogActions';
import { DialogsName } from '@/constants/dialogs';

function SalesByItemsActionsBar({
  // #withSalesByItems
  salesByItemsDrawerFilter,

  // #withSalesByItemsActions
  toggleSalesByItemsFilterDrawer,

  // #withDialogActions
  openDialog,

  // #ownProps
  numberFormat,
  onNumberFormatSubmit,
}) {
  const { refetchSheet, isLoading } = useSalesByItemsContext();

  // Handle filter toggle click.
  const handleFilterToggleClick = () => {
    toggleSalesByItemsFilterDrawer();
  };
  // Handle re-calc button click.
  const handleRecalculateReport = () => {
    refetchSheet();
  };

  // Handle number format submit.
  const handleNumberFormatSubmit = (values) => {
    saveInvoke(onNumberFormatSubmit, values);
  };

  // Handle the print button click.
  const handlePrintBtnClick = () => {
    openDialog(DialogsName.SalesByItemsPdfPreview);
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
            salesByItemsDrawerFilter ? (
              <T id={'hide_customizer'} />
            ) : (
              <T id={'customize_report'} />
            )
          }
          active={salesByItemsDrawerFilter}
          onClick={handleFilterToggleClick}
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

        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="print-16" iconSize={16} />}
          text={<T id={'print'} />}
          onClick={handlePrintBtnClick}
        />
        <Popover
          content={<SalesByItemsSheetExportMenu />}
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
  withSalesByItems(({ salesByItemsDrawerFilter }) => ({
    salesByItemsDrawerFilter,
  })),
  withSalesByItemsActions,
  withDialogActions,
)(SalesByItemsActionsBar);
