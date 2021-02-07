import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';
import classNames from 'classnames';

import { TableActionsCell } from './components';
import DataTable from 'components/DataTable';
import TableSkeletonRows from 'components/Datatable/TableSkeletonRows';

import { useItemsCategoriesContext } from './ItemsCategoriesProvider';
import { CLASSES } from 'common/classes';

/**
 * Items categories table.
 */
export default function ItemsCategoryTable({
  // #ownProps
  tableProps,
}) {
  const { formatMessage } = useIntl();
  const {
    isItemsCategoriesFetching,
    itemsCategories,
  } = useItemsCategoriesContext();

  // Table columns.
  const columns = useMemo(
    () => [
      {
        id: 'name',
        Header: formatMessage({ id: 'category_name' }),
        accessor: 'name',
        width: 220,
      },
      {
        id: 'description',
        Header: formatMessage({ id: 'description' }),
        accessor: 'description',
        className: 'description',
        width: 220,
      },
      {
        id: 'count',
        Header: formatMessage({ id: 'count' }),
        accessor: 'count',
        className: 'count',
        width: 180,
      },
      {
        id: 'actions',
        Header: '',
        Cell: TableActionsCell,
        className: 'actions',
        width: 50,
      },
    ],
    [formatMessage],
  );

  return (
    <div className={classNames(CLASSES.DASHBOARD_DATATABLE)}>
      <DataTable
        noInitialFetch={true}
        columns={columns}
        data={itemsCategories}
        loading={isItemsCategoriesFetching}
        manualSortBy={true}
        expandable={true}
        sticky={true}
        selectionColumn={true}
        TableLoadingRenderer={TableSkeletonRows}
        {...tableProps}
      />
    </div>
  );
}
