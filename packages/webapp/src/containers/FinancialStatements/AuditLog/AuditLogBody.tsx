// @ts-nocheck
import React from 'react';
import { Spinner } from '@blueprintjs/core';
import { FinancialReportBody } from '../FinancialReportPage';
import { useAuditLogContext } from './AuditLogProvider';
import AuditLogTable from './AuditLogTable';

/**
 * Audit Log Body
 */
function AuditLogBody() {
  const { isLoading } = useAuditLogContext();

  return (
    <FinancialReportBody>
      {isLoading ? (
        <div style={{ padding: 20 }}>
          <Spinner size={24} />
        </div>
      ) : (
        <AuditLogTable />
      )}
    </FinancialReportBody>
  );
}

export { AuditLogBody };
