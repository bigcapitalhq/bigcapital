import { Tab } from '@blueprintjs/core';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { EstimateDetailActionsBar } from './EstimateDetailActionsBar';
import { EstimateDetailTab as EstimateDetailPanel } from './EstimateDetailPanel';
import { DrawerMainTabs } from '@/components';

/**
 * Estimate details tabs.
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
export function EstimateDetail() {
  return (
    <EstimateDetailsRoot>
      <EstimateDetailActionsBar />
      <EstimateDetailsTabs />
    </EstimateDetailsRoot>
  );
}

const EstimateDetailsRoot = styled.div``;
