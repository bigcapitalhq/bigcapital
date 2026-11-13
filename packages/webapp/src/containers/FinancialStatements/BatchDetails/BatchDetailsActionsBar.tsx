import { Button, NavbarDivider, NavbarGroup } from '@blueprintjs/core';
import classNames from 'classnames';
import React from 'react';
import { useBatchDetailsContext } from './BatchDetailsProvider';
import { DashboardActionsBar, FormattedMessage as T, Icon } from '@/components';

/**
 * Batch details report actions bar.
 */
export function BatchDetailsActionsBar() {
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
      </NavbarGroup>
    </DashboardActionsBar>
  );
}
