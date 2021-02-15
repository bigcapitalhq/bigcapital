import React, { useEffect, Suspense } from 'react';
import { CLASSES } from 'common/classes';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import { compose } from 'utils';
/**
 * Dashboard pages wrapper.
 */
function DashboardPage({
  // #ownProps
  pageTitle,
  backLink,
  sidebarShrink,
  Component,

  // #withDashboardActions
  changePageTitle,
  setDashboardBackLink,
  setSidebarShrink,
  resetSidebarPreviousExpand,
}) {
  useEffect(() => {
    pageTitle && changePageTitle(pageTitle);

    return () => {
      pageTitle && changePageTitle('');
    };
  });

  useEffect(() => {
    backLink && setDashboardBackLink(backLink);

    return () => {
      backLink && setDashboardBackLink(false);
    };
  }, [backLink, setDashboardBackLink]);

  // Handle sidebar shrink in mount and reset to the pervious state
  // once the page unmount.
  useEffect(() => {
    sidebarShrink && setSidebarShrink();

    return () => {
      sidebarShrink && resetSidebarPreviousExpand();
    };
  }, [resetSidebarPreviousExpand, sidebarShrink, setSidebarShrink]);

  return (
    <div className={CLASSES.DASHBOARD_PAGE}>
      <Suspense fallback={''}>
        <Component />
      </Suspense>
    </div>
  );
}

export default compose(withDashboardActions)(DashboardPage);
