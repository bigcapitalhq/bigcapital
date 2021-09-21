import React from 'react';
import { Tab } from '@blueprintjs/core';
import intl from 'react-intl-universal';
import { DrawerMainTabs } from 'components';

import EstimateDetailPanel from './EstimateDetailPanel';
import clsx from 'classnames';

import EstimateDetailsCls from 'style/components/Drawers/EstimateDetails.module.scss';

/**
 * Estimate view detail
 */
export default function EstimateDetail() {
  return (
    <div className={clsx(EstimateDetailsCls.root)}>
      <DrawerMainTabs>
        <Tab
          title={intl.get('details')}
          id={'details'}
          panel={<EstimateDetailPanel />}
        />
      </DrawerMainTabs>
    </div>
  );
}
