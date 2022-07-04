import React from 'react';
import * as R from 'ramda';

import { FinancialSheetSkeleton } from '@/components';
import { FinancialReportBody } from '../FinancialReportPage';
import TrialBalanceSheetTable from './TrialBalanceSheetTable';

import { useTrialBalanceSheetContext } from './TrialBalanceProvider';
import withCurrentOrganization from '../../Organization/withCurrentOrganization';

/**
 * Trial balance sheet body.
 * @returns {React.JSX}
 */
function TrialBalanceSheetBodyJSX({
  // #withCurrentOrganization
  organizationName,
}) {
  const { isLoading } = useTrialBalanceSheetContext();

  return (
    <FinancialReportBody>
      {isLoading ? (
        <FinancialSheetSkeleton />
      ) : (
        <TrialBalanceSheetTable companyName={organizationName} />
      )}
    </FinancialReportBody>
  );
}

export const TrialBalanceSheetBody = R.compose(
  withCurrentOrganization(({ organization }) => ({
    organizationName: organization.name,
  })),
)(TrialBalanceSheetBodyJSX);
