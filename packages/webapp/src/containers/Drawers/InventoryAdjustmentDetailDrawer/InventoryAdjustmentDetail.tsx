import { Tab } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { InventoryAdjustmentDetailActionsBar } from './InventoryAdjustmentDetailActionsBar';
import { InventoryAdjustmentDetailGLEntriesPanel } from './InventoryAdjustmentDetailGLEntriesPanel';
import { InventoryAdjustmentDetailTab } from './InventoryAdjustmentDetailTab';
import { DrawerMainTabs } from '@/components';

/**
 * Inventory adjustment detail.
 */
export function InventoryAdjustmentDetail() {
  return (
    <InventoryAdjustmentDetailsRoot>
      <InventoryAdjustmentDetailActionsBar />
      <InventoryAdjustmentDetailTabs />
    </InventoryAdjustmentDetailsRoot>
  );
}

/**
 * Inventory adjustment details tabs.
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
