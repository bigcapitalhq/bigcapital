import React from 'react';

import ProfitLossSheetTable from './ProfitLossSheetTable';
import { FinancialReportBody } from '../FinancialReportPage';

import withCurrentOrganization from '../../Organization/withCurrentOrganization';
import { useProfitLossSheetContext } from './ProfitLossProvider';

import { compose } from 'utils';

/**
 * @returns {React.JSX}
 */
function ProfitLossBodyJSX({
  // #withPreferences
  organizationName,
}) {
  const { isLoading } = useProfitLossSheetContext();

  return (
    <FinancialReportBody>
      {isLoading ? (
        'loading'
      ) : (
        <ProfitLossSheetTable companyName={organizationName} />
      )}
    </FinancialReportBody>
  );
}

export const ProfitLossBody = compose(
  withCurrentOrganization(({ organization }) => ({
    organizationName: organization.name,
  })),
)(ProfitLossBodyJSX);
