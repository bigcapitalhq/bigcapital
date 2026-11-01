import { EstimateDetailFooter } from './EstimateDetailFooter';
import { EstimateDetailHeader } from './EstimateDetailHeader';
import { EstimateDetailTable } from './EstimateDetailTable';
import { EstimateDetailTableFooter } from './EstimateDetailTableFooter';
import { CommercialDocBox } from '@/components';

export function EstimateDetailTab() {
  return (
    <CommercialDocBox>
      <EstimateDetailHeader />
      <EstimateDetailTable />
      <EstimateDetailTableFooter />
      <EstimateDetailFooter />
    </CommercialDocBox>
  );
}
