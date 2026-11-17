import { Tab } from '@blueprintjs/core';
import React from 'react';
import { useItemDetailDrawerContext } from './ItemDetailDrawerProvider';
import { ItemDetailHeader } from './ItemDetailHeader';
import { ItemPaymentTransactions } from './ItemPaymentTransactions';
import { WarehouseLocationsTable as WarehousesLocationsTable } from './WarehousesLocations';
import { DrawerMainTabs, FormattedMessage as T } from '@/components';
import { Features } from '@/constants';
import { ItemBatchesTable } from '@/ee/batches/containers/ItemBatches';
import { useFeatureCan } from '@/hooks/state';

export function ItemDetailTab() {
  const { featureCan } = useFeatureCan();
  const { item } = useItemDetailDrawerContext();

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
      {featureCan(Features.BatchTracking) && item?.type === 'inventory' && (
        <Tab
          id={'batches'}
          title={<T id={'batch.tab.label'} />}
          panel={<ItemBatchesTable />}
        />
      )}
    </DrawerMainTabs>
  );
}
