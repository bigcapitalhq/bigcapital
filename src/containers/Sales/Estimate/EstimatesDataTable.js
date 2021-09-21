import React, { useCallback, useMemo } from 'react';
import {
  Intent,
  Button,
  Popover,
  Menu,
  MenuItem,
  MenuDivider,
  Position,
  Tag,
} from '@blueprintjs/core';
import classNames from 'classnames';
import { FormattedMessage as T } from 'components';
import intl from 'react-intl-universal';
import moment from 'moment';

import { CLASSES } from 'common/classes';
import { compose, saveInvoke } from 'utils';
import { useIsValuePassed } from 'hooks';

import LoadingIndicator from 'components/LoadingIndicator';
import { DataTable, Money, Choose, Icon, If } from 'components';
import EstimatesEmptyStatus from './EstimatesEmptyStatus';
import { statusAccessor } from './components';
import withEstimates from './withEstimates';
import withEstimateActions from './withEstimateActions';
import withCurrentOrganization from 'containers/Organization/withCurrentOrganization';

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

  // #withCurrentOrganization
  organization: { base_currency },

  // #ownProps
  onEditEstimate,
  onDeleteEstimate,
  onDeliverEstimate,
  onApproveEstimate,
  onRejectEstimate,
  onDrawerEstimate,
  onSelectedRowsChange,
}) {
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
          text={intl.get('view_details')}
        />
        <MenuDivider />
        <MenuItem
          icon={<Icon icon="pen-18" />}
          text={intl.get('edit_estimate')}
          onClick={handleEditEstimate(estimate)}
        />
        <If condition={!estimate.is_delivered}>
          <MenuItem
            text={intl.get('mark_as_delivered')}
            onClick={() => onDeliverEstimate(estimate)}
          />
        </If>
        <Choose>
          <Choose.When
            condition={estimate.is_delivered && estimate.is_approved}
          >
            <MenuItem
              text={intl.get('mark_as_rejected')}
              onClick={() => onRejectEstimate(estimate)}
            />
          </Choose.When>
          <Choose.When
            condition={estimate.is_delivered && estimate.is_rejected}
          >
            <MenuItem
              text={intl.get('mark_as_approved')}
              onClick={() => onApproveEstimate(estimate)}
            />
          </Choose.When>
          <Choose.When condition={estimate.is_delivered}>
            <MenuItem
              text={intl.get('mark_as_approved')}
              onClick={() => onApproveEstimate(estimate)}
            />
            <MenuItem
              text={intl.get('mark_as_rejected')}
              onClick={() => onRejectEstimate(estimate)}
            />
          </Choose.When>
        </Choose>
        <MenuItem
          text={intl.get('estimate_paper')}
          onClick={() => onDrawerEstimate()}
        />

        <MenuItem
          text={intl.get('delete_estimate')}
          intent={Intent.DANGER}
          onClick={handleDeleteEstimate(estimate)}
          icon={<Icon icon="trash-16" iconSize={16} />}
        />
      </Menu>
    ),
    [handleDeleteEstimate, handleEditEstimate],
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
        Header: intl.get('estimate_date'),
        accessor: (r) => moment(r.estimate_date).format('YYYY MMM DD'),
        width: 140,
        className: 'estimate_date',
      },
      {
        id: 'customer_id',
        Header: intl.get('customer_name'),
        accessor: 'customer.display_name',
        width: 140,
        className: 'customer_id',
      },
      {
        id: 'expiration_date',
        Header: intl.get('expiration_date'),
        accessor: (r) => moment(r.expiration_date).format('YYYY MMM DD'),
        width: 140,
        className: 'expiration_date',
      },
      {
        id: 'estimate_number',
        Header: intl.get('estimate_number'),
        accessor: (row) =>
          row.estimate_number ? `#${row.estimate_number}` : null,
        width: 140,
        className: 'estimate_number',
      },
      {
        id: 'amount',
        Header: intl.get('amount'),
        accessor: (r) => <Money amount={r.amount} currency={base_currency} />,

        width: 140,
        className: 'amount',
      },

      {
        id: 'status',
        Header: intl.get('status'),
        accessor: (row) => statusAccessor(row),
        width: 140,
        className: 'status',
      },

      {
        id: 'reference',
        Header: intl.get('reference_no'),
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
    [actionMenuList],
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
  ].every((d) => d === true);

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
  withCurrentOrganization(),
)(EstimatesDataTable);
