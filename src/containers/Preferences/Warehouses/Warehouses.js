import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';

import { useWarehousesContext } from './WarehousesProvider';
import WarehousesGridItems from './WarehousesGridItems';

/**
 * Warehouses.
 * @returns
 */
export default function Warehouses() {
  const { warehouses } = useWarehousesContext();

  return warehouses.map((warehouse) => (
    <WarehousesGridItems warehouse={warehouse} />
  ));
}
