// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';

import { TableStyle } from '@/constants';
import { ReportDataTable, FinancialSheet } from '@/components';

import { useAPAgingSummaryContext } from './APAgingSummaryProvider';
import { useAPAgingSummaryColumns } from './components';

import { tableRowTypesToClassnames } from '@/utils';

/**
 * AP aging summary table sheet.
 */
export default function APAgingSummaryTable({
  //#ownProps
  organizationName,
}) {
  // AP aging summary report content.
  const {
    APAgingSummary: { tableRows },
    isAPAgingLoading,
  } = useAPAgingSummaryContext();

  // AP aging summary columns.
  const columns = useAPAgingSummaryColumns();

  return (
    <FinancialSheet
      companyName={organizationName}
      sheetType={intl.get('payable_aging_summary')}
      asDate={new Date()}
      loading={isAPAgingLoading}
    >
      <APAgingSummaryDataTable
        columns={columns}
        data={tableRows}
        rowClassNames={tableRowTypesToClassnames}
        noInitialFetch={true}
        sticky={true}
        styleName={TableStyle.Constraint}
      />
    </FinancialSheet>
  );
}

const APAgingSummaryDataTable = styled(ReportDataTable)`
  .table {
    .tbody .tr {
      .td {
        border-bottom: 0;
        padding-top: 0.32rem;
        padding-bottom: 0.32rem;
      }
    }
  }
`;
