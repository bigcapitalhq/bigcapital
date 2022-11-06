// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';

import '@/style/pages/Preferences/warehousesList.scss';

import WarehousesGrid from './WarehousesGrid';
import withDashboardActions from '@/containers/Dashboard/withDashboardActions';
import { compose } from '@/utils';

/**
 * Warehouses.
 * @returns
 */
function Warehouses({
  // #withDashboardActions
  changePreferencesPageTitle,
}) {
  React.useEffect(() => {
    changePreferencesPageTitle(intl.get('warehouses.label'));
  }, [changePreferencesPageTitle]);

  return (
    <React.Fragment>
      <WarehousesGrid />
    </React.Fragment>
  );
}
export default compose(withDashboardActions)(Warehouses);
