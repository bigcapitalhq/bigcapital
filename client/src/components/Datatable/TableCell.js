import React, { useContext } from 'react';
import classNames from 'classnames';
import { If } from 'components';
import { Skeleton } from 'components';
import { useAppIntlContext } from 'components/AppIntlProvider';
import TableContext from './TableContext';
import { saveInvoke } from 'utils';
import { isCellLoading } from './utils';

/**
 * Table cell.
 */
export default function TableCell({ cell, row, index }) {
  const { index: rowIndex, depth, getToggleRowExpandedProps, isExpanded } = row;
  const {
    props: {
      expandToggleColumn,
      expandColumnSpace,
      expandable,
      cellsLoading,
      cellsLoadingCoords,
      onCellClick,
    },
  } = useContext(TableContext);

  const isExpandColumn = expandToggleColumn === index;
  const { skeletonWidthMax = 100, skeletonWidthMin = 40 } = {};

  // Application intl context.
  const { isRTL } = useAppIntlContext();

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
  // Handle cell click action.
  const handleCellClick = (event) => {
    saveInvoke(onCellClick, cell, event);
  };

  return (
    <div
      {...cell.getCellProps({
        className: classNames(cell.column.className, 'td', {
          'is-text-overview': cell.column.textOverview,
          'clickable': cell.column.clickable,
          'align-right': cell.column.align === 'right',
        }),
        onClick: handleCellClick,
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
          [isRTL ? 'paddingRight' : 'paddingLeft']:
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
