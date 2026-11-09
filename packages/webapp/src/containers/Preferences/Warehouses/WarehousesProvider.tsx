import classNames from 'classnames';
import { isEmpty } from 'lodash';
import React, { createContext } from 'react';
import type { Warehouse } from '@bigcapital/sdk-ts';
import { Features } from '@/constants';
import { CLASSES } from '@/constants/classes';
import { useWarehouses } from '@/hooks/query';
import { useFeatureCan } from '@/hooks/state';

interface WarehousesContextValue {
  warehouses: Warehouse[];
  isWarehouesLoading: boolean;
  isEmptyStatus: boolean;
}

const WarehousesContext = createContext<WarehousesContextValue>(
  {} as WarehousesContextValue,
);

interface WarehousesProviderProps {
  query?: Record<string, unknown>;
  children?: React.ReactNode;
}

function WarehousesProvider({ query, ...props }: WarehousesProviderProps) {
  const { featureCan } = useFeatureCan();
  const isWarehouseFeatureCan = featureCan(Features.Warehouses);

  const { data: warehouses, isLoading: isWarehouesLoading } = useWarehouses(
    query,
    { enabled: isWarehouseFeatureCan },
  );

  const warehousesList = (warehouses ?? []) as Warehouse[];
  const isEmptyStatus = isEmpty(warehousesList) || !isWarehouseFeatureCan;

  const provider: WarehousesContextValue = {
    warehouses: warehousesList,
    isWarehouesLoading,
    isEmptyStatus,
  };

  return (
    <div
      className={classNames(
        CLASSES.PREFERENCES_PAGE_INSIDE_CONTENT,
        CLASSES.PREFERENCES_PAGE_INSIDE_CONTENT_WAREHOUSES,
      )}
    >
      <React.Fragment>
        <WarehousesContext.Provider value={provider} {...props} />
      </React.Fragment>
    </div>
  );
}

const useWarehousesContext = () => React.useContext(WarehousesContext);

export { WarehousesProvider, useWarehousesContext };
