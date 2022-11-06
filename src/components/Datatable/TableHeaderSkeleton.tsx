// @ts-nocheck
import React, { useContext } from 'react';
import clsx from 'classnames';
import TableContext from './TableContext';
import { Skeleton } from '@/components';

function TableHeaderCell({ column }) {
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

/**
 * Table skeleton rows.
 */
export function TableSkeletonHeader({}) {
  const {
    table: { headerGroups },
  } = useContext(TableContext);

  return (
    <div class="thead">
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
