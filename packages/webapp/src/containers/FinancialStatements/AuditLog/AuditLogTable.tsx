// @ts-nocheck
import React, { useMemo } from 'react';
import intl from 'react-intl-universal';
import { Spinner } from '@blueprintjs/core';
import styled from 'styled-components';
import {
  FinancialSheet,
  ReportDataTable,
  TableFastCell,
  TableVirtualizedListRows,
  IntersectionObserver,
} from '@/components';
import { TableStyle } from '@/constants';
import { useAuditLogContext } from './AuditLogProvider';

// Dynamic columns for audit log
const useAuditLogTableColumns = () => {
  return useMemo(
    () => [
      {
        Header: intl.get('audit_log.col_time'),
        accessor: 'created_at_formatted',
        width: 180,
        textOverview: true,
      },
      {
        Header: intl.get('audit_log.col_user'),
        accessor: 'user_name',
        width: 150,
        textOverview: true,
      },
      {
        Header: intl.get('audit_log.col_action'),
        accessor: 'action',
        width: 100,
        textOverview: true,
      },
      {
        Header: intl.get('audit_log.col_subject'),
        accessor: 'subject',
        width: 120,
        textOverview: true,
      },
      {
        Header: intl.get('audit_log.col_summary'),
        accessor: 'summary',
        width: 350,
        textOverview: true,
        Cell: ({ value }) => (
          <div
            style={{
              maxWidth: 330,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            title={value || ''}
          >
            {value || ''}
          </div>
        ),
      },
      {
        Header: intl.get('audit_log.col_ip'),
        accessor: 'ip',
        width: 120,
        textOverview: true,
        Cell: ({ value }) => value || '—',
      },
    ],
    []
  );
};

const AuditLogDataTable = styled(ReportDataTable)`
  --color-table-text-color: #252a31;
  --color-table-border-color: #ececec;

  .bp4-dark & {
    --color-table-text-color: var(--color-light-gray1);
    --color-table-border-color: var(--color-dark-gray4);
  }

  .tbody {
    .tr .td {
      padding-top: 0.2rem;
      padding-bottom: 0.2rem;
    }
    .tr:not(.no-results) .td:not(:first-of-type) {
      border-left: 1px solid var(--color-table-border-color);
    }
    .tr:last-child .td {
      border-bottom: 1px solid var(--color-table-border-color);
    }
  }
`;

/**
 * Audit Log Table
 */
function AuditLogTable() {
  const { auditLogs, isLoading, isFetchingNextPage, handleObserverInteract } = useAuditLogContext();
  const columns = useAuditLogTableColumns();

  return (
    <FinancialSheet
      loading={isLoading}
      fullWidth={true}
      currentDate={false}
    >
      <AuditLogDataTable
        noResults={intl.get('audit_log.empty')}
        columns={columns}
        data={auditLogs}
        virtualizedRows={true}
        fixedItemSize={30}
        fixedSizeHeight={1000}
        sticky={true}
        TableRowsRenderer={TableVirtualizedListRows}
        vListrowHeight={28}
        vListOverscanRowCount={2}
        TableCellRenderer={TableFastCell}
        styleName={TableStyle.Constrant}
      />
    </FinancialSheet>
  );
}

export default AuditLogTable;
