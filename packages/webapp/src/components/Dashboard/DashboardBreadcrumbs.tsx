import {
  CollapsibleList,
  MenuItem,
  Classes,
  Boundary,
} from '@blueprintjs/core';
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
    <CollapsibleList
      className={Classes.BREADCRUMBS}
      dropdownTarget={<span className={Classes.BREADCRUMBS_COLLAPSED} />}
      collapseFrom={Boundary.START}
      visibleItemCount={0}
    >
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
    </CollapsibleList>
  );
}

export default withBreadcrumbs([])(DashboardBreadcrumbs);
