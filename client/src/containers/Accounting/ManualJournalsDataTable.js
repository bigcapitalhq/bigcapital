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

import { DataTable, If, Money, Choose, Icon } from 'components';
import { compose } from 'utils';

import withDialogActions from 'containers/Dialog/withDialogActions';
import withManualJournals from 'containers/Accounting/withManualJournals';
import withManualJournalsActions from 'containers/Accounting/withManualJournalsActions';

/**
 * Status column accessor.
 */
const StatusAccessor = (row) => {
  return (
    <Choose>
      <Choose.When condition={!!row.status}>
        <Tag minimal={true}>
          <T id={'published'} />
        </Tag>
      </Choose.When>

      <Choose.Otherwise>
        <Tag minimal={true} intent={Intent.WARNING}>
          <T id={'draft'} />
        </Tag>
      </Choose.Otherwise>
    </Choose>
  );
};

/**
 * Note column accessor.
 */
function NoteAccessor(row) {
  return (
    <If condition={row.description}>
      <Tooltip
        className={Classes.TOOLTIP_INDICATOR}
        content={row.description}
        position={Position.LEFT_TOP}
        hoverOpenDelay={50}
      >
        <Icon icon={'file-alt'} iconSize={16} />
      </Tooltip>
    </If>
  );
}

function ManualJournalsDataTable({
  // #withManualJournals
  manualJournalsCurrentPage,
  manualJournalsLoading,
  manualJournalsPagination,
  manualJournalsTableQuery,

  onFetchData,
  onEditJournal,
  onDeleteJournal,
  onPublishJournal,
  onSelectedRowsChange,
}) {
  const [isMounted, setIsMounted] = useState(false);
  const { custom_view_id: customViewId } = useParams();

  const { formatMessage } = useIntl();

  useEffect(() => {
    setIsMounted(false);
  }, [customViewId]);

  useEffect(() => {
    if (!manualJournalsLoading) {
      setIsMounted(true);
    }
  }, [manualJournalsLoading, setIsMounted]);

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
        <If condition={!journal.status}>
          <MenuItem
            text={formatMessage({ id: 'publish_journal' })}
            onClick={handlePublishJournal(journal)}
          />
        </If>
        <MenuItem
          text={formatMessage({ id: 'edit_journal' })}
          onClick={handleEditJournal(journal)}
        />
        <MenuItem
          text={formatMessage({ id: 'delete_journal' })}
          icon={<Icon icon="trash-16" iconSize={16} />}
          intent={Intent.DANGER}
          onClick={handleDeleteJournal(journal)}
        />
      </Menu>
    ),
    [
      handleEditJournal,
      handleDeleteJournal,
      handlePublishJournal,
      formatMessage,
    ],
  );

  const onRowContextMenu = useCallback(
    (cell) => actionMenuList(cell.row.original),
    [actionMenuList],
  );

  const columns = useMemo(
    () => [
      {
        id: 'date',
        Header: formatMessage({ id: 'date' }),
        accessor: (r) => moment(r.date).format('YYYY MMM DD'),
        width: 115,
        className: 'date',
      },
      {
        id: 'amount',
        Header: formatMessage({ id: 'amount' }),
        accessor: (r) => <Money amount={r.amount} currency={'USD'} />,
        className: 'amount',
        width: 115,
      },
      {
        id: 'journal_number',
        Header: formatMessage({ id: 'journal_no' }),
        accessor: (row) => `#${row.journal_number}`,
        className: 'journal_number',
        width: 100,
      },
      {
        id: 'journal_type',
        Header: formatMessage({ id: 'journal_type' }),
        accessor: 'journal_type',
        width: 110,
        className: 'journal_type',
      },
      {
        id: 'status',
        Header: formatMessage({ id: 'status' }),
        accessor: row => StatusAccessor(row),
        width: 95,
        className: 'status',
      },
      {
        id: 'note',
        Header: formatMessage({ id: 'note' }),
        accessor: NoteAccessor,
        disableSorting: true,
        width: 85,
        className: 'note',
      },
      {
        id: 'created_at',
        Header: formatMessage({ id: 'created_at' }),
        accessor: (r) => moment(r.created_at).format('YYYY MMM DD'),
        width: 125,
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
  const selectionColumn = useMemo(
    () => ({
      minWidth: 40,
      width: 40,
      maxWidth: 40,
    }),
    [],
  );

  return (
    <DataTable
      noInitialFetch={true}
      columns={columns}
      data={manualJournalsCurrentPage}
      onFetchData={handleDataTableFetchData}
      manualSortBy={true}
      selectionColumn={selectionColumn}
      expandable={true}
      sticky={true}
      onSelectedRowsChange={handleSelectedRowsChange}
      loading={manualJournalsLoading && !isMounted}
      rowContextMenu={onRowContextMenu}
      pagination={true}
      pagesCount={manualJournalsPagination.pagesCount}
      initialPageSize={manualJournalsTableQuery.page_size}
      initialPageIndex={manualJournalsTableQuery.page - 1}
    />
  );
}

export default compose(
  withRouter,
  withDialogActions,
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
)(ManualJournalsDataTable);
