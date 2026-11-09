import { Intent, Tag } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import { useWarehouseDetailDrawerContext } from './WarehouseTransferDetailDrawerProvider';
import type { WarehouseTransfer } from '@bigcapital/sdk-ts';
import {
  Choose,
  FormatNumberCell,
  TextOverviewTooltipCell,
} from '@/components';
import { getColumnWidth } from '@/utils';

export const useWarehouseTransferReadOnlyEntriesColumns = () => {
  const { warehouseTransfer } = useWarehouseDetailDrawerContext();

  const entries = warehouseTransfer?.entries ?? [];

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
    [entries],
  );
};

export function WarehouseTransferDetailsStatus({
  warehouseTransfer,
}: {
  warehouseTransfer: WarehouseTransfer | undefined;
}): React.ReactElement {
  return (
    <Choose>
      <Choose.When
        condition={Boolean(
          warehouseTransfer?.isInitiated && warehouseTransfer?.isTransferred,
        )}
      >
        <Tag minimal={false} intent={Intent.SUCCESS} round={true}>
          {intl.get('warehouse_transfer.label.transferred')}
        </Tag>
      </Choose.When>
      <Choose.When
        condition={Boolean(
          warehouseTransfer?.isInitiated && !warehouseTransfer?.isTransferred,
        )}
      >
        <Tag minimal={false} intent={Intent.WARNING} round={true}>
          {intl.get('warehouse_transfer.label.transfer_initiated')}
        </Tag>
      </Choose.When>
      <Choose.Otherwise>
        <Tag minimal={false} intent={Intent.NONE} round={true}>
          {intl.get('draft')}
        </Tag>
      </Choose.Otherwise>
    </Choose>
  );
}
