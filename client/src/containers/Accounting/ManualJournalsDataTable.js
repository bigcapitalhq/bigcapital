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
import Icon from 'components/Icon';
import { compose } from 'utils';
import moment from 'moment';

import LoadingIndicator from 'components/LoadingIndicator';
import DialogConnect from 'connectors/Dialog.connector';

import { useUpdateEffect } from 'hooks';
import DataTable from 'components/DataTable';
import Money from 'components/Money';

import withDashboardActions from 'containers/Dashboard/withDashboard';
import withViewDetails from 'containers/Views/withViewDetails';
import withManualJournals from 'containers/Accounting/withManualJournals';
import withManualJournalsActions from 'containers/Accounting/withManualJournalsActions';


function ManualJournalsDataTable({
  loading,

  manualJournals,
  manualJournalsLoading,

  changeCurrentView,
  changePageSubtitle,

  viewId,
  viewMeta,
  setTopbarEditView,

  onFetchData,
  onEditJournal,
  onDeleteJournal,
  onPublishJournal,
  onSelectedRowsChange,
}) {
  const { custom_view_id: customViewId } = useParams();
  const [initialMount, setInitialMount] = useState(false);

  useUpdateEffect(() => {
    if (!manualJournalsLoading) {
      setInitialMount(true);
    }
  }, [manualJournalsLoading, setInitialMount]);

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

  const handlePublishJournal = useCallback((journal) => () => {
    onPublishJournal && onPublishJournal(journal);
  }, [onPublishJournal]);

  const handleEditJournal = useCallback((journal) => () => {
    onEditJournal && onEditJournal(journal);
  }, [onEditJournal]);

  const handleDeleteJournal = useCallback((journal) => () => {
    onDeleteJournal && onDeleteJournal(journal);
  }, [onDeleteJournal]);

  const actionMenuList = (journal) => (
    <Menu>
      <MenuItem text='View Details' />
      <MenuDivider />
      {!journal.status && (
        <MenuItem
          text="Publish Journal"
          onClick={handlePublishJournal(journal)} />
      )}      
      <MenuItem
        text='Edit Journal'
        onClick={handleEditJournal(journal)} />
      <MenuItem
        text='Delete Journal'
        intent={Intent.DANGER}
        onClick={handleDeleteJournal(journal)} />
    </Menu>
  );

  const columns = useMemo(() => [
    {
      id: 'date',
      Header: 'Date',
      accessor: r => moment().format('YYYY-MM-DD'),
      disableResizing: true,
      width: 150,
      className: 'date',
    },
    {
      id: 'amount',
      Header: 'Amount',
      accessor: r => (<Money amount={r.amount} currency={'USD'} />),
      disableResizing: true,
      className: 'amount',
    },
    {
      id: 'journal_number',
      Header: 'Journal No.',
      accessor: 'journal_number',
      disableResizing: true,
      className: 'journal_number',
    },
    {
      id: 'status',
      Header: 'Status',
      accessor: (r) => {
        return r.status ? 'Published' : 'Draft';
      },
      disableResizing: true,
      width: 100,
      className: 'status',
    },
    {
      id: 'note',
      Header: 'Note',
      accessor: r => (<Icon icon={'file-alt'} iconSize={16} />),
      disableResizing: true,
      disableSorting: true,
      width: 100,
      className: 'note',
    },
    {
      id: 'transaction_type',
      Header: 'Transaction type ',
      accessor: 'transaction_type',
      width: 100,
      className: 'transaction_type',
    },
    {
      id: 'created_at',
      Header: 'Created At',
      accessor: r => moment().format('YYYY-MM-DD'),
      disableResizing: true,
      width: 150,
      className: 'created_at',
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
      disableResizing: true,
    },
  ], []);

  const handleDataTableFetchData = useCallback((...args) => {
    onFetchData && onFetchData(...args);
  }, [onFetchData]);

  const handleSelectedRowsChange = useCallback((selectedRows) => {
    onSelectedRowsChange && onSelectedRowsChange(selectedRows.map(s => s.original));
  }, [onSelectedRowsChange]);

  return (
    <LoadingIndicator loading={loading} mount={false}>
      <DataTable
        columns={columns}
        data={manualJournals}
        onFetchData={handleDataTableFetchData}
        manualSortBy={true}
        selectionColumn={true}
        noInitialFetch={true}
        loading={manualJournalsLoading && !initialMount}
        onSelectedRowsChange={handleSelectedRowsChange}
      />
    </LoadingIndicator>
  );
}

export default compose(
  DialogConnect,
  withDashboardActions,
  // withViewsActions,
  withManualJournalsActions,
  withManualJournals(({ manualJournals, manualJournalsLoading, }) => ({
    manualJournals,
    manualJournalsLoading,
  })),
  withViewDetails,
)(ManualJournalsDataTable);
