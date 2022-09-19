// @ts-nocheck
import React from 'react';
import classNames from 'classnames';
import { Scrollbar } from 'react-scrollbars-custom';
import { CLASSES } from '@/constants/classes';

export default function PreferencesSidebarContainer({ children }) {
  return (
    <div
      className={classNames(
        CLASSES.PREFERENCES_PAGE_SIDEBAR,
        CLASSES.PREFERENCES_SIDEBAR,
      )}
    >
      <div class="preferences-sidebar__wrapper">
        <Scrollbar noDefaultStyles={true}>
          <div class="preferences-sidebar__inner">{children}</div>
        </Scrollbar>
      </div>
    </div>
  );
}
