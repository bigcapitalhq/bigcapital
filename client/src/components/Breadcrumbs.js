import React from 'react';
import { NavLink } from 'react-router-dom';
import routes from 'routes/dashboard';
import withBreadcrumbs from 'react-router-breadcrumbs-hoc';

const PureBreadcrumbs = ({ breadcrumbs }) => (
  <div>
    {breadcrumbs.map(({ breadcrumb, path, match }) => (
      <span key={path}>
        <NavLink to={match.url}>{breadcrumb}</NavLink>
        <span>/</span>
      </span>
    ))}
  </div>
);
  
export default withBreadcrumbs(routes)(PureBreadcrumbs);
