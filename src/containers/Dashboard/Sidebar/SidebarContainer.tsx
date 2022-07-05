import React, { useEffect } from 'react';
import { Scrollbar } from 'react-scrollbars-custom';
import classNames from 'classnames';

import withDashboard from '@/containers/Dashboard/withDashboard';
import withSubscriptions from '@/containers/Subscriptions/withSubscriptions';

import { useObserveSidebarExpendedBodyclass } from './hooks';
import { compose } from '@/utils';

/**
 * Sidebar container/
 * @returns {JSX.Element}
 */
function SidebarContainerJSX({
  // #ownProps
  children,

  // #withDashboard
  sidebarExpended,

  // #withSubscription
  isSubscriptionActive,
}) {
  const sidebarScrollerRef = React.useRef();

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

  const scrollerElementRef = React.useCallback((ref) => {
    sidebarScrollerRef.current = ref;
  }, []);

  return (
    <div
      className={classNames('sidebar', {
        'sidebar--mini-sidebar': !sidebarExpended,
        'is-subscription-inactive': !isSubscriptionActive,
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

export const SidebarContainer = compose(
  withDashboard(({ sidebarExpended }) => ({
    sidebarExpended,
  })),
  withSubscriptions(
    ({ isSubscriptionActive }) => ({ isSubscriptionActive }),
    'main',
  ),
)(SidebarContainerJSX);
