import { Button, NavbarDivider, NavbarGroup } from '@blueprintjs/core';
import classNames from 'classnames';
import React from 'react';
import { useBatchDetailsContext } from './BatchDetailsProvider';
import { DashboardActionsBar, FormattedMessage as T, Icon } from '@/components';

interface BatchDetailsActionsBarProps {
  isFilterDrawerOpen: boolean;
  onToggleFilterDrawer: () => void;
}

/**
 * Batch details report actions bar.
 */
export function BatchDetailsActionsBar({
  isFilterDrawerOpen,
  onToggleFilterDrawer,
}: BatchDetailsActionsBarProps) {
  const { refetch, isFetching } = useBatchDetailsContext();

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <Button
          className={classNames('button--gray-highlight')}
          text={<T id={'recalc_report'} />}
          onClick={() => refetch()}
          loading={isFetching}
          icon={<Icon icon="refresh-16" iconSize={16} />}
        />
        <NavbarDivider />
        <Button
          className={classNames('button--table-views')}
          icon={<Icon icon="cog-16" iconSize={16} />}
          text={
            isFilterDrawerOpen ? (
              <T id={'hide_customizer'} />
            ) : (
              <T id={'customize_report'} />
            )
          }
          onClick={onToggleFilterDrawer}
          active={isFilterDrawerOpen}
        />
        <NavbarDivider />
      </NavbarGroup>
    </DashboardActionsBar>
  );
}
