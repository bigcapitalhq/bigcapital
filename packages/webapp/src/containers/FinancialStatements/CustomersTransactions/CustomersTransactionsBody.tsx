import * as R from 'ramda';
import {
  withCurrentOrganization,
  WithCurrentOrganizationProps,
} from '@/containers/Organization/withCurrentOrganization';
import { CustomersTransactionsTable } from './CustomersTransactionsTable';
import { FinancialReportBody } from '../FinancialReportPage';
import { FinancialSheetSkeleton } from '@/components/FinancialSheet';
import { useCustomersTransactionsContext } from './CustomersTransactionsProvider';
import { flow } from 'fp-ts/function';

interface CustomersTransactionsBodyProps {
  organizationName: WithCurrentOrganizationProps['organization']['name'];
}

/**
 * Customers transactions body.
 */
function CustomersTransactionsBodyJSX({
  // #withCurrentOrganization
  organizationName,
}: CustomersTransactionsBodyProps) {
  const { isCustomersTransactionsLoading } = useCustomersTransactionsContext();

  return (
    <FinancialReportBody>
      {isCustomersTransactionsLoading ? (
        <FinancialSheetSkeleton />
      ) : (
        <CustomersTransactionsTable companyName={organizationName} />
      )}
    </FinancialReportBody>
  );
}

export const CustomersTransactionsBody = flow(
  withCurrentOrganization(({ organization }) => ({
    organizationName: organization.name,
  })),
)(CustomersTransactionsBodyJSX);
