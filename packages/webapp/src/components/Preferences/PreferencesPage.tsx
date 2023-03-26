// @ts-nocheck
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import classNames from 'classnames';
import * as R from 'ramda';

import { CLASSES } from '@/constants/classes';

import PreferencesTopbar from '@/components/Preferences/PreferencesTopbar';
import PreferencesContentRoute from '@/components/Preferences/PreferencesContentRoute';
import DashboardErrorBoundary from '@/components/Dashboard/DashboardErrorBoundary';
import PreferencesSidebar from '@/components/Preferences/PreferencesSidebar';

import withDashboardActions from '@/containers/Dashboard/withDashboardActions';

import '@/style/pages/Preferences/Page.scss';

/**
 * Preferences page.
 */
function PreferencesPage({ toggleSidebarExpand }) {
  // Shrink the dashboard sidebar once open application preferences page.
  React.useEffect(() => {
    toggleSidebarExpand(false);
  }, [toggleSidebarExpand]);

  return (
    <ErrorBoundary FallbackComponent={DashboardErrorBoundary}>
      <div
        id={'dashboard'}
        className={classNames(
          CLASSES.DASHBOARD_CONTENT,
          CLASSES.DASHBOARD_CONTENT_PREFERENCES,
        )}
      >
        <div className={classNames(CLASSES.PREFERENCES_PAGE)}>
          <PreferencesSidebar />

          <div className={CLASSES.PREFERENCES_PAGE_CONTENT}>
            <PreferencesTopbar pageTitle={'asdad'} />
            <PreferencesContentRoute />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default R.compose(withDashboardActions)(PreferencesPage);
