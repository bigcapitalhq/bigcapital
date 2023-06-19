// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { CLASSES } from '@/constants/classes';
import { useWarehouses } from '@/hooks/query';
import { isEmpty } from 'lodash';

import { Features } from '@/constants';
import { useFeatureCan } from '@/hooks/state';

const WarehousesContext = React.createContext();

/**
 * Warehouses data provider.
 */
function WarehousesProvider({ query, ...props }) {
  // Features guard.
  const { featureCan } = useFeatureCan();
  const isWarehouseFeatureCan = featureCan(Features.Warehouses);

  // Fetch warehouses list.
  const { data: warehouses, isLoading: isWarehousesLoading } = useWarehouses(
    query,
    { enabled: isWarehouseFeatureCan },
  );

  // Determines the datatable empty status.
  const isEmptyStatus = isEmpty(warehouses) || !isWarehouseFeatureCan;

  // Provider state.
  const provider = {
    warehouses,
    isWarehousesLoading,
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

const WarehousePreference = styled.div``;
