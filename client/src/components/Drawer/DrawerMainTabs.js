import React from 'react';
import { Tabs } from '@blueprintjs/core';

/**
 * Drawer main tabs.
 */
export function DrawerMainTabs({ children, ...restProps }) {
  return (
    <div class="drawer__main-tabs">
      <Tabs animate={true} large={true} {...restProps}>
        {children}
      </Tabs>
    </div>
  );
}
