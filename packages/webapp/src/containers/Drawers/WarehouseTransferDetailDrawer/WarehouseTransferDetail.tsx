import { Tab } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { WarehouseTransferDetailActionsBar } from './WarehouseTransferDetailActionsBar';
import { WarehouseTransferDetailPanel } from './WarehouseTransferDetailPanel';
import { DrawerMainTabs } from '@/components';

export function WarehouseTransferDetail(): React.ReactElement {
  return (
    <WarehouseTransferRoot>
      <WarehouseTransferDetailActionsBar />
      <WarehouseTransferDetailsTabs />
    </WarehouseTransferRoot>
  );
}

function WarehouseTransferDetailsTabs(): React.ReactElement {
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
