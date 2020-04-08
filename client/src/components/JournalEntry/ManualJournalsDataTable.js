import React, { useEffect, useCallback, useState, useMemo } from 'react';
import {
  Button,
  Popover,
  Menu,
  MenuItem,
  MenuDivider,
  Position,
} from '@blueprintjs/core';
import { useParams, useHistory } from 'react-router-dom';
import Icon from 'components/Icon';
import { compose } from 'utils';
import ManualJournalsConnect from 'connectors/ManualJournals.connect';
import DialogConnect from 'connectors/Dialog.connector';
import DashboardConnect from 'connectors/Dashboard.connector';
import ViewConnect from 'connectors/View.connector';
import LoadingIndicator from 'components/LoadingIndicator';
import DataTable from 'components/DataTable';

function ManualJournalsDataTable({
  manual_journals,
  changeCurrentView,
  changePageSubtitle,
  getViewItem,
  setTopbarEditView,
  manualJournalsLoading,
  onFetchData,
}) {
  const { custom_view_id: customViewId } = useParams();
  useEffect(() => {
    const viewMeta = getViewItem(customViewId);

    if (customViewId) {
      changeCurrentView(customViewId);
      setTopbarEditView(customViewId);
    }
    changePageSubtitle(customViewId && viewMeta ? viewMeta.name : '');
  }, [customViewId]);

  useEffect(
    () => () => {
      changePageSubtitle('');
    },
    []
  );

  const history = useHistory();
  const handleClickNewView = () => {
    history.push('/dashboard/accounting/make-journal-entry');
  };

  console.log(manual_journals, 'Manual_journals');

  const actionMenuList = (manualJournal) => (
    <Menu>
      <MenuItem text='View Details' />
      <MenuDivider />
      <MenuItem
        text='New Manual Journal'
        onClick={(manualJournal) => handleClickNewView(manualJournal)}
      />
      <MenuItem text='Edit Manual Journal' />
      <MenuDivider />
      <MenuItem text='Delete Manual Journal' />
    </Menu>
  );

  const columns = useMemo(
    () => [
      {
        id: 'date',
        Header: 'Date',
        accessor: 'date',
      },
      {
        id: 'amount',
        Header: 'Amount',
        accessor: 'amount',
      },
      {
        id: 'journal_number',
        Header: 'Journal Number',
        accessor: 'journal_number',
      },
      {
        id: 'status',
        Header: 'Status',
        accessor: (r) => {
          return r.status ? 'Published' : 'Draft';
        },
      },
      {
        id: 'note',
        Header: 'Note',
        accessor: 'note',
      },
      {
        id: 'transaction_type',
        Header: 'Transaction type ',
      },
      {
        id: 'actions',
        Header: '',
        Cell: ({ cell }) => (
          <Popover
            content={actionMenuList(cell.row.original)}
            position={Position.RIGHT_BOTTOM}
          >
            <Button icon={<Icon icon='ellipsis-h' />} />
          </Popover>
        ),
        className: 'actions',
        width: 50,
      },
    ],
    []
  );
  const handleDataTableFetchData = useCallback(() => {
    onFetchData && onFetchData();
  }, []);

  return (
    <LoadingIndicator spinnerSize={30}>
      <DataTable
        columns={columns}
        data={manual_journals}
        onFetchData={handleDataTableFetchData}
        manualSortBy={true}
        selectionColumn={true}
      />
    </LoadingIndicator>
  );
}

export default compose(
  ManualJournalsConnect,
  DialogConnect,
  DashboardConnect,
  ViewConnect
)(ManualJournalsDataTable);
