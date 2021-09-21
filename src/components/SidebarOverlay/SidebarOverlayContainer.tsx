import React from 'react';
import { Scrollbar } from 'react-scrollbars-custom';

interface ISidebarOverlayContainerProps {
    children: JSX.Element | JSX.Element[],
}

/**
 * Sidebar overlay container.
 */
export default function SidebarOverlayContainer({ children }: ISidebarOverlayContainerProps) {
  return (
    <div className={'sidebar-overlay__scroll-wrapper'}>
      <Scrollbar noDefaultStyles={true}>
        <div className="sidebar-overlay__inner">{children}</div>
      </Scrollbar>
    </div>
  );
}
