import { Menu, Popover, MenuItem, Classes } from '@blueprintjs/core';
import React from 'react';
import withBreadcrumbs from 'react-router-breadcrumbs-hoc';
import { useHistory } from 'react-router-dom';

export interface DashboardBreadcrumbItem {
  breadcrumb: React.ReactNode;
  match: { url: string };
}

function DashboardBreadcrumbs({
  breadcrumbs,
}: {
  breadcrumbs: React.ReactNode[];
}) {
  const history = useHistory();

  return (
    <Popover
      placement="bottom-start"
      content={
        <Menu>
          {breadcrumbs.map((crumb) => {
            const { breadcrumb, match } =
              crumb as unknown as DashboardBreadcrumbItem;
            return (
              <MenuItem
                key={match.url}
                icon={'folder-close'}
                text={breadcrumb}
                onClick={() => history.push(match.url)}
              />
            );
          })}
        </Menu>
      }
    >
      <button
        type="button"
        aria-label="Breadcrumbs"
        className={Classes.BREADCRUMBS_COLLAPSED}
      />
    </Popover>
  );
}

export default withBreadcrumbs([])(DashboardBreadcrumbs);
