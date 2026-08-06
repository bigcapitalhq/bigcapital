import { TaxRatesLandingActionsBar } from '../containers/TaxRatesLandingActionsBar';
import { TaxRatesLandingDrawers } from '../containers/TaxRatesLandingDrawers';
import { TaxRatesLandingProvider } from '../containers/TaxRatesLandingProvider';
import { TaxRatesLandingTable as TaxRatesDataTable } from '../containers/TaxRatesLandingTable';
import { DashboardPageContent } from '@/components';

/**
 * Tax rates landing page.
 * @returns {JSX.Element}
 */
export function TaxRatesLanding() {
  return (
    <TaxRatesLandingProvider>
      <TaxRatesLandingActionsBar />
      <TaxRatesLandingDrawers />

      <DashboardPageContent>
        <TaxRatesDataTable />
      </DashboardPageContent>
    </TaxRatesLandingProvider>
  );
}
