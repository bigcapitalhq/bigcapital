import React from 'react';
import { FinancialReportBody } from '../FinancialReportPage';
import { useBalanceSheetContext } from './BalanceSheetProvider';
import { BalanceSheetTable } from './BalanceSheetTable';
import { FinancialSheetSkeleton } from '@/components';
import { useCurrentOrganizationName } from '@/hooks/query';

function BalanceSheetBodyJSX() {
  const organizationName = useCurrentOrganizationName();
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

export const BalanceSheetBody = BalanceSheetBodyJSX;
