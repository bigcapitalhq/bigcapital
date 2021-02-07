import React, { useContext } from 'react';
import TableContext from './TableContext';
import { Skeleton } from 'components';

function TableHeaderCell({ column }) {
  const { skeletonWidthMax = 100, skeletonWidthMin = 40 } = column;

  return (
    <div
      {...column.getHeaderProps({
        className: 'th',
      })}
    >
      <Skeleton minWidth={skeletonWidthMin} maxWidth={skeletonWidthMax} />
    </div>
  );
}

/**
 * Table skeleton rows.
 */
export default function TableSkeletonHeader({}) {
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
