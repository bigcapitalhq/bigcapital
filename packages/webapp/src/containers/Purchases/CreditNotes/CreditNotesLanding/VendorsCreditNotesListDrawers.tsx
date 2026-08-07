import { DRAWERS } from '@/constants/drawers';
import { index as VendorCreditDetailDrawer } from '@/containers/Drawers/VendorCreditDetailDrawer';

export function VendorsCreditNotesListDrawers() {
  return (
    <>
      <VendorCreditDetailDrawer name={DRAWERS.VENDOR_CREDIT_DETAILS} />
    </>
  );
}
