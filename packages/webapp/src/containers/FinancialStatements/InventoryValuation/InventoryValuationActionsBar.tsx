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

import withInventoryValuation from './withInventoryValuation';
import withInventoryValuationActions from './withInventoryValuationActions';
import { useInventoryValuationContext } from './InventoryValuationProvider';

import { compose, saveInvoke } from '@/utils';
import { InventoryValuationExportMenu } from './components';

function InventoryValuationActionsBar({
  // #withInventoryValuation
  isFilterDrawerOpen,

  // #withInventoryValuationActions
  toggleInventoryValuationFilterDrawer,

  // #ownProps
  numberFormat,
  onNumberFormatSubmit,
}) {
  const { refetchSheet, isLoading } = useInventoryValuationContext();

  // Handle filter toggle click.
  const handleFilterToggleClick = () => {
    toggleInventoryValuationFilterDrawer();
  };

  // Handle re-calc button click.
  const handleRecalculateReport = () => {
    refetchSheet();
  };

  // Handle number format submit.
  const handleNumberFormatSubmit = (numberFormat) => {
    saveInvoke(onNumberFormatSubmit, numberFormat);
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
        />
        <Popover
          content={<InventoryValuationExportMenu />}
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

export default compose(
  withInventoryValuation(({ inventoryValuationDrawerFilter }) => ({
    isFilterDrawerOpen: inventoryValuationDrawerFilter,
  })),
  withInventoryValuationActions,
)(InventoryValuationActionsBar);
