// @ts-nocheck
import React, { useContext } from 'react';
import clsx from 'classnames';
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
      styleName,
      size,
    },
  } = useContext(TableContext);

  return (
    <div
      className={clsx('bigcapital-datatable', className, {
        'has-sticky': sticky,
        'has-pagination': pagination,
        'is-expandable': expandable,
        'is-loading': loading,
        'has-virtualized-rows': virtualizedRows,
        [`table--${styleName}`]: styleName,
      })}
    >
      <ScrollSync>
        <div
          {...getTableProps({ style: { minWidth: 'none' } })}
          className={clsx('table', {
            [`table-size--${size}`]: size,
          })}
        >
          {children}
        </div>
      </ScrollSync>
    </div>
  );
}
