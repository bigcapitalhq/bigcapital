import React, { useContext } from 'react';
import classNames from 'classnames';
import { If } from 'components';
import { Skeleton } from 'components';
import TableContext from './TableContext';
import { isCellLoading } from './utils';

/**
 * Table cell.
 */
export default function TableCell({
  cell,
  row: { index: rowIndex, depth, getToggleRowExpandedProps, isExpanded },
  index,
}) {
  const {
    props: {
      expandToggleColumn,
      expandColumnSpace,
      expandable,
      cellsLoading,
      cellsLoadingCoords,
    },
  } = useContext(TableContext);

  const isExpandColumn = expandToggleColumn === index;
  const { skeletonWidthMax = 100, skeletonWidthMin = 40 } = {};

  // Detarmines whether the current cell is loading.
  const cellLoading = isCellLoading(
    cellsLoading,
    cellsLoadingCoords,
    rowIndex,
    cell.column.id,
  );

  if (cellLoading) {
    return (
      <div
        {...cell.getCellProps({
          className: classNames(cell.column.className, 'td'),
        })}
      >
        <Skeleton minWidth={skeletonWidthMin} maxWidth={skeletonWidthMax} />
      </div>
    );
  }

  return (
    <div
      {...cell.getCellProps({
        className: classNames(cell.column.className, 'td', {
          'is-text-overview': cell.column.textOverview,
        }),
      })}
    >
      <div
        className={classNames(
          {
            'text-overview': cell.column.textOverview,
          },
          'cell-inner',
        )}
        style={{
          paddingLeft:
            isExpandColumn && expandable
              ? `${depth * expandColumnSpace}rem`
              : '',
        }}
      >
        {
          // Use the row.canExpand and row.getToggleRowExpandedProps prop getter
          // to build the toggle for expanding a row
        }
        <If condition={cell.row.canExpand && expandable && isExpandColumn}>
          <span {...getToggleRowExpandedProps({ className: 'expand-toggle' })}>
            <span
              className={classNames({
                'arrow-down': isExpanded,
                'arrow-right': !isExpanded,
              })}
            />
          </span>
        </If>

        {cell.render('Cell')}
      </div>
    </div>
  );
}
