import React, { useEffect, useCallback, useState, useMemo } from 'react';
import {
  Intent,
  Button,
  Classes,
  Popover,
  Tooltip,
  Menu,
  MenuItem,
  MenuDivider,
  Position,
  Tag,
} from '@blueprintjs/core';
import { useParams } from 'react-router-dom';
import { withRouter } from 'react-router';
import { FormattedMessage as T, useIntl } from 'react-intl';
import moment from 'moment';

import Icon from 'components/Icon';
import { compose } from 'utils';
import { useUpdateEffect } from 'hooks';

import LoadingIndicator from 'components/LoadingIndicator';
import { If } from 'components';
import DataTable from 'components/DataTable';

import withDialogActions from 'containers/Dialog/withDialogActions';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withViewDetails from 'containers/Views/withViewDetails';

import witInvoice from './withInvoice';
import withInvoiceActions from './withInvoiceActions';

function InvoicesDataTable({
  //#withInvoices

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

  const handleEditInvoice = useCallback(
    (_invoice) => {
      onEditInvoice && onEditInvoice(_invoice);
    },
    [onEditInvoice],
  );

  const handleDeleteInvoice = useCallback(() => {
    onDeleteInvoice && onDeleteInvoice();
  }, [onDeleteInvoice]);

  const actionsMenuList = useCallback(
    (invoice) => {
      <Menu>
        <MenuItem text={formatMessage({ id: 'view_details' })} />
        <MenuDivider />

        <MenuItem
          text={formatMessage({ id: 'edit_invoice' })}
          // onClick={handleEditInvoice(invoice)}
        />
      </Menu>;
    },
    [handleDeleteInvoice, handleEditInvoice, formatMessage],
  );

  const columns = useMemo(
    () => [
      {
        id: '',
        Header: formatMessage({ id: '' }),
        accessor: '',
        className: '',
      },
      {
        id: '',
        Header: formatMessage({ id: '' }),
        accessor: '',
        className: '',
      },
      {
        id: '',
        Header: formatMessage({ id: '' }),
        accessor: '',
        className: '',
      },
      {
        id: '',
        Header: formatMessage({ id: '' }),
        accessor: '',
        className: '',
      },
      {
        id: '',
        Header: formatMessage({ id: '' }),
        accessor: '',
        className: '',
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

  const handleDataTableFetchData = useCallback(
    (...arguments) => {
      onFetchData && onFetchData(...arguments);
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

  return (
    <div>
      <LoadingIndicator>
        <DataTable
          columns={columns}
          data={[]}
          onFetchData={handleDataTableFetchData}
          manualSortBy={true}
        />
      </LoadingIndicator>
    </div>
  );
}

export default compose(
  withRouter,
  withDialogActions,
  withDashboardActions,
  withInvoiceActions,
  // withInvoices(({})=>({

  // }))
  withViewDetails(),
)(InvoicesDataTable);
