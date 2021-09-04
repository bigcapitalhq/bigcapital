import React from 'react';
import { Button, Popover, Menu, Position } from '@blueprintjs/core';
import Icon from 'components/Icon';
import { useAuthUser } from 'hooks/state';
import { compose, firstLettersArgs } from 'utils';
import withCurrentOrganization from '../../containers/Organization/withCurrentOrganization';

// Popover modifiers.
const POPOVER_MODIFIERS = {
  offset: { offset: '28, 8' },
};

/**
 * Sideabr head.
 */
function SidebarHead({
  // #withCurrentOrganization
  organization,
}) {
  const user = useAuthUser();

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

export default compose(
  withCurrentOrganization(({ organization }) => ({ organization })),
)(SidebarHead);
