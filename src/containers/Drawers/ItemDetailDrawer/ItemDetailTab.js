import React from 'react';
import { Tab } from '@blueprintjs/core';
import { DrawerMainTabs, FormattedMessage as T } from 'components';
import { ItemPaymentTransactions } from './ItemPaymentTransactions';
import ItemDetailHeader from './ItemDetailHeader';
import WarehousesLocationsTable from './WarehousesLocations';


export default function ItemDetailTab() {
  return (
    <DrawerMainTabs renderActiveTabPanelOnly={true}>
      <Tab
        id={'overview'}
        title={<T id={'overview'} />}
        panel={<ItemDetailHeader />}
      />
      <Tab
        id={'transactions'}
        title={<T id={'transactions'} />}
        panel={<ItemPaymentTransactions />}
      />
      <Tab
        id={'warehouses'}
        title={<T id={'warehouse_locations.label'} />}
        panel={<WarehousesLocationsTable />}
      />
    </DrawerMainTabs>
  );
}
