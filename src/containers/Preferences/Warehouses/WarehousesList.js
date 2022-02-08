import React from 'react';
import styled from 'styled-components';
import intl from 'react-intl-universal';

import '../../../style/pages/Preferences/warehousesList.scss';
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

  // if (type) {
  //   return <WarehousesEmptyStatus />;
  // }

  return (
    <WarehousesListRoot>
      <Warehouses />
    </WarehousesListRoot>
  );
}

export default compose(withDashboardActions)(WarehousesList);

const WarehousesListRoot = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 15px;
`;
