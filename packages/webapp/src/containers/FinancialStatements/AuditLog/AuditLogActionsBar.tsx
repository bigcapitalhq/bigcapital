import { Button, Classes, NavbarGroup, NavbarDivider } from '@blueprintjs/core';
import classNames from 'classnames';
import React from 'react';
import { useAuditLogContext } from './AuditLogProvider';
import { DashboardActionsBar, Icon } from '@/components';

interface AuditLogActionsBarProps {
  isFilterDrawerOpen: boolean;
  toggleFilterDrawer: (toggle?: boolean) => void;
}

/**
 * Audit Log Actions Bar
 */
export function AuditLogActionsBar({
  isFilterDrawerOpen,
  toggleFilterDrawer,
}: AuditLogActionsBarProps) {
  const { sheetRefresh } = useAuditLogContext();

  const handleCustomizeClick = () => {
    toggleFilterDrawer();
  };
  const handleRecalcReport = () => {
    sheetRefresh();
  };

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <Button
          className={classNames(Classes.MINIMAL)}
          text={'Reload'}
          onClick={handleRecalcReport}
          icon={<Icon icon="refresh-16" iconSize={16} />}
        />
        <NavbarDivider />
        <Button
          className={classNames(Classes.MINIMAL)}
          icon={<Icon icon="cog-16" iconSize={16} />}
          text={'Filter'}
          onClick={handleCustomizeClick}
          active={isFilterDrawerOpen}
        />
      </NavbarGroup>
    </DashboardActionsBar>
  );
}
