import { FinancialReportBody } from '../FinancialReportPage';
import { useInventorySummaryContext } from './InventorySummaryProvider';
import { InventorySummaryTable } from './InventorySummaryTable';
import { FinancialSheetSkeleton } from '@/components/FinancialSheet';
import { useCurrentOrganizationName } from '@/hooks/query';

/**
 * Inventory summary body.
 */
function InventorySummaryBodyJSX() {
  const organizationName = useCurrentOrganizationName();
  const { isLoading } = useInventorySummaryContext();

  return (
    <FinancialReportBody>
      {isLoading ? (
        <FinancialSheetSkeleton />
      ) : (
        <InventorySummaryTable companyName={organizationName} />
      )}
    </FinancialReportBody>
  );
}

export const InventorySummaryBody = InventorySummaryBodyJSX;
