import React from 'react';
import { Menu, MenuItem, MenuDivider } from '@blueprintjs/core';
import { useHistory, useLocation } from 'react-router-dom';
import { FormattedMessage as T } from '@/components';
import preferencesMenu, { IMenuDivider, PreferencesMenuItem } from '@/constants/preferencesMenu';
import PreferencesSidebarContainer from './PreferencesSidebarContainer';

import '@/style/pages/Preferences/Sidebar.scss';

function isMenuDivider(item: PreferencesMenuItem): item is IMenuDivider {
  return 'divider' in item && item.divider === true;
}

/**
 * Preferences sidebar.
 */
export default function PreferencesSidebar() {
  const history = useHistory();
  const location = useLocation();

  const items = preferencesMenu.map((item) => {
    if (isMenuDivider(item)) {
      return <MenuDivider title={item.title} />;
    }  
    return (
      <MenuItem
        active={item.href && item.href === location.pathname}
        text={item.text}
        label={item.label}
        disabled={item.disabled}
        onClick={() => {
          history.push(item.href);
        }}
      />
    );
  });

  return (
    <PreferencesSidebarContainer>
      <div className="preferences-sidebar__head">
        <h2>{<T id={'preferences'} />}</h2>
      </div>

      <Menu className="preferences-sidebar__menu">{items}</Menu>
    </PreferencesSidebarContainer>
  );
}
