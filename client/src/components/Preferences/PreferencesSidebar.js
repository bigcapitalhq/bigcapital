import React from 'react';
import {Menu, MenuItem, MenuDivider} from '@blueprintjs/core';
import {useHistory} from 'react-router-dom';
import preferencesMenu from 'config/preferencesMenu';

export default function PreferencesSidebar() {
  const history = useHistory();
  
  const items = preferencesMenu.map((item) => (
    (item.divider) ?
      <MenuDivider title={item.title} /> : 
      <MenuItem
        text={item.text}
        label={item.label}
        disabled={item.disabled}
        onClick={() => { history.push(item.href); }} />
  ));

  return (
    <div class="preferences__sidebar">
      <div class="preferences__sidebar-head">
        <h2>Preferences</h2>
      </div>

      <Menu className="preferences__sidebar-menu">
        { items }
      </Menu>
    </div>
  );
}