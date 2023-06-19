// @ts-nocheck
import React, { useContext } from 'react';
import classNames from 'classnames';
import { ScrollSyncPane } from 'react-scroll-sync';
import { If, MaterialProgressBar } from '@/components';
import TableContext from './TableContext';

function TableHeaderCell({ column, index }) {
  const {
    table: { getToggleAllRowsExpandedProps, isAllRowsExpanded },
    props: { expandable, expandToggleColumn },
  } = useContext(TableContext);

  return (
    <div
      {...column.getHeaderProps({
        className: classNames(column.className || '', 'th', {
          [`align-${column.align}`]: column.align,
        }),
      })}
    >
      <If condition={expandable && index + 1 === expandToggleColumn}>
        <span {...getToggleAllRowsExpandedProps()} className="expand-toggle">
          <span
            className={classNames({
              'arrow-down': isAllRowsExpanded,
              'arrow-right': !isAllRowsExpanded,
            })}
          />
        </span>
      </If>

      <div
        {...column.getSortByToggleProps({
          className: classNames('cell-inner', {
            'text-overview': column.textOverview,
          }),
        })}
      >
        {column.render('Header')}

        <If condition={column.isSorted}>
          <span
            className={classNames(
              {
                'sort-icon--desc': column.isSortedDesc,
                'sort-icon--asc': !column.isSortedDesc,
              },
              'sort-icon',
            )}
          ></span>
        </If>
      </div>

      {column.canResize && (
        <div
          {...column.getResizerProps()}
          className={`resizer ${column.isResizing ? 'isResizing' : ''}`}
        >
          <div class="inner-resizer" />
        </div>
      )}
    </div>
  );
}

function TableHeaderGroup({ headerGroup }) {
  return (
    <div {...headerGroup.getHeaderGroupProps()} className="tr">
      {headerGroup.headers.map((column, index) => (
        <TableHeaderCell key={index} column={column} index={index} />
      ))}
    </div>
  );
}

/**
 * Table header.
 */
export default function TableHeader() {
  const {
    table: { headerGroups, page },
    props: {
      TableHeaderSkeletonRenderer,
      headerLoading,
      progressBarLoading,
      hideTableHeader,
    },
  } = useContext(TableContext);

  // Can't continue if the thead is disabled.
  if (hideTableHeader) {
    return null;
  }

  if (headerLoading && TableHeaderSkeletonRenderer) {
    return <TableHeaderSkeletonRenderer />;
  }
  return (
    <ScrollSyncPane>
      <div className="thead">
        <div className={'thead-inner'}>
          {headerGroups.map((headerGroup, index) => (
            <TableHeaderGroup key={index} headerGroup={headerGroup} />
          ))}
          <If condition={progressBarLoading}>
            <MaterialProgressBar />
          </If>
        </div>
      </div>
    </ScrollSyncPane>
  );
}
