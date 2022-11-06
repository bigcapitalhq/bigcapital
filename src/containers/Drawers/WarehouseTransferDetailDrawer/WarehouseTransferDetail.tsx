// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { Tab } from '@blueprintjs/core';
import { DrawerMainTabs } from '@/components';

import WarehouseTransferDetailPanel from './WarehouseTransferDetailPanel';
import WarehouseTransferDetailActionsBar from './WarehouseTransferDetailActionsBar';

/**
 * Warehouse transfer view detail.
 * @returns {React.JSX}
 */
export default function WarehouseTransferDetail() {
  return (
    <WarehouseTransferRoot>
      <WarehouseTransferDetailActionsBar />
      <WarehouseTransferDetailsTabs />
    </WarehouseTransferRoot>
  );
}

/**
 * Warehouse transfer details tabs.
 * @returns {React.JSX}
 */
function WarehouseTransferDetailsTabs() {
  return (
    <DrawerMainTabs>
      <Tab
        title={intl.get('details')}
        id={'details'}
        panel={<WarehouseTransferDetailPanel />}
      />
    </DrawerMainTabs>
  );
}

const WarehouseTransferRoot = styled.div``;
