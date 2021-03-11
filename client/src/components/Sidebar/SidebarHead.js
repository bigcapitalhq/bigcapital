import React from 'react';
import { Button, Popover, Menu, Position } from '@blueprintjs/core';
import Icon from 'components/Icon';
import { useAuthUser } from 'hooks/state';
import withSettings from 'containers/Settings/withSettings';
import { compose, firstLettersArgs } from 'utils';

// Popover modifiers.
const POPOVER_MODIFIERS = {
  offset: { offset: '20, 8' },
};

/**
 * Sideabr head.
 */
function SidebarHead({
  // #withSettings
  organizationName,
}) {
  const user = useAuthUser();

  return (
    <div className="sidebar__head">
      <div className="sidebar__head-organization">
        <Popover
          modifiers={POPOVER_MODIFIERS}
          content={
            <Menu className={'menu--dashboard-organization'}>
              <div class="org-item">
                <div class="org-item__logo">
                  {firstLettersArgs(...organizationName.split(' '))}{' '}
                </div>
                <div class="org-item__name">{organizationName}</div>
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
            {organizationName}
          </Button>
        </Popover>
        <span class="subtitle">{user.full_name}</span>
      </div>

      <div className="sidebar__head-logo">
        <Icon
          icon={'mini-bigcapital'}
          width={140}
          height={28}
          className="bigcapital--alt"
        />
      </div>
    </div>
  );
}

export default compose(
  withSettings(({ organizationSettings }) => ({
    organizationName: organizationSettings.name,
  })),
)(SidebarHead);
