import React, { useCallback, useMemo } from 'react';
import {
  Intent,
  Button,
  Popover,
  Menu,
  MenuItem,
  MenuDivider,
  Position,
} from '@blueprintjs/core';
import classNames from 'classnames';
import { FormattedMessage as T, useIntl } from 'react-intl';
import moment from 'moment';

import { CLASSES } from 'common/classes';
import { compose, saveInvoke } from 'utils';
import { useIsValuePassed } from 'hooks';

import LoadingIndicator from 'components/LoadingIndicator';
import { DataTable, Money, Choose, Icon } from 'components';
import EstimatesEmptyStatus from './EstimatesEmptyStatus';

import withEstimates from './withEstimates';
import withEstimateActions from './withEstimateActions';

// Estimates transactions datatable.
function EstimatesDataTable({
  // #withEstimates
  estimatesCurrentPage,
  estimatesLoading,
  estimatesPageination,
  estimatesTableQuery,
  estimatesCurrentViewId,

  // #withEstimatesActions
  addEstimatesTableQueries,

  // #ownProps
  onEditEstimate,
  onDeleteEstimate,
  onSelectedRowsChange,
}) {
  const { formatMessage } = useIntl();
  const isLoaded = useIsValuePassed(estimatesLoading, false);

  const handleEditEstimate = useCallback(
    (estimate) => () => {
      saveInvoke(onEditEstimate, estimate);
    },
    [onEditEstimate],
  );

  const handleDeleteEstimate = useCallback(
    (estimate) => () => {
      saveInvoke(onDeleteEstimate, estimate);
    },
    [onDeleteEstimate],
  );

  const actionMenuList = useCallback(
    (estimate) => (
      <Menu>
        <MenuItem
          icon={<Icon icon="reader-18" />}
          text={formatMessage({ id: 'view_details' })}
        />
        <MenuDivider />
        <MenuItem
          icon={<Icon icon="pen-18" />}
          text={formatMessage({ id: 'edit_estimate' })}
          onClick={handleEditEstimate(estimate)}
        />
        <MenuItem
          text={formatMessage({ id: 'delete_estimate' })}
          intent={Intent.DANGER}
          onClick={handleDeleteEstimate(estimate)}
          icon={<Icon icon="trash-16" iconSize={16} />}
        />
      </Menu>
    ),
    [handleDeleteEstimate, handleEditEstimate, formatMessage],
  );

  const onRowContextMenu = useCallback(
    (cell) => {
      return actionMenuList(cell.row.original);
    },
    [actionMenuList],
  );

  const columns = useMemo(
    () => [
      {
        id: 'estimate_date',
        Header: formatMessage({ id: 'estimate_date' }),
        accessor: (r) => moment(r.estimate_date).format('YYYY MMM DD'),
        width: 140,
        className: 'estimate_date',
      },
      {
        id: 'customer_id',
        Header: formatMessage({ id: 'customer_name' }),
        accessor: 'customer.display_name',
        width: 140,
        className: 'customer_id',
      },
      {
        id: 'expiration_date',
        Header: formatMessage({ id: 'expiration_date' }),
        accessor: (r) => moment(r.expiration_date).format('YYYY MMM DD'),
        width: 140,
        className: 'expiration_date',
      },
      {
        id: 'estimate_number',
        Header: formatMessage({ id: 'estimate_number' }),
        accessor: (row) => `#${row.estimate_number}`,
        width: 140,
        className: 'estimate_number',
      },
      {
        id: 'amount',
        Header: formatMessage({ id: 'amount' }),
        accessor: (r) => <Money amount={r.amount} currency={'USD'} />,

        width: 140,
        className: 'amount',
      },
      {
        id: 'reference',
        Header: formatMessage({ id: 'reference_no' }),
        accessor: 'reference',
        width: 140,
        className: 'reference',
      },
      {
        id: 'actions',
        Header: '',
        Cell: ({ cell }) => (
          <Popover
            content={actionMenuList(cell.row.original)}
            position={Position.RIGHT_BOTTOM}
          >
            <Button icon={<Icon icon="more-h-16" iconSize={16} />} />
          </Popover>
        ),
        className: 'actions',
        width: 50,
        disableResizing: true,
      },
    ],
    [actionMenuList, formatMessage],
  );

  const handleFetchData = useCallback(
    ({ pageIndex, pageSize, sortBy }) => {
      const page = pageIndex + 1;

      addEstimatesTableQueries({
        ...(sortBy.length > 0
          ? {
              column_sort_by: sortBy[0].id,
              sort_order: sortBy[0].desc ? 'desc' : 'asc',
            }
          : {}),
        page_size: pageSize,
        page,
      });
    },
    [addEstimatesTableQueries],
  );

  const handleSelectedRowsChange = useCallback(
    (selectedRows) => {
      saveInvoke(
        onSelectedRowsChange,
        selectedRows.map((s) => s.original),
      );
    },
    [onSelectedRowsChange],
  );

  const showEmptyStatus = [
    estimatesCurrentPage.length === 0,
    estimatesCurrentViewId === -1,
  ].every(d => d === true);

  return (
    <div className={classNames(CLASSES.DASHBOARD_DATATABLE)}>
      <LoadingIndicator loading={estimatesLoading && !isLoaded} mount={false}>
        <Choose>
          <Choose.When condition={showEmptyStatus}>
            <EstimatesEmptyStatus />
          </Choose.When>

          <Choose.Otherwise>
            <DataTable
              columns={columns}
              data={estimatesCurrentPage}
              onFetchData={handleFetchData}
              manualSortBy={true}
              selectionColumn={true}
              noInitialFetch={true}
              sticky={true}
              onSelectedRowsChange={handleSelectedRowsChange}
              rowContextMenu={onRowContextMenu}
              pagination={true}
              pagesCount={estimatesPageination.pagesCount}
              initialPageSize={estimatesTableQuery.page_size}
              initialPageIndex={estimatesTableQuery.page - 1}
            />
          </Choose.Otherwise>
        </Choose>
      </LoadingIndicator>
    </div>
  );
}

export default compose(
  withEstimateActions,
  withEstimates(
    ({
      estimatesCurrentPage,
      estimatesLoading,
      estimatesPageination,
      estimatesTableQuery,
      estimatesCurrentViewId,
    }) => ({
      estimatesCurrentPage,
      estimatesLoading,
      estimatesPageination,
      estimatesTableQuery,
      estimatesCurrentViewId,
    }),
  ),
)(EstimatesDataTable);
