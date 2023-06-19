// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';

import { ReportDataTable, FinancialSheet } from '@/components';
import { useSalesByItemsContext } from './SalesByItemProvider';
import { useSalesByItemsTableColumns } from './components';
import { tableRowTypesToClassnames } from '@/utils';
import { TableStyle } from '@/constants';

/**
 * Sales by items data table.
 */
export default function SalesByItemsTable({ companyName }) {
  // Sales by items context.
  const {
    salesByItems: { tableRows, query },
    isLoading,
  } = useSalesByItemsContext();

  // Sales by items table columns.
  const columns = useSalesByItemsTableColumns();

  return (
    <SalesByItemsSheet
      companyName={companyName}
      sheetType={intl.get('sales_by_items')}
      fromDate={query.from_date}
      toDate={query.to_date}
      loading={isLoading}
    >
      <SalesByItemsDataTable
        columns={columns}
        data={tableRows}
        expandable={true}
        expandToggleColumn={1}
        expandColumnSpace={1}
        sticky={true}
        rowClassNames={tableRowTypesToClassnames}
        noResults={intl.get(
          'there_were_no_sales_during_the_selected_date_range',
        )}
        styleName={TableStyle.Constraint}
      />
    </SalesByItemsSheet>
  );
}

const SalesByItemsSheet = styled(FinancialSheet)`
  min-width: 850px;
`;

const SalesByItemsDataTable = styled(ReportDataTable)`
  .table {
    .tbody {
      .tr .td {
        border-bottom: 0;
        padding-top: 0.4rem;
        padding-bottom: 0.4rem;
      }
      .tr.row_type--total .td {
        border-top: 1px solid #bbb;
        font-weight: 500;
        border-bottom: 3px double #000;
      }
    }
  }
`;
