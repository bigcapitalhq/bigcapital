import classNames from 'classnames';
import * as FF from 'fp-ts/function';
import React, { useEffect } from 'react';
import { Scrollbar } from 'react-scrollbars-custom';
import { useObserveSidebarExpendedBodyclass } from './hooks';
import {
  withDashboard,
  WithDashboardProps,
} from '@/containers/Dashboard/withDashboard';

interface SidebarContainerProps {
  children: React.ReactNode;
  sidebarExpended: boolean;
}

/**
 * Sidebar container/
 * @returns {JSX.Element}
 */
function SidebarContainerJSX({
  // #ownProps
  children,

  // #withDashboard
  sidebarExpended,
}: SidebarContainerProps) {
  const sidebarScrollerRef = React.useRef<HTMLDivElement | null>(null);

  // Toggles classname to body once sidebar expend/shrink.
  useObserveSidebarExpendedBodyclass(sidebarExpended);

  useEffect(() => {
    if (!sidebarExpended && sidebarScrollerRef.current) {
      sidebarScrollerRef.current.scrollTo({
        top: 0,
        left: 0,
      });
    }
  }, [sidebarExpended]);

  const handleSidebarMouseLeave = () => {
    if (!sidebarExpended && sidebarScrollerRef.current) {
      sidebarScrollerRef.current.scrollTo({ top: 0, left: 0 });
    }
  };

  const scrollerElementRef = React.useCallback((ref: HTMLDivElement | null) => {
    sidebarScrollerRef.current = ref;
  }, []);

  return (
    <div
      className={classNames('sidebar', {
        'sidebar--mini-sidebar': !sidebarExpended,
      })}
      id="sidebar"
      onMouseLeave={handleSidebarMouseLeave}
    >
      <div className={'sidebar__scroll-wrapper'}>
        <Scrollbar
          noDefaultStyles={true}
          scrollerProps={{ elementRef: scrollerElementRef }}
        >
          <div className="sidebar__inner">{children}</div>
        </Scrollbar>
      </div>
    </div>
  );
}

export const SidebarContainer = FF.pipe(
  SidebarContainerJSX,
  withDashboard(({ sidebarExpended }: WithDashboardProps) => ({
    sidebarExpended,
  })),
);
