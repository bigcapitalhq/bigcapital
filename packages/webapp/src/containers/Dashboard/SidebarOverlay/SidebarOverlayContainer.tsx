// @ts-nocheck
import React from 'react';
import { Scrollbar } from 'react-scrollbars-custom';

export interface ISidebarOverlayContainerProps {
  children: JSX.Element | JSX.Element[];
}

/**
 * Sidebar overlay container.
 */
export function SidebarOverlayContainer({
  children,
}: ISidebarOverlayContainerProps) {
  return (
    <div className={'sidebar-overlay__scroll-wrapper'}>
      <Scrollbar noDefaultStyles={true}>
        <div className="sidebar-overlay__inner">{children}</div>
      </Scrollbar>
    </div>
  );
}
