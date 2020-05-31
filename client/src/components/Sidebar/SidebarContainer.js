import * as React from 'react';
import { Scrollbar } from 'react-scrollbars-custom';
import classNames from 'classnames';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withDashboard from 'containers/Dashboard/withDashboard';

import { compose } from 'utils';

function SidebarContainer({
  // #ownProps
  children,

  // #withDashboardActions
  toggleSidebarExpend,

  // #withDashboard
  sidebarExpended,
}) {
  return (
    <div
      className={classNames('sidebar', {
        'sidebar--mini-sidebar': !sidebarExpended,
      })}
      id="sidebar"
    >
      <div className={'sidebar__scroll-wrapper'}>
        <Scrollbar noDefaultStyles={true}>
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
)(SidebarContainer);
