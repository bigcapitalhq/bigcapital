// @ts-nocheck
import {
  Button,
  Popover,
  Menu,
  MenuItem,
  MenuDivider,
  Position,
} from '@blueprintjs/core';
import styled, { x } from '@xstyled/emotion';

import { Icon, FormattedMessage as T } from '@/components';

import { withCurrentOrganization } from '@/containers/Organization/withCurrentOrganization';
import { useAuthenticatedAccount } from '@/hooks/query';
import { useWorkspaces } from '@/ee/workspaces/hooks/query/workspaces';
import { useAuthOrganizationId, useAuthActions } from '@/hooks/state';
import { useSwitchOrganization } from '@/ee/workspaces/hooks/useSwitchOrganization';
import { DRAWERS } from '@/constants/drawers';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';
import { compose, firstLettersArgs } from '@/utils';

// Popover modifiers.
const POPOVER_MODIFIERS = {
  offset: { offset: '28, 8' },
};

const DashboardOrganizationMenu = styled(Menu)`
  padding: 10px;
  min-width: 280px;
  max-height: 500px;
  overflow-y: auto;

  .org-workspace-item {
    padding: 8px 10px;

    &.is-active {
      background: rgba(255, 255, 255, 0.08);
    }

    &:hover:not(.is-active):not(.bp4-disabled) {
      background: rgba(255, 255, 255, 0.05);
    }

    &.bp4-disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .bp4-menu-divider {
    margin: 8px 0;
    border-top-color: rgba(255, 255, 255, 0.1);
  }

  .bp4-menu-item {
    color: rgba(255, 255, 255, 0.9);
    border-radius: 4px;
    line-height: 20px;

    &:hover:not(.bp4-disabled) {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
    }

    .bp4-icon {
      color: rgba(255, 255, 255, 0.6);
    }
  }
`;

/**
 * Sidebar head.
 */
function SidebarHeadJSX({
  // #withCurrentOrganization
  organization,
  // #withDrawerActions
  openDrawer,
}) {
  const { data: user } = useAuthenticatedAccount();
  const { data: workspaces } = useWorkspaces();
  const currentOrganizationId = useAuthOrganizationId();
  const switchOrganization = useSwitchOrganization();
  const { setLogout } = useAuthActions();

  const handleSwitchWorkspace = (organizationId) => {
    if (organizationId === currentOrganizationId) {
      return;
    }
    switchOrganization(organizationId);
  };

  const handleLogout = () => {
    setLogout();
  };

  return (
    <div className="sidebar__head">
      <div className="sidebar__head-organization">
        <Popover
          modifiers={POPOVER_MODIFIERS}
          boundary={'window'}
          content={
            <DashboardOrganizationMenu>
              <x.div
                display="flex"
                alignItems="center"
                gap={3}
                py={'8px'}
                px={'10px'}
                backgroundColor="rgba(255, 255, 255, 0.05)"
                borderRadius={4}
              >
                {organization.metadata?.logoUri ? (
                  <x.img
                    src={organization.metadata.logoUri}
                    alt={organization.name}
                    h={'60px'}
                    w={'60px'}
                    borderRadius={10}
                    objectFit="cover"
                  />
                ) : (
                  <x.div
                    h={'60px'}
                    w={'60px'}
                    lineHeight="60px"
                    borderRadius={10}
                    backgroundColor="#CB22E5"
                    textAlign="center"
                    fontWeight={400}
                    fontSize={16}
                    color="#fff"
                  >
                    {firstLettersArgs(...(organization.name || '').split(' '))}
                  </x.div>
                )}
                <x.div fontWeight={600} color="#fff">
                  {organization.name}
                </x.div>
              </x.div>
              <MenuDivider />

              <MenuItem
                icon={<Icon icon={'list'} size={16} />}
                text={
                  <T id={'workspaces.view_all_workspaces'} />
                }
                onClick={() => openDrawer(DRAWERS.ORGANIZATIONS_LIST)}
              />
              <MenuDivider />

              <x.div maxHeight="240px" overflowY="auto">
                {workspaces?.map((workspace) => {
                  const name = workspace.metadata?.name || workspace.organizationId;
                  const initials = firstLettersArgs(...(name || '').split(' '));
                  const isActive = workspace.organizationId === currentOrganizationId;
                  const isDisabled = !workspace.isReady || workspace.isBuildRunning;

                  return (
                    <MenuItem
                      key={workspace.organizationId}
                      className={`org-workspace-item ${isActive ? 'is-active' : ''}`}
                      disabled={isDisabled}
                      onClick={() => handleSwitchWorkspace(workspace.organizationId)}
                      text={
                        <x.div
                          display="flex"
                          alignItems="center"
                          gap={3}
                          w="100%"
                        >
                          {workspace.metadata?.logoUri ? (
                            <x.img
                              src={workspace.metadata.logoUri}
                              alt={name}
                              w={'28px'}
                              h={'28px'}
                              borderRadius={'10px'}
                              objectFit="cover"
                              flexShrink={0}
                            />
                          ) : (
                            <x.div
                              w={'28px'}
                              h={'28px'}
                              borderRadius={'10px'}
                              backgroundColor="#5c7c99"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              fontSize={12}
                              color="#fff"
                              flexShrink={0}
                            >
                              {initials}
                            </x.div>
                          )}
                          <x.span
                            flex={1}
                            overflow="hidden"
                            textOverflow="ellipsis"
                            whiteSpace="nowrap"
                            fontWeight={isActive ? 500 : undefined}
                          >
                            {name}
                          </x.span>
                          {isActive && (
                            <Icon
                              icon={'tick'}
                              iconSize={14}
                              color="#48aff0"
                              style={{ flexShrink: 0 }}
                            />
                          )}
                        </x.div>
                      }
                    />
                  );
                })}
              </x.div>

              <MenuDivider />
              <MenuItem
                icon={<Icon icon={'plus'} size={16} />}
                text={<T id={'workspaces.create_workspace'} />}
                onClick={() => openDrawer(DRAWERS.CREATE_WORKSPACE)}
              />
              <MenuDivider />
              <MenuItem
                icon={<Icon icon={'log-out'} size={16} />}
                text={<T id={'logout'} />}
                onClick={handleLogout}
              />
            </DashboardOrganizationMenu>
          }
          position={Position.BOTTOM}
          minimal={true}
        >
          <Button
            className="title"
            rightIcon={<Icon icon={'caret-down-16'} size={16} />}
          >
            {organization.name}
          </Button>
        </Popover>
        <span class="subtitle">{user.full_name}</span>
      </div>

      <div className="sidebar__head-logo">
        <Icon
          icon={'mini-bigcapital'}
          width={28}
          height={28}
          className="bigcapital--alt"
        />
      </div>
    </div>
  );
}

export const SidebarHead = compose(
  withCurrentOrganization(({ organization }) => ({ organization })),
  withDrawerActions,
)(SidebarHeadJSX);
