// @ts-nocheck
import React from 'react';
import { Button, Popover, Menu, Position } from '@blueprintjs/core';

import { Icon } from '@/components';

import withCurrentOrganization from '@/containers/Organization/withCurrentOrganization';
import { useAuthenticatedAccount } from '@/hooks/query';
import { compose, firstLettersArgs } from '@/utils';

// Popover modifiers.
const POPOVER_MODIFIERS = {
  offset: { offset: '28, 8' },
};

/**
 * Sidebar head.
 */
function SidebarHeadJSX({
  // #withCurrentOrganization
  organization,
}) {
  // Retrieve authenticated user information.
  const { data: user } = useAuthenticatedAccount();

  return (
    <div className="sidebar__head">
      <div className="sidebar__head-organization">
        <Popover
          modifiers={POPOVER_MODIFIERS}
          boundary={'window'}
          content={
            <Menu className={'menu--dashboard-organization'}>
              <div class="org-item">
                <div class="org-item__logo">
                  {firstLettersArgs(...(organization.name || '').split(' '))}{' '}
                </div>
                <div class="org-item__name">{organization.name}</div>
              </div>
            </Menu>
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
)(SidebarHeadJSX);
