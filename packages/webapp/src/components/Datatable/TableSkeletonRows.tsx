// @ts-nocheck
import React, { useContext } from 'react';
import clsx from 'classnames';
import TableContext from './TableContext';
import { Skeleton } from '../Skeleton';

/**
 * Table header cell.
 */
function TableHeaderCell({ column }) {
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

/**
 * Table skeleton rows.
 */
export function TableSkeletonRows({}) {
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
