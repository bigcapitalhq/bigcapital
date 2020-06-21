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
import { withRouter, useParams } from 'react-router-dom';
import { FormattedMessage as T, useIntl } from 'react-intl';
import moment from 'moment';

import Icon from 'components/Icon';
import { compose } from 'utils';
import { useUpdateEffect } from 'hooks';

import LoadingIndicator from 'components/LoadingIndicator';
import { If, Money } from 'components';
import DataTable from 'components/DataTable';

import withDialogActions from 'containers/Dialog/withDialogActions';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withViewDetails from 'containers/Views/withViewDetails';
import withManualJournals from 'containers/Accounting/withManualJournals';
import withManualJournalsActions from 'containers/Accounting/withManualJournalsActions';

function ManualJournalsDataTable({
  loading,

  // #withManualJournals
  manualJournalsCurrentPage,
  manualJournalsLoading,
  manualJournalsPagination,
  manualJournalsTableQuery,

  // #withDashboardActions
  changeCurrentView,
  changePageSubtitle,
  setTopbarEditView,

  // #withViewDetails
  viewId,
  viewMeta,

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
    [onPublishJournal],
  );

  const handleEditJournal = useCallback(
    (journal) => () => {
      onEditJournal && onEditJournal(journal);
    },
    [onEditJournal],
  );

  const handleDeleteJournal = useCallback(
    (journal) => () => {
      onDeleteJournal && onDeleteJournal(journal);
    },
    [onDeleteJournal],
  );

  const actionMenuList = useCallback(
    (journal) => (
      <Menu>
        <MenuItem text={formatMessage({ id: 'view_details' })} />
        <MenuDivider />
        {!journal.status && (
          <MenuItem
          text={formatMessage({ id: 'publish_journal' })}
            onClick={handlePublishJournal(journal)}
          />
        )}
        <MenuItem
          text={formatMessage({ id: 'edit_journal' })}
          onClick={handleEditJournal(journal)}
        />
        <MenuItem
          text={formatMessage({ id: 'delete_journal' })}
          intent={Intent.DANGER}
          onClick={handleDeleteJournal(journal)}
        />
      </Menu>
    ),
    [handleEditJournal, handleDeleteJournal, handlePublishJournal, formatMessage],
  );

  const onRowContextMenu = useCallback((cell) => {
    return actionMenuList(cell.row.original);
  }, [actionMenuList]);

  const columns = useMemo(
    () => [
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
        accessor: (r) => <Money amount={r.amount} currency={'USD'} />,
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
          return r.status ? (
            <Tag minimal={true}><T id={'published'} /></Tag>
          ) : (
            <Tag minimal={true} intent={Intent.WARNING}><T id={'draft'} /></Tag>
          );
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
              hoverOpenDelay={250}
            >
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
        accessor: (r) => moment().format('YYYY-MM-DD'),
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

  return (
    <LoadingIndicator loading={loading} mount={false}>
      <DataTable
        columns={columns}
        data={manualJournalsCurrentPage}
        onFetchData={handleDataTableFetchData}
        manualSortBy={true}
        selectionColumn={true}
        noInitialFetch={true}
        sticky={true}
        loading={manualJournalsLoading && !manualJournalsCurrentPage.length > 0}
        onSelectedRowsChange={handleSelectedRowsChange}
        pagination={true}

        rowContextMenu={onRowContextMenu}

        pagesCount={manualJournalsPagination.pagesCount}
        initialPageSize={manualJournalsTableQuery.page_size}
        initialPageIndex={manualJournalsTableQuery.page - 1}
      />
    </LoadingIndicator>
  );
}

export default compose(
  withRouter,
  withDialogActions,
  withDashboardActions,
  withManualJournalsActions,
  withManualJournals(
    ({
      manualJournalsCurrentPage,
      manualJournalsLoading,
      manualJournalsPagination,
      manualJournalsTableQuery,
    }) => ({
      manualJournalsCurrentPage,
      manualJournalsLoading,
      manualJournalsPagination,
      manualJournalsTableQuery,
    }),
  ),
  withViewDetails,
)(ManualJournalsDataTable);
