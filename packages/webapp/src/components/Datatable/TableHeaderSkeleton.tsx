import clsx from 'classnames';
import React, { useContext } from 'react';
import TableContext from './TableContext';
import type { ColumnInstance } from 'react-table';
import { Skeleton } from '@/components';

interface TableHeaderCellProps {
  column: ColumnInstance<any>;
}

function TableHeaderCell({ column }: TableHeaderCellProps) {
  const { skeletonWidthMax = 100, skeletonWidthMin = 40 } = column;

  return (
    <div
      {...column.getHeaderProps({
        className: clsx(
          'th',
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

export function TableSkeletonHeader() {
  const {
    table: { headerGroups },
  } = useContext(TableContext);

  return (
    <div className="thead">
      {headerGroups.map((headerGroup) => (
        <div
          {...headerGroup.getHeaderGroupProps({
            className: 'tr',
          })}
        >
          {headerGroup.headers.map((column) => (
            <TableHeaderCell column={column} />
          ))}
        </div>
      ))}
    </div>
  );
}
