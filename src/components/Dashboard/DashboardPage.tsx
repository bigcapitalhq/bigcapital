// @ts-nocheck
import React, { useEffect, Suspense } from 'react';
import { CLASSES } from '@/constants/classes';
import withDashboardActions from '@/containers/Dashboard/withDashboardActions';
import { compose } from '@/utils';
import { Spinner } from '@blueprintjs/core';

import withUniversalSearchActions from '@/containers/UniversalSearch/withUniversalSearchActions';

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
  defaultSearchResource,

  // #withDashboardActions
  changePageTitle,
  setDashboardBackLink,
  changePageHint,
  toggleSidebarExpand,

  // #withUniversalSearch
  setResourceTypeUniversalSearch,
  resetResourceTypeUniversalSearch,
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
    };
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
  }, [toggleSidebarExpand, sidebarExpand]);

  useEffect(() => {
    if (defaultSearchResource) {
      setResourceTypeUniversalSearch(defaultSearchResource);
    }
    return () => {
      resetResourceTypeUniversalSearch();
    };
  }, [
    defaultSearchResource,
    resetResourceTypeUniversalSearch,
    setResourceTypeUniversalSearch,
  ]);

  return (
    <div className={CLASSES.DASHBOARD_PAGE}>
      <Suspense
        fallback={
          <div class="dashboard__fallback-loading">
            <Spinner size={40} value={null} />
          </div>
        }
      >
        <Component />
      </Suspense>
    </div>
  );
}

export default compose(
  withDashboardActions,
  // withUniversalSearch,
  withUniversalSearchActions,
)(DashboardPage);
