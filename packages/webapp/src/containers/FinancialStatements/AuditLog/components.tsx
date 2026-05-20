// @ts-nocheck
import React from 'react';
import { useAuditLogContext } from './AuditLogProvider';
import FinancialLoadingBar from '../FinancialLoadingBar';

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
