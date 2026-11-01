import { VendorCreditDetailDrawerFooter } from './VendorCreditDetailDrawerFooter';
import { VendorCreditDetailFooter } from './VendorCreditDetailFooter';
import { VendorCreditDetailHeader } from './VendorCreditDetailHeader';
import { VendorCreditDetailTable } from './VendorCreditDetailTable';
import { CommercialDocBox } from '@/components';

/**
 * Vendor credit details panel.
 * @returns {React.JSX}
 */
export function VendorCreditDetailPanel() {
  return (
    <CommercialDocBox>
      <VendorCreditDetailHeader />
      <VendorCreditDetailTable />
      <VendorCreditDetailDrawerFooter />
      <VendorCreditDetailFooter />
    </CommercialDocBox>
  );
}
