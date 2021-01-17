import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import classNames from 'classnames';
import { CLASSES } from 'common/classes';

import PreferencesTopbar from 'components/Preferences/PreferencesTopbar';
import PreferencesContentRoute from 'components/Preferences/PreferencesContentRoute';
import DashboardErrorBoundary from 'components/Dashboard/DashboardErrorBoundary';
import PreferencesSidebar from 'components/Preferences/PreferencesSidebar';

import 'style/pages/Preferences/Page.scss';

/**
 * Preferences page.
 */
export default function PreferencesPage() {
  return (
    <ErrorBoundary FallbackComponent={DashboardErrorBoundary}>
      <div className={classNames(
        CLASSES.DASHBOARD_CONTENT,
        CLASSES.DASHBOARD_CONTENT_PREFERENCES,
      )}>
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
