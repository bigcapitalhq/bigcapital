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
import { DashboardActionsBar, FormattedMessage as T, Icon } from '@/components';
import classNames from 'classnames';

import NumberFormatDropdown from '@/components/NumberFormatDropdown';

import { compose, saveInvoke } from '@/utils';
import { useProjectProfitabilitySummaryContext } from './ProjectProfitabilitySummaryProvider';
import withProjectProfitabilitySummary from './withProjectProfitabilitySummary';
import withProjectProfitabilitySummaryActions from './withProjectProfitabilitySummaryActions';

/**
 * Project profitability summary actions bar.
 */
function ProjectProfitabilitySummaryActionsBar({
  // #withProjectProfitabilitySummary
  isFilterDrawerOpen,

  // #withProjectProfitabilitySummaryActions
  toggleProjectProfitabilitySummaryFilterDrawer: toggleFilterDrawer,

  // #ownProps
  numberFormat,
  onNumberFormatSubmit,
}) {
  const { isLoading, refetchProjectProfitabilitySummary } =
    useProjectProfitabilitySummaryContext();

  // Handle filter toggle click.
  const handleFilterToggleClick = () => {
    toggleFilterDrawer();
  };

  // Handle recalculate the report button.
  const handleRecalcReport = () => {
    refetchProjectProfitabilitySummary();
  };

  // Handle number format form submit.
  const handleNumberFormatSubmit = (values) => {
    saveInvoke(onNumberFormatSubmit, values);
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
            !isFilterDrawerOpen ? (
              <T id={'customize_report'} />
            ) : (
              <T id={'hide_customizer'} />
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

        <NavbarDivider />

        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="print-16" iconSize={16} />}
          text={<T id={'print'} />}
        />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="file-export-16" iconSize={16} />}
          text={<T id={'export'} />}
        />
      </NavbarGroup>
    </DashboardActionsBar>
  );
}

export default compose(
  withProjectProfitabilitySummary(
    ({ projectProfitabilitySummaryDrawerFilter }) => ({
      isFilterDrawerOpen: projectProfitabilitySummaryDrawerFilter,
    }),
  ),
  withProjectProfitabilitySummaryActions,
)(ProjectProfitabilitySummaryActionsBar);
