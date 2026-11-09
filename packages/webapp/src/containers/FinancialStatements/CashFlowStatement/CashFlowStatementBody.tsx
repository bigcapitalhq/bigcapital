import React from 'react';
import { FinancialReportBody } from '../FinancialReportPage';
import { useCashFlowStatementContext } from './CashFlowStatementProvider';
import { CashFlowStatementTable } from './CashFlowStatementTable';
import { FinancialSheetSkeleton } from '@/components/FinancialSheet';
import { useCurrentOrganizationName } from '@/hooks/query';

function CashFlowStatementBodyJSX() {
  const organizationName = useCurrentOrganizationName();
  const { isCashFlowLoading } = useCashFlowStatementContext();

  return (
    <FinancialReportBody>
      {isCashFlowLoading ? (
        <FinancialSheetSkeleton />
      ) : (
        <CashFlowStatementTable companyName={organizationName} />
      )}
    </FinancialReportBody>
  );
}

export const CashFlowStatementBody = CashFlowStatementBodyJSX;
