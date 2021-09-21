import React, { useEffect } from 'react';
import { Scrollbar } from 'react-scrollbars-custom';
import classNames from 'classnames';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withDashboard from 'containers/Dashboard/withDashboard';

import { compose } from 'utils';
import withSubscriptions from '../../containers/Subscriptions/withSubscriptions';

function SidebarContainer({
  // #ownProps
  children,

  // #withDashboardActions
  toggleSidebarExpend,

  // #withDashboard
  sidebarExpended,

  // #withSubscription
  isSubscriptionActive,
}) {
  const sidebarScrollerRef = React.useRef();

  useEffect(() => {
    document.body.classList.toggle('has-mini-sidebar', !sidebarExpended);

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

  const scrollerElementRef = (ref) => {
    sidebarScrollerRef.current = ref;
  };

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

export default compose(
  withDashboardActions,
  withDashboard(({ sidebarExpended }) => ({
    sidebarExpended,
  })),
  withSubscriptions(
    ({ isSubscriptionActive }) => ({ isSubscriptionActive }),
    'main',
  ),
)(SidebarContainer);
