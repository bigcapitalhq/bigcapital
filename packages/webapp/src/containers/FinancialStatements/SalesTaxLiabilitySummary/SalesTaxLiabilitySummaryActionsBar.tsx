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

import { compose, saveInvoke } from '@/utils';
import { useSalesTaxLiabilitySummaryContext } from './SalesTaxLiabilitySummaryBoot';
import withSalesTaxLiabilitySummary from './withSalesTaxLiabilitySummary';
import withSalesTaxLiabilitySummaryActions from './withSalesTaxLiabilitySummaryActions';
import { SalesTaxLiabilityExportMenu } from './components';
import { DialogsName } from '@/constants/dialogs';
import withDialogActions from '@/containers/Dialog/withDialogActions';

/**
 * Sales tax liability summary - actions bar.
 */
function SalesTaxLiabilitySummaryActionsBar({
  // #withSalesTaxLiabilitySummary
  salesTaxLiabilitySummaryFilter,

  // #withSalesTaxLiabilitySummaryActions
  toggleSalesTaxLiabilitySummaryFilterDrawer: toggleFilterDrawer,

  // #withDialogActions
  openDialog,

  // #ownProps
  numberFormat,
  onNumberFormatSubmit,
}) {
  const { isLoading, refetchSalesTaxLiabilitySummary } =
    useSalesTaxLiabilitySummaryContext();

  // Handle filter toggle click.
  const handleFilterToggleClick = () => {
    toggleFilterDrawer();
  };
  // Handle re-calculate the report button.
  const handleRecalcReport = () => {
    refetchSalesTaxLiabilitySummary();
  };
  // Handle number format form submit.
  const handleNumberFormatSubmit = (values) => {
    saveInvoke(onNumberFormatSubmit, values);
  };
  // Handle the print button click.
  const handlePrintBtnClick = () => {
    openDialog(DialogsName.SalesTaxLiabilitySummaryPdfPreview)    
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
            !salesTaxLiabilitySummaryFilter ? (
              <T id={'customize_report'} />
            ) : (
              <T id={'hide_customizer'} />
            )
          }
          onClick={handleFilterToggleClick}
          active={salesTaxLiabilitySummaryFilter}
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

        <NavbarDivider />

        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="print-16" iconSize={16} />}
          text={<T id={'print'} />}
          onClick={handlePrintBtnClick}
        />
        <Popover
          content={<SalesTaxLiabilityExportMenu />}
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
  withSalesTaxLiabilitySummary(({ salesTaxLiabilitySummaryFilter }) => ({
    salesTaxLiabilitySummaryFilter,
  })),
  withSalesTaxLiabilitySummaryActions,
  withDialogActions
)(SalesTaxLiabilitySummaryActionsBar);
