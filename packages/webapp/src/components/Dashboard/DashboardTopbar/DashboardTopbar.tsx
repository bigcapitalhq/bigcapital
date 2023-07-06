// @ts-nocheck
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
import { FormattedMessage as T, Icon, Hint, If } from '@/components';

import DashboardTopbarUser from '@/components/Dashboard/TopbarUser';
import DashboardBreadcrumbs from '@/components/Dashboard/DashboardBreadcrumbs';
import DashboardBackLink from '@/components/Dashboard/DashboardBackLink';

import withUniversalSearchActions from '@/containers/UniversalSearch/withUniversalSearchActions';
import withDashboardActions from '@/containers/Dashboard/withDashboardActions';
import withDashboard from '@/containers/Dashboard/withDashboard';

import QuickNewDropdown from '@/containers/QuickNewDropdown/QuickNewDropdown';
import { DashboardHamburgerButton, DashboardQuickSearchButton } from './_components';
import { compose } from '@/utils';

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
    <div class="dashboard__topbar" data-testId={'dashboard-topbar'}>
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
            <DashboardHamburgerButton onClick={handleSidebarToggleBtn} />
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
            <DashboardQuickSearchButton
              onClick={() => openGlobalSearch(true)}
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
  withUniversalSearchActions,
  withDashboard(({ pageTitle, pageHint, editViewId, sidebarExpended }) => ({
    pageTitle,
    editViewId,
    sidebarExpended,
    pageHint,
  })),
  withDashboardActions,
)(DashboardTopbar);
