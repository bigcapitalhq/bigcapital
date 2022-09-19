// @ts-nocheck
import React from 'react';

import BalanceSheetTable from './BalanceSheetTable';
import withCurrentOrganization from '@/containers/Organization/withCurrentOrganization';

import { FinancialReportBody } from '../FinancialReportPage';
import { useBalanceSheetContext } from './BalanceSheetProvider';
import { FinancialSheetSkeleton } from '@/components';
import { compose } from '@/utils';

/**
 * Balance sheet body JSX.
 * @returns {React.JSX}
 */
function BalanceSheetBodyJSX({
  // #withCurrentOrganization
  organizationName,
}) {
  const { isLoading } = useBalanceSheetContext();

  return (
    <FinancialReportBody>
      {isLoading ? (
        <FinancialSheetSkeleton />
      ) : (
        <BalanceSheetTable companyName={organizationName} />
      )}
    </FinancialReportBody>
  );
}

export const BalanceSheetBody = compose(
  withCurrentOrganization(({ organization }) => ({
    organizationName: organization.name,
  })),
)(BalanceSheetBodyJSX);
