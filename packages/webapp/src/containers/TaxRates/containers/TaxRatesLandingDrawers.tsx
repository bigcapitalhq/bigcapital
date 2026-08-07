import { DRAWERS } from '@/constants/drawers';
import { TaxRateDetailsDrawer } from '@/containers/TaxRates/drawers/TaxRateDetailsDrawer/TaxRateDetailsDrawer';

export function TaxRatesLandingDrawers() {
  return (
    <>
      <TaxRateDetailsDrawer name={DRAWERS.TAX_RATE_DETAILS} />
    </>
  );
}
