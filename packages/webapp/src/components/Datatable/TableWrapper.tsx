import clsx from 'classnames';
import React, { useContext } from 'react';
import { ScrollSync } from 'react-scroll-sync';
import TableContext from './TableContext';

interface TableWrapperProps {
  children?: React.ReactNode;
}

export default function TableWrapper({ children }: TableWrapperProps) {
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
