import React from 'react';
import * as R from 'ramda';

import withUniversalSearch from './withUniversalSearch';

import { getUniversalSearchItemsActions } from './utils';

/**
 * Universal search selected item action based on each resource type.
 */
function DashboardUniversalSearchItemActions({
  searchSelectedResourceType,
  searchSelectedResourceId,
}) {
  const components = getUniversalSearchItemsActions();

  return components.map((COMPONENT) => (
    <COMPONENT
      resourceId={searchSelectedResourceId}
      resourceType={searchSelectedResourceType}
    />
  ));
}

export default R.compose(
  withUniversalSearch(
    ({ searchSelectedResourceType, searchSelectedResourceId }) => ({
      searchSelectedResourceType,
      searchSelectedResourceId,
    }),
  ),
)(DashboardUniversalSearchItemActions);
