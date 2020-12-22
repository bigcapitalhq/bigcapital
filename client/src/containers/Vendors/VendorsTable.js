import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import {
  Button,
  Popover,
  Menu,
  MenuItem,
  MenuDivider,
  Position,
  Intent,
} from '@blueprintjs/core';
import { FormattedMessage as T, useIntl } from 'react-intl';
import classNames from 'classnames';
import { useIsValuePassed } from 'hooks';

import VendorsEmptyStatus from './VendorsEmptyStatus';
import { DataTable, LoadingIndicator, Icon, Money, Choose } from 'components';
import { CLASSES } from 'common/classes';

import withVendors from './withVendors';
import withVendorsActions from './withVendorActions';

import { compose, firstLettersArgs, saveInvoke } from 'utils';

const AvatarCell = (row) => {
  return <span className="avatar">{firstLettersArgs(row.display_name)}</span>;
};

function VendorsTable({
  // #withVendors
  vendorsCurrentPage,
  vendorsLoading,
  vendorsPageination,
  vendorTableQuery,
  vendorItems,
  vendorsCurrentViewId,

  // #withVendorsActions
  addVendorsTableQueries,

  // #ownProps
  loading,
  onEditVendor,
  onDeleteVendor,
  onSelectedRowsChange,
}) {
  const { formatMessage } = useIntl();
  const isLoadedBefore = useIsValuePassed(loading, false);

  // Vendor actions list.
  const renderContextMenu = useMemo(
    () => ({ vendor, onEditVendor, onDeleteVendor }) => {
      const handleEditVendor = () => {
        saveInvoke(onEditVendor, vendor);
      };
      const handleDeleteVendor = () => {
        saveInvoke(onDeleteVendor, vendor);
      };
      return (
        <Menu>
          <MenuItem
            icon={<Icon icon="reader-18" />}
            text={formatMessage({ id: 'view_details' })}
          />
          <MenuDivider />
          <MenuItem
            icon={<Icon icon="pen-18" />}
            text={formatMessage({ id: 'edit_vendor' })}
            onClick={handleEditVendor}
          />
          <MenuItem
            icon={<Icon icon="trash-16" iconSize={16} />}
            text={formatMessage({ id: 'delete_vendor' })}
            intent={Intent.DANGER}
            onClick={handleDeleteVendor}
          />
        </Menu>
      );
    },
    [formatMessage],
  );

  // Renders actions table cell.
  const renderActionsCell = useMemo(
    () => ({ cell }) => (
      <Popover
        content={renderContextMenu({
          vendor: cell.row.original,
          onEditVendor,
          onDeleteVendor,
        })}
        position={Position.RIGHT_BOTTOM}
      >
        <Button icon={<Icon icon="more-h-16" iconSize={16} />} />
      </Popover>
    ),
    [onDeleteVendor, onEditVendor, renderContextMenu],
  );

  // Table columns.
  const columns = useMemo(
    () => [
      {
        id: 'avatar',
        Header: '',
        accessor: AvatarCell,
        className: 'avatar',
        width: 50,
        disableResizing: true,
        disableSortBy: true,
      },
      {
        id: 'display_name',
        Header: formatMessage({ id: 'display_name' }),
        accessor: 'display_name',
        className: 'display_name',
        width: 150,
      },
      {
        id: 'company_name',
        Header: formatMessage({ id: 'company_name' }),
        accessor: 'company_name',
        className: 'company_name',
        width: 150,
      },
      {
        id: 'phone_number',
        Header: formatMessage({ id: 'phone_number' }),
        accessor: (row) => (
          <div>
            <div className={'work_phone'}>{row.work_phone}</div>
            <div className={'personal_phone'}>{row.personal_phone}</div>
          </div>
        ),
        className: 'phone_number',
        width: 100,
      },
      {
        id: 'receivable_balance',
        Header: formatMessage({ id: 'receivable_balance' }),
        accessor: (r) => (
          <Money amount={r.closing_balance} currency={r.currency_code} />
        ),
        className: 'receivable_balance',
        width: 100,
      },
      {
        id: 'actions',
        Cell: renderActionsCell,
        className: 'actions',
        width: 70,
        disableResizing: true,
        disableSortBy: true,
      },
    ],
    [formatMessage, renderActionsCell],
  );

  //Handle fetch data table
  const handleFetchData = useCallback(
    ({ pageIndex, pageSize, sortBy }) => {
      addVendorsTableQueries({
        page: pageIndex + 1,
        page_size: pageSize,
        ...(sortBy.length > 0
          ? {
              column_sort_order: sortBy[0].id,
              sort_order: sortBy[0].desc ? 'desc' : 'asc',
            }
          : {}),
      });
    },
    [addVendorsTableQueries],
  );

  const handleSelectedRowsChange = useCallback(
    (selectedRows) => {
      onSelectedRowsChange &&
        onSelectedRowsChange(selectedRows.map((s) => s.original));
    },
    [onSelectedRowsChange],
  );

  const rowContextMenu = (cell) =>
    renderContextMenu({
      vendor: cell.row.original,
      onEditVendor,
      onDeleteVendor,
    });
  const showEmptyStatus = [
    vendorsCurrentViewId === -1,
    vendorItems.length === 0,
  ].every((condition) => condition === true);

  return (
    <div className={classNames(CLASSES.DASHBOARD_DATATABLE)}>
      <LoadingIndicator
        loading={vendorsLoading && !isLoadedBefore}
        mount={false}
      >
        <Choose>
          <Choose.When condition={showEmptyStatus}>
            <VendorsEmptyStatus />
          </Choose.When>

          <Choose.Otherwise>
            <DataTable
              noInitialFetch={true}
              columns={columns}
              data={vendorItems}
              onFetchData={handleFetchData}
              selectionColumn={true}
              expandable={false}
              sticky={true}
              onSelectedRowsChange={handleSelectedRowsChange}
              spinnerProps={{ size: 30 }}
              rowContextMenu={rowContextMenu}
              pagination={true}
              manualSortBy={true}
              pagesCount={vendorsPageination.pagesCount}
              autoResetSortBy={false}
              autoResetPage={false}
              initialPageSize={vendorTableQuery.page_size}
              initialPageIndex={vendorTableQuery.page - 1}
            />
          </Choose.Otherwise>
        </Choose>
      </LoadingIndicator>
    </div>
  );
}

export default compose(
  withVendors(
    ({
      vendorItems,
      vendorsLoading,
      vendorTableQuery,
      vendorsPageination,
      vendorsCurrentViewId,
    }) => ({
      vendorItems,
      vendorsLoading,
      vendorsPageination,
      vendorTableQuery,
      vendorsCurrentViewId,
    }),
  ),
  withVendorsActions,
)(VendorsTable);
