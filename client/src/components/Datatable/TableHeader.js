import React, { useContext } from 'react';
import classNames from 'classnames';
import { ScrollSyncPane } from 'react-scroll-sync';
import { If } from 'components';
import TableContext from './TableContext';

function TableHeaderGroup({ headerGroup }) {
  const {
    table: { getToggleAllRowsExpandedProps, isAllRowsExpanded },
    props: { expandable, expandToggleColumn },
  } = useContext(TableContext);

  return (
    <div {...headerGroup.getHeaderGroupProps()} className="tr">
      {headerGroup.headers.map((column, index) => (
        <div
          {...column.getHeaderProps({
            className: classNames(column.className || '', 'th'),
          })}
        >
          <If condition={expandable && index + 1 === expandToggleColumn}>
            <span
              {...getToggleAllRowsExpandedProps()}
              className="expand-toggle"
            >
              <span
                className={classNames({
                  'arrow-down': isAllRowsExpanded,
                  'arrow-right': !isAllRowsExpanded,
                })}
              />
            </span>
          </If>

          <div {...column.getSortByToggleProps()}>
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
      ))}
    </div>
  );
}

/**
 * Table header.
 */
export default function TableHeader() {
  const {
    table: { headerGroups },
  } = useContext(TableContext);

  return (
    <ScrollSyncPane>
      <div className="thead">
        {headerGroups.map((headerGroup) => (
          <TableHeaderGroup headerGroup={headerGroup} />
        ))}
      </div>
    </ScrollSyncPane>
  );
}
