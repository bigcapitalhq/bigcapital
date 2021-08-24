import React from 'react';
import EstimateDetailActionsBar from './EstimateDetailActionsBar';
import EstimateDetailHeader from './EstimateDetailHeader';
import EstimateDetailTable from './EstimateDetailTable';

export default function EstimateDetailTab() {
  return (
    <div>
      <EstimateDetailActionsBar />
      <EstimateDetailHeader />
      <EstimateDetailTable />
    </div>
  );
}
