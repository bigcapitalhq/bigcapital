import React, { useEffect, useCallback, useState, useMemo } from 'react';
import {
  Intent,
  Button,
  Popover,
  Menu,
  MenuItem,
  MenuDivider,
  Position,
} from '@blueprintjs/core';
import { useParams } from 'react-router-dom';
import { withRouter } from 'react-router';
import { FormattedMessage as T, useIntl } from 'react-intl';
import moment from 'moment';

import { compose } from 'utils';
import { useUpdateEffect } from 'hooks';

import LoadingIndicator from 'components/LoadingIndicator';
import { DataTable, Money, Icon } from 'components';

import withDialogActions from 'containers/Dialog/withDialogActions';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withViewDetails from 'containers/Views/withViewDetails';

import withEstimates from './withEstimates';
import withEstimateActions from './withEstimateActions';
import withCurrentView from 'containers/Views/withCurrentView';

function EstimatesDataTable({
  //#withEitimates
  estimatesCurrentPage,
  estimatesLoading,
  estimatesPageination,
  estimateItems,

  // #withDashboardActions
  changeCurrentView,
  changePageSubtitle,
  setTopbarEditView,

  // #withView
  viewMeta,

  //#OwnProps
  loading,
  onFetchData,
  onEditEstimate,
  onDeleteEstimate,
  onSelectedRowsChange,
}) {
  const [initialMount, setInitialMount] = useState(false);
  const { custom_view_id: customViewId } = useParams();
  const { formatMessage } = useIntl();

  useEffect(() => {
    setInitialMount(false);
  }, []);

  useUpdateEffect(() => {
    if (!estimatesLoading) {
      setInitialMount(true);
    }
  }, [estimatesLoading, setInitialMount]);

  useEffect(() => {
    if (customViewId) {
      changeCurrentView(customViewId);
      setTopbarEditView(customViewId);
    }
    changePageSubtitle(customViewId && viewMeta ? viewMeta.name : '');
  }, [
    customViewId,
    changeCurrentView,
    changePageSubtitle,
    setTopbarEditView,
    viewMeta,
  ]);

  const handleEditEstimate = useCallback(
    (estimate) => () => {
      onEditEstimate && onEditEstimate(estimate);
    },
    [onEditEstimate],
  );

  const handleDeleteEstimate = useCallback(
    (estimate) => () => {
      onDeleteEstimate && onDeleteEstimate(estimate);
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
  const selectionColumn = useMemo(
    () => ({
      minWidth: 40,
      width: 40,
      maxWidth: 40,
    }),
    [],
  );

  const handleDataTableFetchData = useCallback(
    (...args) => {
      onFetchData && onFetchData(...args);
    },
    [onFetchData],
  );

  const handleSelectedRowsChange = useCallback(
    (selectedRows) => {
      onSelectedRowsChange &&
        onSelectedRowsChange(selectedRows.map((s) => s.original));
    },
    [onSelectedRowsChange],
  );
  console.log(estimatesCurrentPage, 'estimatesCurrentPage');
  console.log(estimateItems, 'estimateItems');

  return (
    <div>
      <LoadingIndicator loading={loading} mount={false}>
        <DataTable
          columns={columns}
          data={estimatesCurrentPage}
          onFetchData={handleDataTableFetchData}
          manualSortBy={true}
          selectionColumn={true}
          noInitialFetch={true}
          sticky={true}
          loading={estimatesLoading && !initialMount}
          onSelectedRowsChange={handleSelectedRowsChange}
          rowContextMenu={onRowContextMenu}
          pagination={true}
          pagesCount={estimatesPageination.pagesCount}
          initialPageSize={estimatesPageination.pageSize}
          initialPageIndex={estimatesPageination.page - 1}
        />
      </LoadingIndicator>
    </div>
  );
}

export default compose(
  withRouter,
  withCurrentView,
  withDialogActions,
  withDashboardActions,
  withEstimateActions,
  withEstimates(
    ({
      estimatesCurrentPage,
      estimatesLoading,
      estimatesPageination,
      estimateItems,
    }) => ({
      estimatesCurrentPage,
      estimatesLoading,
      estimatesPageination,
      estimateItems,
    }),
  ),
  withViewDetails(),
)(EstimatesDataTable);
