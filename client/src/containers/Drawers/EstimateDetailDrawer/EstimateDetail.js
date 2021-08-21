import React from 'react';
import { Tabs, Tab } from '@blueprintjs/core';
import intl from 'react-intl-universal';
import EstimateDetailTab from './EstimateDetailTab';

/**
 * Estimate view detail
 */
export default function EstimateDetail() {
  return (
    <div className="view-detail-drawer">
      <Tabs animate={true} large={true}>
        <Tab
          title={intl.get('details')}
          id={'details'}
          panel={<EstimateDetailTab />}
        />
      </Tabs>
    </div>
  );
}
