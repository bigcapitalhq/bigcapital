// @ts-nocheck
import React, { useContext } from 'react';
import classNames from 'classnames';
import { camelCase} from 'lodash';

import { If, Skeleton } from '@/components';
import { useAppIntlContext } from '@/components/AppIntlProvider';
import TableContext from './TableContext';
import { saveInvoke, ignoreEventFromSelectors } from '@/utils';
import { isCellLoading } from './utils';

const ROW_CLICK_SELECTORS_INGORED = ['.expand-toggle', '.selection-checkbox'];

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

  // Determines whether the current cell is loading.
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
    if (ignoreEventFromSelectors(event, ROW_CLICK_SELECTORS_INGORED)) {
      return;
    }
    saveInvoke(onCellClick, cell, event);
  };  
  const cellType = camelCase(cell.column.Cell.cellType) || 'text';

  return (
    <div
      {...cell.getCellProps({
        className: classNames(cell.column.className, 'td', {
          'is-text-overview': cell.column.textOverview,
          clickable: cell.column.clickable,
          'align-right': cell.column.align === 'right',
          'align-center': cell.column.align === 'center',
          [`td-${cell.column.id}`]: cell.column.id,
          [`td-${cellType}-type`]: !!cellType,
        }),
        tabindex: 0,
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
          <span
            {...getToggleRowExpandedProps({
              className: 'expand-toggle',
            })}
            style={{}}
          >
            <span
              className={classNames('expand-arrow', {
                'is-expanded': isExpanded,
              })}
            />
          </span>
        </If>

        {cell.render('Cell')}
      </div>
    </div>
  );
}
