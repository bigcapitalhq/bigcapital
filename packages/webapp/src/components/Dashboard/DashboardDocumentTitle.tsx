import * as FF from 'fp-ts/function';
import { Helmet } from 'react-helmet';
import { App } from '@/constants/app';
import { withDashboard } from '@/containers/Dashboard/withDashboard';

interface DashboardDocumentTitleProps {
  pageTitle: string;
  preferencesPageTitle: string;
}

/**
 * Syncs the browser tab title with the current dashboard page title.
 */
function DashboardDocumentTitle({
  pageTitle,
  preferencesPageTitle,
}: DashboardDocumentTitleProps) {
  const currentTitle = pageTitle || preferencesPageTitle;
  const documentTitle = currentTitle
    ? `${currentTitle} | ${App.app_name}`
    : App.app_name;

  return (
    <Helmet>
      <title>{documentTitle}</title>
    </Helmet>
  );
}

export default FF.pipe(
  DashboardDocumentTitle,
  withDashboard(({ pageTitle, preferencesPageTitle }) => ({
    pageTitle,
    preferencesPageTitle,
  })),
);
