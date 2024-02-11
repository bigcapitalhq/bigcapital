// @ts-nocheck
import React from 'react';
import {
  NavbarGroup,
  NavbarDivider,
  Button,
  Classes,
  Popover,
  PopoverInteractionKind,
  Position,
} from '@blueprintjs/core';
import { Icon, FormattedMessage as T, DashboardActionsBar } from '@/components';
import classNames from 'classnames';

import NumberFormatDropdown from '@/components/NumberFormatDropdown';

import { useCashFlowStatementContext } from './CashFlowStatementProvider';
import withCashFlowStatement from './withCashFlowStatement';
import withCashFlowStatementActions from './withCashFlowStatementActions';

import { compose, saveInvoke } from '@/utils';
import { CashflowSheetExportMenu } from './components';
import withDialogActions from '@/containers/Dialog/withDialogActions';
import { DialogsName } from '@/constants/dialogs';

/**
 * Cash flow statement actions bar.
 */
function CashFlowStatementActionsBar({
  //#withCashFlowStatement
  isFilterDrawerOpen,

  //#withCashStatementActions
  toggleCashFlowStatementFilterDrawer,

  // #withDialogActions
  openDialog,

  //#ownProps
  numberFormat,
  onNumberFormatSubmit,
}) {
  const { isCashFlowLoading, refetchCashFlow } = useCashFlowStatementContext();

  // Handle filter toggle click.
  const handleFilterToggleClick = () => {
    toggleCashFlowStatementFilterDrawer();
  };

  // Handle recalculate report button.
  const handleRecalculateReport = () => {
    refetchCashFlow();
  };

  // handle number format form submit.
  const handleNumberFormatSubmit = (values) =>
    saveInvoke(onNumberFormatSubmit, values);

  // Handle print button click.
  const handlePrintBtnClick = () => {
    openDialog(DialogsName.CashflowSheetPdfPreview);
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
              submitDisabled={isCashFlowLoading}
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
          content={<CashflowSheetExportMenu />}
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
  withCashFlowStatement(({ cashFlowStatementDrawerFilter }) => ({
    isFilterDrawerOpen: cashFlowStatementDrawerFilter,
  })),
  withCashFlowStatementActions,
  withDialogActions,
)(CashFlowStatementActionsBar);
