import React from 'react';
import withBreadcrumbs from 'react-router-breadcrumbs-hoc';
import { useHistory } from 'react-router-dom';
import type { DashboardBreadcrumbItem } from './DashboardBreadcrumbs';
import { If, Icon } from '@/components';
import { FormattedMessage as T } from '@/components';
import { withDashboard } from '@/containers/Dashboard/withDashboard';
import { compose } from '@/utils';

interface DashboardBackLinkProps {
  dashboardBackLink: boolean | string;
  breadcrumbs: DashboardBreadcrumbItem[];
}

function DashboardBackLink({
  dashboardBackLink,
  breadcrumbs,
}: DashboardBackLinkProps) {
  const history = useHistory();
  const crumb = breadcrumbs[breadcrumbs.length - 2];

  const handleClick = (event: React.MouseEvent) => {
    const url =
      typeof dashboardBackLink === 'string'
        ? dashboardBackLink
        : crumb?.match.url;
    if (url) {
      history.push(url);
    }
    event.preventDefault();
  };

  return (
    <If condition={!!(dashboardBackLink && crumb)}>
      <div className="dashboard__back-link">
        <a href="#no-link" onClick={handleClick}>
          <Icon icon={'arrow-left'} iconSize={18} /> <T id={'back_to_list'} />
        </a>
      </div>
    </If>
  );
}

export default compose(
  withBreadcrumbs([]),
  withDashboard(({ dashboardBackLink }) => ({
    dashboardBackLink,
  })),
)(DashboardBackLink);
