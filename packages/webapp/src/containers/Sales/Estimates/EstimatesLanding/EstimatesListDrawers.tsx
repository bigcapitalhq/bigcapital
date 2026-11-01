import { DRAWERS } from '@/constants/drawers';
import { index as EstimateDetailDrawer } from '@/containers/Drawers/EstimateDetailDrawer';
import { EstimateSendMailDrawer } from '@/containers/Sales/Estimates/EstimateSendMailDrawer';

export function EstimatesListDrawers() {
  return (
    <>
      <EstimateDetailDrawer name={DRAWERS.ESTIMATE_DETAILS} />
      <EstimateSendMailDrawer name={DRAWERS.ESTIMATE_SEND_MAIL} />
    </>
  );
}
