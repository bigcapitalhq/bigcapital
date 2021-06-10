import React from 'react';
import { useHistory } from 'react-router';
import {
  Navbar,
  NavbarGroup,
  NavbarDivider,
  Button,
  Classes,
  Tooltip,
  Position,
} from '@blueprintjs/core';
import { FormattedMessage as T } from 'components';

import DashboardTopbarUser from 'components/Dashboard/TopbarUser';
import DashboardBreadcrumbs from 'components/Dashboard/DashboardBreadcrumbs';
import DashboardBackLink from 'components/Dashboard/DashboardBackLink';
import { Icon, Hint, If } from 'components';

import withSearch from 'containers/GeneralSearch/withSearch';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withDashboard from 'containers/Dashboard/withDashboard';
import withSettings from 'containers/Settings/withSettings';

import QuickNewDropdown from 'containers/QuickNewDropdown/QuickNewDropdown';
import { compose } from 'utils';

/**
 * Dashboard topbar.
 */
function DashboardTopbar({
  // #withDashboard
  pageTitle,
  editViewId,
  pageHint,

  // #withDashboardActions
  toggleSidebarExpand,

  // #withDashboard
  sidebarExpended,

  // #withSettings
  organizationName,

  // #withGlobalSearch
  openGlobalSearch,
}) {
  const history = useHistory();

  const handlerClickEditView = () => {
    history.push(`/custom_views/${editViewId}/edit`);
  };

  const handleSidebarToggleBtn = () => {
    toggleSidebarExpand();
  };

  return (
    <div class="dashboard__topbar">
      <div class="dashboard__topbar-left">
        <div class="dashboard__topbar-sidebar-toggle">
          <Tooltip
            content={
              !sidebarExpended ? (
                <T id={'open_sidebar'} />
              ) : (
                <T id={'close_sidebar'} />
              )
            }
            position={Position.RIGHT}
          >
            <Button minimal={true} onClick={handleSidebarToggleBtn}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                role="img"
                focusable="false"
              >
                <title>
                  <T id={'menu'} />
                </title>
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-miterlimit="5"
                  stroke-width="2"
                  d="M4 7h15M4 12h15M4 17h15"
                ></path>
              </svg>
            </Button>
          </Tooltip>
        </div>

        <div class="dashboard__title">
          <h1>{pageTitle}</h1>

          <If condition={pageHint}>
            <div class="dashboard__hint">
              <Hint content={pageHint} />
            </div>
          </If>

          <If condition={editViewId}>
            <Button
              className={Classes.MINIMAL + ' button--view-edit'}
              icon={<Icon icon="pen" iconSize={13} />}
              onClick={handlerClickEditView}
            />
          </If>
        </div>

        <div class="dashboard__breadcrumbs">
          <DashboardBreadcrumbs />
        </div>

        <DashboardBackLink />
      </div>

      <div class="dashboard__topbar-right">
        <Navbar class="dashboard__topbar-navbar">
          <NavbarGroup>
            <Button
              onClick={() => openGlobalSearch(true)}
              className={Classes.MINIMAL}
              icon={<Icon icon={'search-24'} iconSize={20} />}
              text={<T id={'quick_find'} />}
            />
            <QuickNewDropdown />
            <Tooltip
              content={<T id={'notifications'} />}
              position={Position.BOTTOM}
            >
              <Button
                className={Classes.MINIMAL}
                icon={<Icon icon={'notification-24'} iconSize={20} />}
              />
            </Tooltip>
            <Button
              className={Classes.MINIMAL}
              icon={<Icon icon={'help-24'} iconSize={20} />}
              text={<T id={'help'} />}
            />
            <NavbarDivider />
          </NavbarGroup>
        </Navbar>

        <div class="dashboard__topbar-user">
          <DashboardTopbarUser />
        </div>
      </div>
    </div>
  );
}

export default compose(
  withSearch,
  withDashboard(({ pageTitle, pageHint, editViewId, sidebarExpended }) => ({
    pageTitle,
    editViewId,
    sidebarExpended,
    pageHint,
  })),
  withSettings(({ organizationSettings }) => ({
    organizationName: organizationSettings.name,
  })),
  withDashboardActions,
)(DashboardTopbar);
