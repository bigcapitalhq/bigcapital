import React from 'react';
import { FinancialLoadingBar } from '../FinancialLoadingBar';
import { useAuditLogContext } from './AuditLogProvider';

/**
 * Audit Log Loading Bar
 */
export function AuditLogLoadingBar() {
  const { isFetching, isFetchingNextPage } = useAuditLogContext();

  if (!isFetching || isFetchingNextPage) return null;
  return (
    <div className={'financial-progressbar'}>
      <FinancialLoadingBar />
    </div>
  );
}
