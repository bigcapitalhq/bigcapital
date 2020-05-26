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
import { FormattedMessage as T, useIntl } from 'react-intl';

import Icon from 'components/Icon';
import { compose } from 'utils';
import moment from 'moment';

import LoadingIndicator from 'components/LoadingIndicator';
import DialogConnect from 'connectors/Dialog.connector';

import { useUpdateEffect } from 'hooks';
import DataTable from 'components/DataTable';

import withDashboardActions from 'containers/Dashboard/withDashboard';
import withViewDetails from 'containers/Views/withViewDetails';
import withManualJournals from 'containers/Accounting/withManualJournals';
import withManualJournalsActions from 'containers/Accounting/withManualJournalsActions';

import { If, Money } from 'components';


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

  const { formatMessage } = useIntl();

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

  const handlePublishJournal = useCallback(
    (journal) => () => {
      onPublishJournal && onPublishJournal(journal);
    },
    [onPublishJournal]
  );

  const handleEditJournal = useCallback(
    (journal) => () => {
      onEditJournal && onEditJournal(journal);
    },
    [onEditJournal]
  );

  const handleDeleteJournal = useCallback(
    (journal) => () => {
      onDeleteJournal && onDeleteJournal(journal);
    },
    [onDeleteJournal]
  );

  // const actionMenuList = (journal) => (
  //   <Menu>
  //     <MenuItem text={<T id={'view_details'} />} />
  //     <MenuDivider />
  //     {!journal.status && (
  //       <MenuItem
  //         text={<T id={'publish_journal'} />}
  //         onClick={handlePublishJournal(journal)}
  //       />
  //     )}
  //     <MenuItem
  //       text={<T id={'edit_journal'} />}
  //       onClick={handleEditJournal(journal)}
  //     />
  //     <MenuItem
  //       text={<T id={'delete_journal'} />}
  //       intent={Intent.DANGER}
  //       onClick={handleDeleteJournal(journal)}
  //     />
  //   </Menu>
  // );
  const actionMenuList =useCallback((journal)=>(
  <Menu>
      <MenuItem text={<T id={'view_details'} />} />
      <MenuDivider />
      {!journal.status && (
        <MenuItem
          text={<T id={'publish_journal'} />}
          onClick={handlePublishJournal(journal)}
        />
      )}
      <MenuItem
        text={<T id={'edit_journal'} />}
        onClick={handleEditJournal(journal)}
      />
      <MenuItem
        text={<T id={'delete_journal'} />}
        intent={Intent.DANGER}
        onClick={handleDeleteJournal(journal)}
      />
    </Menu>
  ),[handleEditJournal,handleDeleteJournal,handlePublishJournal]);

  const columns = useMemo(() => [
    {
      id: 'date',
      Header: formatMessage({ id: 'date' }),
      accessor: (r) => moment().format('YYYY-MM-DD'),
      disableResizing: true,
      width: 150,
      className: 'date',
    },
    {
      id: 'amount',
      Header: formatMessage({ id: 'amount' }),
      accessor: r => (<Money amount={r.amount} currency={'USD'} />),
      disableResizing: true,
      className: 'amount',
    },
    {
      id: 'journal_number',
      Header: formatMessage({ id: 'journal_no' }),
      accessor: 'journal_number',
      disableResizing: true,
      className: 'journal_number',
    },
    {
      id: 'status',
      Header: formatMessage({ id: 'status' }),
      accessor: (r) => {
        return r.status
          ? <Tag minimal={true}><T id={'published'} /></Tag> :
          <Tag minimal={true} intent={Intent.WARNING}><T id={'draft'} /></Tag>;
      },
      disableResizing: true,
      width: 100,
      className: 'status',
    },
    {
      id: 'note',
      Header: formatMessage({ id: 'note' }),
      accessor: (row) => (
        <If condition={row.description}>
          <Tooltip
            className={Classes.TOOLTIP_INDICATOR}
            content={row.description}
            position={Position.TOP}
            hoverOpenDelay={250}>
            <Icon icon={'file-alt'} iconSize={16} />
          </Tooltip>
        </If>
      ),
      disableResizing: true,
      disableSorting: true,
      width: 100,
      className: 'note',
    },
    {
      id: 'transaction_type',
      Header: formatMessage({ id: 'transaction_type' }),
      accessor: 'transaction_type',
      width: 100,
      className: 'transaction_type',
    },
    {
      id: 'created_at',
      Header: formatMessage({ id: 'created_at' }),
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
  ], [actionMenuList,formatMessage]);

  const handleDataTableFetchData = useCallback((...args) => {
    onFetchData && onFetchData(...args);
  }, [onFetchData]);

  const handleSelectedRowsChange = useCallback((selectedRows) => {
    onSelectedRowsChange && onSelectedRowsChange(selectedRows.map((s) => s.original));
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
  withManualJournalsActions,
  withManualJournals(({ manualJournals, manualJournalsLoading, }) => ({
    manualJournals,
    manualJournalsLoading,
  })),
  withViewDetails,
)(ManualJournalsDataTable);
