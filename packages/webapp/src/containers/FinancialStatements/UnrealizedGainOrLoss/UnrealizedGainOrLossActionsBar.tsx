import {
  NavbarGroup,
  NavbarDivider,
  Button,
  Classes,
  Popover,
  PopoverInteractionKind,
  Position,
} from '@blueprintjs/core';
import classNames from 'classnames';
import React from 'react';
import { useUnrealizedGainOrLossContext } from './UnrealizedGainOrLossProvider';
import { withUnrealizedGainOrLoss } from './withUnrealizedGainOrLoss';
import {
  withUnrealizedGainOrLossActions,
  WithUnrealizedGainOrLossActionsProps,
} from './withUnrealizedGainOrLossActions';
import { DashboardActionsBar, FormattedMessage as T, Icon } from '@/components';
import NumberFormatDropdown from '@/components/NumberFormatDropdown';
import { compose, saveInvoke } from '@/utils';

interface UnrealizedGainOrLossActionsBarOwnProps {
  numberFormat?: Record<string, unknown>;
  onNumberFormatSubmit?: (values: Record<string, unknown>) => void;
}

type UnrealizedGainOrLossActionsBarProps = {
  isFilterDrawerOpen: boolean;
} & Pick<
  WithUnrealizedGainOrLossActionsProps,
  'toggleUnrealizedGainOrLossFilterDrawer'
> &
  UnrealizedGainOrLossActionsBarOwnProps;

function UnrealizedGainOrLossActionsBarInner({
  isFilterDrawerOpen,
  toggleUnrealizedGainOrLossFilterDrawer,
  numberFormat,
  onNumberFormatSubmit,
}: UnrealizedGainOrLossActionsBarProps) {
  const handleFilterToggleClick = () => {
    toggleUnrealizedGainOrLossFilterDrawer();
  };

  const handleRecalculateReport = () => {};

  const handleNumberFormatSubmit = (values: Record<string, unknown>) =>
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

export const UnrealizedGainOrLossActionsBar = compose(
  withUnrealizedGainOrLoss(({ unrealizedGainOrLossDrawerFilter }) => ({
    isFilterDrawerOpen: unrealizedGainOrLossDrawerFilter,
  })),
  withUnrealizedGainOrLossActions,
)(UnrealizedGainOrLossActionsBarInner);
