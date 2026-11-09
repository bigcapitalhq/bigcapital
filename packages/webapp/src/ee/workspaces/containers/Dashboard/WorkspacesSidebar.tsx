import { Tooltip, Position, Spinner, Icon } from '@blueprintjs/core';
import classNames from 'classnames';
import * as FF from 'fp-ts/function';
import React, { useState } from 'react';
import type { Workspace } from '@bigcapital/sdk-ts';
import { DRAWERS } from '@/constants/drawers';
import {
  withDrawerActions,
  WithDrawerActionsProps,
} from '@/containers/Drawer/withDrawerActions';
import { WorkspaceSwitchingOverlay } from '@/ee/workspaces/components/WorkspaceSwitchingOverlay';
import { useWorkspaces } from '@/ee/workspaces/hooks/query';
import { useSwitchOrganization } from '@/ee/workspaces/hooks/useSwitchOrganization';
import { useAuthOrganizationId } from '@/hooks/state';
import { firstLettersArgs } from '@/utils';

import '@/ee/workspaces/style/containers/Dashboard/WorkspacesSidebar.scss';

/**
 * Single workspace icon button.
 */
function WorkspaceIcon({
  workspace,
  isActive,
  onClick,
}: {
  workspace: Workspace;
  isActive: boolean;
  onClick: (organizationId: string, workspaceName: string) => void;
}) {
  const name = workspace.metadata?.name || workspace.organizationId;
  const initials = firstLettersArgs(...(name || '').split(' '));
  const isDisabled = !workspace.isReady || workspace.isBuildRunning;
  const logoUri = workspace.metadata?.logoUri;

  return (
    <Tooltip
      content={name}
      position={Position.RIGHT}
      minimal
      className="workspaces-sidebar__item-tooltip"
    >
      <button
        className={classNames('workspaces-sidebar__item', {
          'is-active': isActive,
          'is-disabled': isDisabled,
        })}
        onClick={() => !isDisabled && onClick(workspace.organizationId, name)}
        disabled={isDisabled}
      >
        {workspace.isBuildRunning ? (
          <Spinner size={16} />
        ) : logoUri ? (
          <img
            src={logoUri}
            alt={name}
            className="workspaces-sidebar__item-logo"
          />
        ) : (
          <span className="workspaces-sidebar__item-initials">{initials}</span>
        )}
      </button>
    </Tooltip>
  );
}

/**
 * Organizations list button.
 */
function OrganizationsListButton({
  openDrawer,
}: {
  openDrawer: (name: string, payload?: Record<string, unknown>) => void;
}) {
  return (
    <Tooltip
      content="View all organizations"
      position={Position.RIGHT}
      minimal
      className="workspaces-sidebar__item-tooltip"
    >
      <button
        className={classNames(
          'workspaces-sidebar__item',
          'workspaces-sidebar__list-btn',
        )}
        onClick={() => openDrawer(DRAWERS.ORGANIZATIONS_LIST)}
      >
        <Icon icon="list" size={16} />
      </button>
    </Tooltip>
  );
}

/**
 * Add workspace button.
 */
function AddWorkspaceButton({
  openDrawer,
}: {
  openDrawer: (name: string, payload?: Record<string, unknown>) => void;
}) {
  return (
    <Tooltip
      content="Create workspace"
      position={Position.RIGHT}
      minimal
      className="workspaces-sidebar__item-tooltip"
    >
      <button
        className={classNames(
          'workspaces-sidebar__item',
          'workspaces-sidebar__add-btn',
        )}
        onClick={() => openDrawer(DRAWERS.CREATE_WORKSPACE)}
      >
        <Icon icon="plus" size={16} />
      </button>
    </Tooltip>
  );
}

/**
 * Workspaces sidebar container.
 */
function WorkspacesSidebarRoot({ openDrawer }: WithDrawerActionsProps) {
  const { data: workspaces, isLoading } = useWorkspaces();
  const activeOrganizationId = useAuthOrganizationId();
  const switchOrganization = useSwitchOrganization();
  const [switchingWorkspaceName, setSwitchingWorkspaceName] = useState<
    string | null
  >(null);

  const handleSwitchWorkspace = (
    organizationId: string,
    workspaceName: string,
  ) => {
    if (organizationId === activeOrganizationId) {
      return;
    }
    setSwitchingWorkspaceName(workspaceName);
    // Small delay to let the overlay render before the browser navigates
    setTimeout(() => {
      switchOrganization(organizationId, workspaceName);
    }, 350);
  };

  return (
    <>
      <div className="workspaces-sidebar">
        <div className="workspaces-sidebar__scrollable">
          {isLoading ? (
            <div className="workspaces-sidebar__loading">
              <Spinner size={20} />
            </div>
          ) : (
            <div className="workspaces-sidebar__list">
              {workspaces?.map((workspace) => (
                <WorkspaceIcon
                  key={workspace.organizationId}
                  workspace={workspace}
                  isActive={workspace.organizationId === activeOrganizationId}
                  onClick={handleSwitchWorkspace}
                />
              ))}
            </div>
          )}
        </div>
        <div className="workspaces-sidebar__footer">
          <OrganizationsListButton openDrawer={openDrawer} />
          <AddWorkspaceButton openDrawer={openDrawer} />
        </div>
      </div>
      {switchingWorkspaceName && (
        <WorkspaceSwitchingOverlay workspaceName={switchingWorkspaceName} />
      )}
    </>
  );
}

export const WorkspacesSidebar = FF.pipe(
  WorkspacesSidebarRoot,
  withDrawerActions,
);
