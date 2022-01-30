import React from 'react';
import styled from 'styled-components';
import { ContextMenu2 } from '@blueprintjs/popover2';

import WarehousesGridItems from './WarehousesGridItems';
import { WarehouseContextMenu } from './components';
import withAlertsActions from '../../Alert/withAlertActions';
import withDialogActions from '../../Dialog/withDialogActions';
import { compose } from 'utils';

const WAREHOUSE = [
  {
    title: 'Warehouse #1',
    code: '1001',
    city: 'City',
    email: 'email@emial.com',
    phone: '09xxxxxxxx',
  },
  {
    title: 'Warehouse #2',
    code: '100',
    city: 'City',
    email: 'email@emial.com',
    phone: '09xxxxxxxx',
  },
  {
    title: 'Warehouse #2',
    code: '100',
    city: 'City',
    email: 'email@emial.com',
    phone: '09xxxxxxxx',
  },
];

/**
 * Warehouses.
 * @returns
 */
function Warehouses({
  // #withAlertsActions
  openAlert,
  // #withDialogActions
  openDialog,
}) {
  return (
    <ContextMenu2 content={<WarehouseContextMenu />}>
      <WarehouseGridWrap>
        <WarehousesGridItems warehouses={WAREHOUSE} />
      </WarehouseGridWrap>
    </ContextMenu2>
  );
}

export default compose(withAlertsActions, withDialogActions)(Warehouses);

const WarehouseGridWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 15px;
`;
