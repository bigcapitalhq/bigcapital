import React from 'react';
import intl from 'react-intl-universal';

import Warehouses from './Warehouses';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';

import { compose } from 'utils';

/**
 * Warehouses List.
 * @returns
 */
function WarehousesList({
  // #withDashboardActions
  changePreferencesPageTitle,
}) {
  React.useEffect(() => {
    changePreferencesPageTitle(intl.get('warehouses.label'));
  }, [changePreferencesPageTitle]);

  return <Warehouses />;
}

export default compose(withDashboardActions)(WarehousesList);
