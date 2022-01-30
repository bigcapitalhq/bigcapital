import React from 'react';

import BalanceSheetTable from './BalanceSheetTable';
import withCurrentOrganization from '../../../containers/Organization/withCurrentOrganization';
import { useBalanceSheetContext } from './BalanceSheetProvider';

import { compose } from 'utils';

/**
 * Balance sheet body JSX.
 * @returns {React.JSX}
 */
function BalanceSheetBodyJSX({
  // #withCurrentOrganization
  organizationName,
}) {
  const { isLoading } = useBalanceSheetContext();

  return isLoading ? (
    'loading'
  ) : (
    <BalanceSheetTable companyName={organizationName} />
  );
}

export const BalanceSheetBody = compose(
  withCurrentOrganization(({ organization }) => ({
    organizationName: organization.name,
  })),
)(BalanceSheetBodyJSX);
