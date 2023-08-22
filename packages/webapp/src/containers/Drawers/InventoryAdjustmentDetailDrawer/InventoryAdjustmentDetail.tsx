// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { Tab } from '@blueprintjs/core';

import { DrawerMainTabs } from '@/components';
import InventoryAdjustmentDetailTab from './InventoryAdjustmentDetailTab';
import InventoryAdjustmentDetailActionsBar from './InventoryAdjustmentDetailActionsBar';
import InventoryAdjustmentDetailGLEntriesPanel from './InventoryAdjustmentDetailGLEntriesPanel';

/**
 * Inventory adjustment detail
 * @returns {React.JSX}
 */
export default function InventoryAdjustmentDetail() {
  return (
    <InventoryAdjustmentDetailsRoot>
      <InventoryAdjustmentDetailActionsBar />
      <InventoryAdjustmentDetailTabs />
    </InventoryAdjustmentDetailsRoot>
  );
}

/**
 * Invenoty adjustment details tabs.
 * @returns {React.JSX}
 */
function InventoryAdjustmentDetailTabs() {
  return (
    <DrawerMainTabs
      renderActiveTabPanelOnly={true}
      defaultSelectedTabId="details"
    >
      <Tab
        title={intl.get('details')}
        id={'details'}
        panel={<InventoryAdjustmentDetailTab />}
      />
      <Tab
        title={intl.get('journal_entries')}
        id={'journal_entries'}
        panel={<InventoryAdjustmentDetailGLEntriesPanel />}
      />
    </DrawerMainTabs>
  );
}

const InventoryAdjustmentDetailsRoot = styled.div``;
