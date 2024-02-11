// @ts-nocheck
import React from 'react';
import {
  NavbarGroup,
  Button,
  Classes,
  NavbarDivider,
  Popover,
  Position,
  PopoverInteractionKind,
} from '@blueprintjs/core';
import { DashboardActionsBar, FormattedMessage as T, Icon } from '@/components';
import classNames from 'classnames';

import NumberFormatDropdown from '@/components/NumberFormatDropdown';

import withProfitLossActions from './withProfitLossActions';
import withProfitLoss from './withProfitLoss';

import { compose, saveInvoke } from '@/utils';
import { useProfitLossSheetContext } from './ProfitLossProvider';
import { ProfitLossSheetExportMenu } from './components';
import withDialogActions from '@/containers/Dialog/withDialogActions';
import { DialogsName } from '@/constants/dialogs';

/**
 * Profit/Loss sheet actions bar.
 */
function ProfitLossActionsBar({
  // #withProfitLoss
  profitLossDrawerFilter,

  // #withProfitLossActions
  toggleProfitLossFilterDrawer: toggleFilterDrawer,

  // #withDialogActions
  openDialog,

  // #ownProps
  numberFormat,
  onNumberFormatSubmit,
}) {
  const { sheetRefetch, isLoading } = useProfitLossSheetContext();

  const handleFilterClick = () => {
    toggleFilterDrawer();
  };

  const handleRecalcReport = () => {
    sheetRefetch();
  };
  // Handle number format submit.
  const handleNumberFormatSubmit = (values) => {
    saveInvoke(onNumberFormatSubmit, values);
  };
  // Handles the print button click.
  const handlePrintBtnClick = () => {
    openDialog(DialogsName.ProfitLossSheetPdfPreview);
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
            profitLossDrawerFilter ? (
              <T id={'hide_customizer'} />
            ) : (
              <T id={'customize_report'} />
            )
          }
          onClick={handleFilterClick}
          active={profitLossDrawerFilter}
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
          content={<ProfitLossSheetExportMenu />}
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
  withProfitLoss(({ profitLossDrawerFilter }) => ({ profitLossDrawerFilter })),
  withProfitLossActions,
  withDialogActions,
)(ProfitLossActionsBar);
