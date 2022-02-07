import React from 'react';
import intl from 'react-intl-universal';
import Warehouses from './Warehouses';
import WarehousesEmptyStatus from './WarehousesEmptyStatus';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';

import { compose } from 'utils';

function WarehousesList({
  // #withDashboardActions
  changePreferencesPageTitle,
}) {
  React.useEffect(() => {
    changePreferencesPageTitle(intl.get('warehouses.label'));
  }, [changePreferencesPageTitle]);

  // if () {
  //   return <WarehousesEmptyStatus />;
  // }

  return <Warehouses />;
}

export default compose(withDashboardActions)(WarehousesList);
