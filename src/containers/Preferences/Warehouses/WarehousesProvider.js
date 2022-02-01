import React from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { CLASSES } from 'common/classes';
import { useWarehouses } from 'hooks/query';
import PreferencesPageLoader from '../PreferencesPageLoader';

const WarehousesContext = React.createContext();

/**
 * Warehouses data provider.
 */
function WarehousesProvider({ ...props }) {
  // Fetch warehouses list.
  const { data: warehouses, isLoading: isWarehouesLoading } = useWarehouses();

  // Provider state.
  const provider = {
    warehouses,
    isWarehouesLoading,
  };

  return (
    <div className={classNames(CLASSES.PREFERENCES_PAGE_INSIDE_CONTENT)}>
      <WarehousePreference>
        {isWarehouesLoading ? (
          <PreferencesPageLoader />
        ) : (
          <WarehousesContext.Provider value={provider} {...props} />
        )}
      </WarehousePreference>
    </div>
  );
}

const useWarehousesContext = () => React.useContext(WarehousesContext);

export { WarehousesProvider, useWarehousesContext };

const WarehousePreference = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 15px;
`;
