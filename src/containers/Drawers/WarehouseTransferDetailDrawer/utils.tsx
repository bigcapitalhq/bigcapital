// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { Intent, Tag } from '@blueprintjs/core';
import { getColumnWidth } from '@/utils';
import { useWarehouseDetailDrawerContext } from './WarehouseTransferDetailDrawerProvider';

import {
  FormattedMessage as T,
  FormatNumberCell,
  TextOverviewTooltipCell,
  Choose,
} from '@/components';

/**
 * Retrieves the readonly warehouse transfer entries columns.
 */
export const useWarehouseTransferReadOnlyEntriesColumns = () => {
  const {
    warehouseTransfer: { entries },
  } = useWarehouseDetailDrawerContext();

  return React.useMemo(
    () => [
      {
        Header: intl.get('warehouse_transfer.column.item_name'),
        accessor: 'item.name',
        Cell: TextOverviewTooltipCell,
        width: 100,
        className: 'name',
        disableSortBy: true,
        textOverview: true,
      },
      {
        Header: intl.get('warehouse_transfer.column.description'),
        accessor: 'description',
        Cell: TextOverviewTooltipCell,
        className: 'description',
        disableSortBy: true,
        textOverview: true,
      },
      {
        Header: intl.get('warehouse_transfer.column.transfer_quantity'),
        accessor: 'quantity',
        Cell: FormatNumberCell,
        width: getColumnWidth(entries, 'quantity', {
          minWidth: 60,
          magicSpacing: 5,
        }),
        align: 'right',
        disableSortBy: true,
      },
    ],
    [],
  );
};

/**
 * Warehouses transfer details status.
 * @returns {React.JSX}
 */
export function WarehouseTransferDetailsStatus({ warehouseTransfer }) {
  return (
    <Choose>
      <Choose.When
        condition={
          warehouseTransfer.is_initiated && warehouseTransfer.is_transferred
        }
      >
        <Tag minimal={false} intent={Intent.SUCCESS} round={true}>
          <T id={'warehouse_transfer.label.transferred'} />
        </Tag>
      </Choose.When>
      <Choose.When
        condition={
          warehouseTransfer.is_initiated && !warehouseTransfer.is_transferred
        }
      >
        <Tag minimal={false} intent={Intent.WARNING} round={true}>
          <T id={'warehouse_transfer.label.transfer_initiated'} />
        </Tag>
      </Choose.When>
      <Choose.Otherwise>
        <Tag minimal={false} intent={Intent.NONE} round={true}>
          <T id={'draft'} />
        </Tag>
      </Choose.Otherwise>
    </Choose>
  );
}
