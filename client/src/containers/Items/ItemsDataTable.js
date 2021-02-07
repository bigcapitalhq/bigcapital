import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';
import classNames from 'classnames';
import { DataTable, Choose } from 'components';

import ItemsEmptyStatus from './ItemsEmptyStatus';
import TableSkeletonRows from 'components/Datatable/TableSkeletonRows';
import TableSkeletonHeader from 'components/Datatable/TableHeaderSkeleton';

import { CLASSES } from 'common/classes';

import withSettings from 'containers/Settings/withSettings';
import { useItemsListContext } from './ItemsListProvider';
import { compose } from 'utils';
import {
  QuantityOnHandCell,
  SellPriceCell,
  CostPriceCell,
  ItemTypeAccessor,
  ItemsActionsTableCell,
} from './components';

// Items datatable.
function ItemsDataTable({
  // #ownProps
  tableProps
}) {
  const { formatMessage } = useIntl();
  const {
    items,
    pagination,
    isItemsLoading,
    isEmptyStatus,
  } = useItemsListContext();

  // Datatable columns.
  const columns = useMemo(
    () => [
      {
        Header: formatMessage({ id: 'item_name' }),
        accessor: 'name',
        className: 'name',
        width: 180,
      },
      {
        Header: formatMessage({ id: 'item_code' }),
        accessor: 'code',
        className: 'code',
        width: 120,
      },
      {
        Header: formatMessage({ id: 'item_type' }),
        accessor: ItemTypeAccessor,
        className: 'item_type',
        width: 120,
      },
      {
        Header: formatMessage({ id: 'category' }),
        accessor: 'category.name',
        className: 'category',
        width: 150,
      },
      {
        Header: formatMessage({ id: 'sell_price' }),
        Cell: SellPriceCell,
        accessor: 'sell_price',
        className: 'sell-price',
        width: 150,
      },
      {
        Header: formatMessage({ id: 'cost_price' }),
        Cell: CostPriceCell,
        accessor: 'cost_price',
        className: 'cost-price',
        width: 150,
      },
      {
        Header: formatMessage({ id: 'quantity_on_hand' }),
        accessor: 'quantity_on_hand',
        Cell: QuantityOnHandCell,
        width: 140,
      },
      {
        id: 'actions',
        Cell: ItemsActionsTableCell,
        width: 60,
        skeletonWidthMin: 100,
      },
    ],
    [formatMessage],
  );

  // Table row class names.
  const rowClassNames = (row) => ({
    inactive: !row.original.active,
  });

  return (
    <div className={classNames(CLASSES.DASHBOARD_DATATABLE)}>
      <Choose>
        <Choose.When condition={isEmptyStatus}>
          <ItemsEmptyStatus />
        </Choose.When>

        <Choose.Otherwise>
          <DataTable
            columns={columns}
            data={items}
            loading={isItemsLoading}
            headerLoading={isItemsLoading}
            noInitialFetch={true}
            selectionColumn={true}
            spinnerProps={{ size: 30 }}
            expandable={false}
            sticky={true}
            rowClassNames={rowClassNames}
            pagination={true}
            manualSortBy={true}
            pagesCount={1}
            autoResetSortBy={false}
            autoResetPage={false}
            TableLoadingRenderer={TableSkeletonRows}
            TableHeaderSkeletonRenderer={TableSkeletonHeader}
            initialPageSize={pagination.pageSize}
            initialPageIndex={pagination.page}
            {...tableProps}
          />
        </Choose.Otherwise>
      </Choose>
    </div>
  );
}

export default compose(
  withSettings(({ organizationSettings }) => ({
    baseCurrency: organizationSettings?.baseCurrency,
  })),
)(ItemsDataTable);
