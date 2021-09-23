import React, { useContext } from 'react';
import classNames from 'classnames';
import { ScrollSync } from 'react-scroll-sync';
import TableContext from './TableContext';

/**
 * Table wrapper.
 */
export default function TableWrapper({ children }) {
  const {
    table: { getTableProps },
    props: {
      sticky,
      pagination,
      loading,
      expandable,
      virtualizedRows,
      className,
      size,
    },
  } = useContext(TableContext);

  return (
    <div
      className={classNames('bigcapital-datatable', className, {
        'has-sticky': sticky,
        'has-pagination': pagination,
        'is-expandable': expandable,
        'is-loading': loading,
        'has-virtualized-rows': virtualizedRows,
        [`table-size--${size}`]: size,
      })}
    >
      <ScrollSync>
        <div
          {...getTableProps({ style: { minWidth: 'none' } })}
          className="table"
        >
          {children}
        </div>
      </ScrollSync>
    </div>
  );
}
