import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';

import { useWarehousesContext } from './WarehousesProvider';
import WarehousesGridItems from './WarehousesGridItems';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';

import { compose } from 'utils';

/**
 * Warehouses.
 * @returns
 */
function Warehouses({
  // #withDashboardActions
  changePreferencesPageTitle,
}) {
  const { warehouses } = useWarehousesContext();

  React.useEffect(() => {
    changePreferencesPageTitle(intl.get('warehouses.label'));
  }, [changePreferencesPageTitle]);

  return warehouses.map((warehouse) => (
    <WarehousesGridItems warehouse={warehouse} />
  ));
}

export default compose(withDashboardActions)(Warehouses);
