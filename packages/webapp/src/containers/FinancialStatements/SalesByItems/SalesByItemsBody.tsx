import { FinancialReportBody } from '../FinancialReportPage';
import { useSalesByItemsContext } from './SalesByItemProvider';
import { SalesByItemsTable } from './SalesByItemsTable';
import { FinancialSheetSkeleton } from '@/components/FinancialSheet';
import { useCurrentOrganizationName } from '@/hooks/query';

/**
 * Sales by items body.
 */
function SalesByItemsBodyJSX() {
  const organizationName = useCurrentOrganizationName();
  const { isLoading } = useSalesByItemsContext();

  return (
    <FinancialReportBody>
      {isLoading ? (
        <FinancialSheetSkeleton />
      ) : (
        <SalesByItemsTable companyName={organizationName} />
      )}
    </FinancialReportBody>
  );
}

export const SalesByItemsBody = SalesByItemsBodyJSX;
