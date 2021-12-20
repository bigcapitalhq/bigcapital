import React from 'react';

import { CommercialDocBox } from 'components';

import EstimateDetailHeader from './EstimateDetailHeader';
import EstimateDetailTable from './EstimateDetailTable';
import EstimateDetailFooter from './EstimateDetailFooter';

export default function EstimateDetailTab() {
  return (
    <CommercialDocBox>
      <EstimateDetailHeader />
      <EstimateDetailTable />
      <EstimateDetailFooter />
    </CommercialDocBox>
  );
}
