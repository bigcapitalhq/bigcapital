import clsx from 'classnames';
import React, { useContext } from 'react';
import { Skeleton } from '../Skeleton';
import TableContext from './TableContext';
import type { ColumnInstance } from 'react-table';

interface TableHeaderCellProps {
  column: ColumnInstance<any>;
}

function TableHeaderCell({ column }: TableHeaderCellProps) {
  const { skeletonWidthMax = 100, skeletonWidthMin = 40 } = column;

  return (
    <div
      {...column.getHeaderProps({
        className: clsx(
          'td',
          {
            [`align-${column.align}`]: column.align,
          },
          column.className,
        ),
      })}
    >
      <Skeleton minWidth={skeletonWidthMin} maxWidth={skeletonWidthMax} />
    </div>
  );
}

export function TableSkeletonRows() {
  const {
    table: { headerGroups },
  } = useContext(TableContext);
  const skeletonRows = 10;

  return Array.from({ length: skeletonRows }).map(() => {
    return headerGroups.map((headerGroup) => (
      <div
        {...headerGroup.getHeaderGroupProps({
          className: 'tr',
        })}
      >
        {headerGroup.headers.map((column) => (
          <TableHeaderCell column={column} />
        ))}
      </div>
    ));
  });
}
