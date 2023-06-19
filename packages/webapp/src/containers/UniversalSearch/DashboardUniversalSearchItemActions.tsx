// @ts-nocheck
import React from 'react';
import * as R from 'ramda';

import withUniversalSearch from './withUniversalSearch';

import { getUniversalSearchItemsActions } from './utils';
import withUniversalSearchActions from './withUniversalSearchActions';

/**
 * Universal search selected item action based on each resource type.
 */
function DashboardUniversalSearchItemActions({
  searchSelectedResourceType,
  searchSelectedResourceId,

  // #with
  resetSelectedItemUniversalSearch,
}) {
  const components = getUniversalSearchItemsActions();

  // Handle action execution.
  const handleActionExec = React.useCallback(() => {
    resetSelectedItemUniversalSearch();
  }, [resetSelectedItemUniversalSearch]);

  return components.map((COMPONENT) => (
    <COMPONENT
      resourceId={searchSelectedResourceId}
      resourceType={searchSelectedResourceType}
      onAction={handleActionExec}
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
  withUniversalSearchActions,
)(DashboardUniversalSearchItemActions);
