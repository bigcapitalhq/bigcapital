// @ts-nocheck
import React from 'react';

import { CommercialDocBox } from '@/components';

import EstimateDetailHeader from './EstimateDetailHeader';
import EstimateDetailTable from './EstimateDetailTable';
import EstimateDetailTableFooter from './EstimateDetailTableFooter';
import EstimateDetailFooter from './EstimateDetailFooter';


export default function EstimateDetailTab() {
  return (
    <CommercialDocBox>
      <EstimateDetailHeader />
      <EstimateDetailTable />
      <EstimateDetailTableFooter />
      <EstimateDetailFooter />
    </CommercialDocBox>
  );
}
