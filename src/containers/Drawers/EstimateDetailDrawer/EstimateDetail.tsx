// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import intl from 'react-intl-universal';
import { Tab } from '@blueprintjs/core';

import { DrawerMainTabs } from '@/components';

import EstimateDetailActionsBar from './EstimateDetailActionsBar';
import EstimateDetailPanel from './EstimateDetailPanel';

/**
 * Estimate details tabs.
 * @returns {React.JSX}
 */
function EstimateDetailsTabs() {
  return (
    <DrawerMainTabs>
      <Tab
        title={intl.get('details')}
        id={'details'}
        panel={<EstimateDetailPanel />}
      />
    </DrawerMainTabs>
  );
}

/**
 * Estimate view detail
 */
export default function EstimateDetail() {
  return (
    <EstimateDetailsRoot>
      <EstimateDetailActionsBar />
      <EstimateDetailsTabs />
    </EstimateDetailsRoot>
  );
}

const EstimateDetailsRoot = styled.div``;
