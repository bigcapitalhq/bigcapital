// @ts-nocheck

import { Button, Popover, Menu, Position } from '@blueprintjs/core';

import { Icon } from '@/components';

import withCurrentOrganization from '@/containers/Organization/withCurrentOrganization';
import { useAuthenticatedAccount } from '@/hooks/query';
import { compose, firstLettersArgs, getCookie } from '@/utils';
import GeneralFormPage from '@/containers/Preferences/General/GeneralFormPage';
import { GeneralFormProvider } from '@/containers/Preferences/General/GeneralFormProvider';
import React from 'react';

// Popover modifiers.
const POPOVER_MODIFIERS = {
  offset: { offset: '28, 8' },
};

/**
 * Sideabr head.
 */
function SidebarHeadJSX({
  // #withCurrentOrganization
  organization,
}) {
  // Retrieve authenticated user information.
  const { data: user } = useAuthenticatedAccount();
  // const tenants = getCookie('tenants');
  const tenants = [];
  const tenantsarr = JSON.parse(getCookie('tenants'));
  const [btnStatus, setBtnStatus] = React.useState(false);
  const clickedBtn = () => {
    setBtnStatus(!btnStatus);
  }

  return (
    <div className="sidebar__head">
      <div className="sidebar__head-organization">
        <Popover
          modifiers={POPOVER_MODIFIERS}
          boundary={'window'}
          content={
            <Menu className={'menu--dashboard-organization'}>
              {tenantsarr.map((data, index) => (
                <div class="org-item" style={{ cursor: 'pointer', marginBottom: '5px'}}>
                  <div class="org-item__logo">
                    {firstLettersArgs(...(data.data.metadata.name || '').split(' '))}{' '}
                  </div>
                  <div class="org-item__name">{data.data.metadata.name}</div>
                </div>
              ))}
              <div class="org-item" onClick={() => clickedBtn()} style={{ cursor: 'pointer'}}>
                <div class="org-item__logo">
                  +
                </div>
                <div class="org-item__name">Add Tenant</div>
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
      <div style={{ position: 'fixed', zIndex: '999', left: '25%', width: '50vw', display: btnStatus ? 'block' : 'none' }}>
        <GeneralFormProvider>
          <GeneralFormPage />
        </GeneralFormProvider>
      </div>

    </div>
  );
}

export const SidebarHead = compose(
  withCurrentOrganization(({ organization }) => ({ organization })),
)(SidebarHeadJSX);
