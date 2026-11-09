import React from 'react';
import intl from 'react-intl-universal';
import { useRecurringInvoiceDetailDrawerContext } from './RecurringInvoiceDetailDrawerProvider';
import { TextOverviewTooltipCell } from '@/components';
import { getColumnWidth } from '@/utils';

/**
 * Retrieve recurring invoice readonly details table columns.
 */
export const useRecurringInvoiceReadonlyEntriesColumns = () => {
  // Recurring invoice details drawer context.
  const { recurringInvoice } = useRecurringInvoiceDetailDrawerContext();

  return React.useMemo(() => {
    const entries = recurringInvoice?.entries ?? [];

    return [
      {
        Header: intl.get('product_and_service'),
        accessor: 'item.name',
        Cell: TextOverviewTooltipCell,
        disableSortBy: true,
        textOverview: true,
        width: 150,
      },
      {
        Header: intl.get('description'),
        accessor: 'description',
        Cell: TextOverviewTooltipCell,
        disableSortBy: true,
        textOverview: true,
      },
      {
        Header: intl.get('quantity'),
        accessor: 'quantityFormatted',
        align: 'right',
        disableSortBy: true,
        textOverview: true,
        width: getColumnWidth(entries, 'quantityFormatted', {
          minWidth: 60,
          magicSpacing: 5,
        }),
      },
      {
        Header: intl.get('rate'),
        accessor: 'rate',
        align: 'right',
        disableSortBy: true,
        textOverview: true,
        width: getColumnWidth(entries, 'rate', {
          minWidth: 60,
          magicSpacing: 5,
        }),
      },
      {
        id: 'discount',
        Header: intl.get('recurring_invoice.details.discount'),
        accessor: 'discountFormatted',
        align: 'right',
        disableSortBy: true,
        textOverview: true,
        width: getColumnWidth(entries, 'discountFormatted', {
          minWidth: 60,
          magicSpacing: 5,
        }),
      },
      {
        Header: intl.get('amount'),
        accessor: 'totalFormatted',
        align: 'right',
        disableSortBy: true,
        textOverview: true,
        width: getColumnWidth(entries, 'totalFormatted', {
          minWidth: 60,
          magicSpacing: 5,
        }),
      },
    ];
  }, [recurringInvoice]);
};
