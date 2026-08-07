import { Spinner } from '@blueprintjs/core';
import React, { useEffect, Suspense } from 'react';
import type { WithDashboardActionsProps } from '@/containers/Dashboard/withDashboardActions';
import type { WithUniversalSearchActionsProps } from '@/containers/UniversalSearch/withUniversalSearchActions';
import { CLASSES } from '@/constants/classes';
import { withDashboardActions } from '@/containers/Dashboard/withDashboardActions';
import { withUniversalSearchActions } from '@/containers/UniversalSearch/withUniversalSearchActions';
import { compose } from '@/utils';

interface DashboardPageOwnProps {
  pageTitle?: string;
  backLink?: boolean | string;
  sidebarExpand?: boolean;
  Component: React.ComponentType;
  name?: string;
  hint?: string;
  defaultSearchResource?: string;
}

type DashboardPageProps = DashboardPageOwnProps &
  WithDashboardActionsProps &
  WithUniversalSearchActionsProps;

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
}: DashboardPageProps) {
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
          <div className="dashboard__fallback-loading">
            <Spinner size={40} />
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
  withUniversalSearchActions,
)(DashboardPage);
