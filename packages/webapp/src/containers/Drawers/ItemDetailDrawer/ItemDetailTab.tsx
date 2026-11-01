import { Tab } from '@blueprintjs/core';
import React from 'react';
import { ItemDetailHeader } from './ItemDetailHeader';
import { ItemPaymentTransactions } from './ItemPaymentTransactions';
import { WarehouseLocationsTable as WarehousesLocationsTable } from './WarehousesLocations';
import { DrawerMainTabs, FormattedMessage as T } from '@/components';
import { Features } from '@/constants';
import { useFeatureCan } from '@/hooks/state';

export function ItemDetailTab() {
  const { featureCan } = useFeatureCan();

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
      {featureCan(Features.Warehouses) && (
        <Tab
          id={'warehouses'}
          title={<T id={'warehouse_locations.label'} />}
          panel={<WarehousesLocationsTable />}
        />
      )}
    </DrawerMainTabs>
  );
}
