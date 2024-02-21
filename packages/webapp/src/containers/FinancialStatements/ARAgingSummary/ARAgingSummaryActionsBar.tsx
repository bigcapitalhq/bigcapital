// @ts-nocheck
import React from 'react';
import {
  NavbarDivider,
  NavbarGroup,
  Classes,
  Button,
  Popover,
  PopoverInteractionKind,
  Position,
} from '@blueprintjs/core';
import { DashboardActionsBar, FormattedMessage as T, Icon } from '@/components';
import classNames from 'classnames';

import NumberFormatDropdown from '@/components/NumberFormatDropdown';

import { useARAgingSummaryContext } from './ARAgingSummaryProvider';
import withARAgingSummaryActions from './withARAgingSummaryActions';
import withARAgingSummary from './withARAgingSummary';
import withDialogActions from '@/containers/Dialog/withDialogActions';

import { compose, safeInvoke } from '@/utils';
import { ARAgingSummaryExportMenu } from './components';
import { DialogsName } from '@/constants/dialogs';

/**
 * A/R Aging summary sheet - Actions bar.
 */
function ARAgingSummaryActionsBar({
  // #withReceivableAging
  isFilterDrawerOpen,

  // #withReceivableAgingActions
  toggleARAgingSummaryFilterDrawer: toggleDisplayFilterDrawer,

  // #withDialogActions
  openDialog,

  // #ownProps
  numberFormat,
  onNumberFormatSubmit,
}) {
  const { isARAgingFetching, refetch } = useARAgingSummaryContext();

  const handleFilterToggleClick = () => {
    toggleDisplayFilterDrawer();
  };

  // Handles re-calculate report button.
  const handleRecalcReport = () => {
    refetch();
  };

  // Handle number format submit.
  const handleNumberFormatSubmit = (numberFormat) => {
    safeInvoke(onNumberFormatSubmit, numberFormat);
  };

  // Handles the print button click.
  const handlePrintBtnClick = () => {
    openDialog(DialogsName.ARAgingSummaryPdfPreview)
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
              <T id="hide_customizer" />
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
              submitDisabled={isARAgingFetching}
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

        <Button
          className={Classes.MINIMAL}
          text={<T id={'filter'} />}
          icon={<Icon icon="filter-16" iconSize={16} />}
        />
        <NavbarDivider />

        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="print-16" iconSize={16} />}
          text={<T id={'print'} />}
          onClick={handlePrintBtnClick}
        />
        <Popover
          content={<ARAgingSummaryExportMenu />}
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
  withARAgingSummaryActions,
  withARAgingSummary(({ ARAgingSummaryFilterDrawer }) => ({
    isFilterDrawerOpen: ARAgingSummaryFilterDrawer,
  })),
  withDialogActions,
)(ARAgingSummaryActionsBar);
