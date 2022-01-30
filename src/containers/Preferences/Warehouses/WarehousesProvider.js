import React from 'react';
import classNames from 'classnames';
import { CLASSES } from 'common/classes';
import styled from 'styled-components';

const WarehousesContext = React.createContext();

/**
 * Warehouses data provider.
 */
function WarehousesProvider({ ...props }) {
  // Provider state.
  const provider = {};

  return (
    <div className={classNames(CLASSES.PREFERENCES_PAGE_INSIDE_CONTENT)}>
      <WarehousesContext.Provider value={provider} {...props} />
    </div>
  );
}

const useWarehousesContext = () => React.useContext(WarehousesContext);

export { WarehousesProvider, useWarehousesContext };
