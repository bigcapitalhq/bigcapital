import React from 'react';
import clsx from 'classnames';

import { Card } from 'components';

import EstimateDetailActionsBar from './EstimateDetailActionsBar';
import EstimateDetailHeader from './EstimateDetailHeader';
import EstimateDetailTable from './EstimateDetailTable';

import EstimateDetailsCls from 'style/components/Drawers/EstimateDetails.module.scss';
import EstimateDetailFooter from './EstimateDetailFooter';

export default function EstimateDetailTab() {
  return (
    <div className={clsx(EstimateDetailsCls.detail_panel)}>
      <EstimateDetailActionsBar />

      <Card>
        <EstimateDetailHeader />
        <EstimateDetailTable />
        <EstimateDetailFooter />
      </Card>
    </div>
  );
}
