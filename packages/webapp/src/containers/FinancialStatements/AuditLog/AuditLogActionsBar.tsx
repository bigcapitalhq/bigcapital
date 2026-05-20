// @ts-nocheck
import React from 'react';
import { Button, Classes, NavbarGroup, NavbarDivider } from '@blueprintjs/core';
import classNames from 'classnames';
import { DashboardActionsBar, Icon } from '@/components';
import { useAuditLogContext } from './AuditLogProvider';

/**
 * Audit Log Actions Bar
 */
function AuditLogActionsBar({
  isFilterDrawerOpen,
  toggleFilterDrawer,
}) {
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
          text={"Reload"}
          onClick={handleRecalcReport}
          icon={<Icon icon="refresh-16" iconSize={16} />}
        />
        <NavbarDivider />
        <Button
          className={classNames(Classes.MINIMAL)}
          icon={<Icon icon="cog-16" iconSize={16} />}
          text={"Filter"}
          onClick={handleCustomizeClick}
          active={isFilterDrawerOpen}
        />
      </NavbarGroup>
    </DashboardActionsBar>
  );
}

export default AuditLogActionsBar;
