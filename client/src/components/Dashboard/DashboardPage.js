import React, { useEffect, Suspense } from 'react';
import { isUndefined } from 'lodash';
import { CLASSES } from 'common/classes';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import { compose } from 'utils';
import { Spinner } from '@blueprintjs/core';

/**
 * Dashboard pages wrapper.
 */
function DashboardPage({
  // #ownProps
  pageTitle,
  backLink,
  sidebarExpand = true,
  Component,
  name,
  hint,

  // #withDashboardActions
  changePageTitle,
  setDashboardBackLink,
  changePageHint,
  toggleSidebarExpand
}) {
  // Hydrate the given page title.
  useEffect(() => {
    pageTitle && changePageTitle(pageTitle);

    return () => {
      pageTitle && changePageTitle('');
    };
  });

  // Hydrate the given page hint.
  useEffect(() => {
    hint && changePageHint(hint);

    return () => {
      hint && changePageHint('');
    }
  }, [hint, changePageHint]);

  // Hydrate the dashboard back link status.
  useEffect(() => {
    backLink && setDashboardBackLink(backLink);

    return () => {
      backLink && setDashboardBackLink(false);
    };
  }, [backLink, setDashboardBackLink]);

  useEffect(() => {
    const className = `page-${name}`;
    name && document.body.classList.add(className);
    
    return () => {
      name && document.body.classList.remove(className);
    };
  }, [name]);

  useEffect(() => {
    toggleSidebarExpand(sidebarExpand);
  }, [toggleSidebarExpand, sidebarExpand])

  return (
    <div className={CLASSES.DASHBOARD_PAGE}>
      <Suspense fallback={
        <div class="dashboard__fallback-loading">
          <Spinner size={40} value={null} />
        </div>
      }>
        <Component />
      </Suspense>
    </div>
  );
}

export default compose(
  withDashboardActions,
)(DashboardPage);
