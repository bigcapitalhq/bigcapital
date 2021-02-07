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
import { useIntl } from 'react-intl';
import moment from 'moment';
import classNames from 'classnames';

import {
  DataTable,
  If,
  Choose,
  Icon,
} from 'components';
import { CLASSES } from 'common/classes';
import ManualJournalsEmptyStatus from './ManualJournalsEmptyStatus';
import TableSkeletonRows from 'components/Datatable/TableSkeletonRows';
import TableSkeletonHeader from 'components/Datatable/TableHeaderSkeleton';
import {
  NoteAccessor,
  StatusAccessor,
  DateAccessor,
  AmountAccessor
} from './components';

import withManualJournalsActions from 'containers/Accounting/withManualJournalsActions';

import { compose, saveInvoke } from 'utils';
import { useManualJournalsContext } from './ManualJournalsListProvider';


/**
 * Manual journals data-table.
 */
function ManualJournalsDataTable({
  // #withManualJournalsActions
  addManualJournalsTableQueries,

  // #ownProps
  onSelectedRowsChange,
}) {
  const { formatMessage } = useIntl();

  const { manualJournals, isManualJournalsLoading } = useManualJournalsContext();

  const handlePublishJournal = useCallback(
    (journal) => () => {
      
    },
    [],
  );

  const handleEditJournal = useCallback(
    (journal) => () => {
      
    },
    [],
  );

  const handleDeleteJournal = useCallback(
    (journal) => () => {
      
    },
    [],
  );

  const actionMenuList = useCallback(
    (journal) => (
      <Menu>
        <MenuItem
          icon={<Icon icon="reader-18" />}
          text={formatMessage({ id: 'view_details' })}
        />
        <MenuDivider />
        <If condition={!journal.is_published}>
          <MenuItem
            icon={<Icon icon="arrow-to-top" />}
            text={formatMessage({ id: 'publish_journal' })}
            onClick={handlePublishJournal(journal)}
          />
        </If>
        <MenuItem
          icon={<Icon icon="pen-18" />}
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
        accessor: DateAccessor,
        width: 115,
        className: 'date',
      },
      {
        id: 'amount',
        Header: formatMessage({ id: 'amount' }),
        accessor: AmountAccessor,
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
        id: 'publish',
        Header: formatMessage({ id: 'publish' }),
        accessor: (row) => StatusAccessor(row),
        width: 95,
        className: 'publish',
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
    ({ pageIndex, pageSize, sortBy }) => {
      addManualJournalsTableQueries({
        ...(sortBy.length > 0
          ? {
              column_sort_by: sortBy[0].id,
              sort_order: sortBy[0].desc ? 'desc' : 'asc',
            }
          : {}),
        page_size: pageSize,
        page: pageIndex + 1,
      });
    },
    [addManualJournalsTableQueries],
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

  return (
    <div className={classNames(CLASSES.DASHBOARD_DATATABLE)}>
      <Choose>
        <Choose.When condition={false}>
          <ManualJournalsEmptyStatus />
        </Choose.When>

        <Choose.Otherwise>
          <DataTable
            noInitialFetch={true}
            columns={columns}
            data={manualJournals}
            onFetchData={handleDataTableFetchData}
            manualSortBy={true}
            selectionColumn={true}
            expandable={true}
            sticky={true}
            loading={isManualJournalsLoading}
            onSelectedRowsChange={handleSelectedRowsChange}
            rowContextMenu={onRowContextMenu}
            // pagesCount={manualJournalsPagination.pagesCount}
            pagination={true}
            // initialPageSize={manualJournalsTableQuery.page_size}
            // initialPageIndex={manualJournalsTableQuery.page - 1}
            autoResetSortBy={false}
            autoResetPage={false}

            TableLoadingRenderer={TableSkeletonRows}
            TableHeaderSkeletonRenderer={TableSkeletonHeader}
          />
        </Choose.Otherwise>
      </Choose>
    </div>
  );
}

export default compose(
  withManualJournalsActions,
)(ManualJournalsDataTable);
