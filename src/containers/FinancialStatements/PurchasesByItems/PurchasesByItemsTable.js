import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';

import { DataTable, FinancialSheet } from 'components';

import { usePurchaseByItemsContext } from './PurchasesByItemsProvider';
import { usePurchasesByItemsTableColumns } from './components';

import { tableRowTypesToClassnames } from 'utils';
import { TableStyle } from 'common';

/**
 * Purchases by items data table.
 */
export default function PurchasesByItemsTable({ companyName }) {
  // Purchases by items context.
  const {
    purchaseByItems: { tableRows, query },
  } = usePurchaseByItemsContext();

  // Purchases by items table columns.
  const columns = usePurchasesByItemsTableColumns();

  return (
    <PurchasesByItemsSheet
      companyName={companyName}
      sheetType={intl.get('purchases_by_items')}
      fromDate={query.from_date}
      toDate={query.to_date}
    >
      <PurchasesByItemsDataTable
        columns={columns}
        data={tableRows}
        expandable={true}
        expandToggleColumn={1}
        expandColumnSpace={1}
        sticky={true}
        rowClassNames={tableRowTypesToClassnames}
        noResults={intl.get(
          'there_were_no_purchases_during_the_selected_date_range',
        )}
        styleName={TableStyle.Constrant}
      />
    </PurchasesByItemsSheet>
  );
}

const PurchasesByItemsSheet = styled(FinancialSheet)`
  min-width: 850px;
`;

const PurchasesByItemsDataTable = styled(DataTable)`
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
