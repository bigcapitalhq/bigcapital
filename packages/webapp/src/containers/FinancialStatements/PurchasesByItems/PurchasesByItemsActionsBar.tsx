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
import { DashboardActionsBar, FormattedMessage as T, Icon } from '@/components';

import NumberFormatDropdown from '@/components/NumberFormatDropdown';

import withPurchasesByItems from './withPurchasesByItems';
import withPurchasesByItemsActions from './withPurchasesByItemsActions';
import withDialogActions from '@/containers/Dialog/withDialogActions';
import { compose, saveInvoke } from '@/utils';
import { usePurchaseByItemsContext } from './PurchasesByItemsProvider';
import { PurchasesByItemsExportMenu } from './components';
import { DialogsName } from '@/constants/dialogs';

function PurchasesByItemsActionsBar({
  // #withPurchasesByItems
  purchasesByItemsDrawerFilter,

  // #withPurchasesByItemsActions
  togglePurchasesByItemsFilterDrawer,

  // #withDialogActions
  openDialog,

  // #ownProps
  numberFormat,
  onNumberFormatSubmit,
}) {
  const { refetchSheet, isLoading } = usePurchaseByItemsContext();

  // Handle re-calc button click.
  const handleRecalculateReport = () => {
    refetchSheet();
  };

  // Handle filter toggle click.
  const handleFilterToggleClick = () => {
    togglePurchasesByItemsFilterDrawer();
  };

  // Handle number format submit.
  const handleNumberFormatSubmit = (values) => {
    saveInvoke(onNumberFormatSubmit, values);
  };

  // Handle print button click.
  const handlePrintBtnClick = () => {
    openDialog(DialogsName.PurchasesByItemsPdfPreview);
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
            purchasesByItemsDrawerFilter ? (
              <T id={'hide_customizer'} />
            ) : (
              <T id={'customize_report'} />
            )
          }
          active={purchasesByItemsDrawerFilter}
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
          content={<PurchasesByItemsExportMenu />}
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
  withPurchasesByItems(({ purchasesByItemsDrawerFilter }) => ({
    purchasesByItemsDrawerFilter,
  })),
  withPurchasesByItemsActions,
  withDialogActions,
)(PurchasesByItemsActionsBar);
