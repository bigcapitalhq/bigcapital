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
import { DashboardActionsBar,FormattedMessage as T, Icon } from '@/components';
import classNames from 'classnames';

import NumberFormatDropdown from '@/components/NumberFormatDropdown';

import { useUnrealizedGainOrLossContext } from './UnrealizedGainOrLossProvider';
import withUnrealizedGainOrLoss from './withUnrealizedGainOrLoss';
import withUnrealizedGainOrLossActions from './withUnrealizedGainOrLossActions';

import { compose, saveInvoke } from '@/utils';

/**
 * unrealized Gain or Loss actions bar.
 */
function UnrealizedGainOrLossActionsBar({
  //#withRealizedGainOrLoss
  isFilterDrawerOpen,

  //#withRealizedGainOrLossActions
  toggleUnrealizedGainOrLossFilterDrawer,

  //#ownProps
  numberFormat,
  onNumberFormatSubmit,
}) {
  // Handle filter toggle click.
  const handleFilterToggleClick = () => {
    toggleUnrealizedGainOrLossFilterDrawer();
  };

  // Handle recalculate report button.
  const handleRecalculateReport = () => {};

  // handle number format form submit.
  const handleNumberFormatSubmit = (values) =>
    saveInvoke(onNumberFormatSubmit, values);

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
              submitDisabled={false}
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
          className={classNames(Classes.MINIMAL, 'button--filter')}
          text={<T id={'filter'} />}
          icon={<Icon icon="filter-16" iconSize={16} />}
        />
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
  withUnrealizedGainOrLoss(({ unrealizedGainOrLossDrawerFilter }) => ({
    isFilterDrawerOpen: unrealizedGainOrLossDrawerFilter,
  })),
  withUnrealizedGainOrLossActions,
)(UnrealizedGainOrLossActionsBar);
