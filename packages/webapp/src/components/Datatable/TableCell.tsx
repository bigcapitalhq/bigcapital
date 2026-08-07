import classNames from 'classnames';
import { camelCase } from 'lodash';
import React, { useContext } from 'react';
import { MoneyDisplay } from '../Money/MoneyDisplay';
import TableContext from './TableContext';
import { isCellLoading } from './utils';
import type { Cell, Row } from 'react-table';
import { If, Skeleton } from '@/components';
import { useAppIntlContext } from '@/components/AppIntlProvider';
import { saveInvoke, ignoreEventFromSelectors } from '@/utils';

const ROW_CLICK_SELECTORS_INGORED = ['.expand-toggle', '.selection-checkbox'];

interface TableCellProps {
  cell: Cell<any>;
  row: Row<any>;
  index?: number;
}

export default function TableCell({ cell, row, index }: TableCellProps) {
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
  const { skeletonWidthMax = 100, skeletonWidthMin = 40 } = cell.column;

  const { isRTL } = useAppIntlContext();

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
  const handleCellClick = (event: React.MouseEvent) => {
    if (ignoreEventFromSelectors(event, ROW_CLICK_SELECTORS_INGORED)) {
      return;
    }
    saveInvoke(onCellClick, cell, event);
  };
  const cellType =
    camelCase((cell.column.Cell as { cellType?: string }).cellType) || 'text';

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
      })}
      tabIndex={0}
      onClick={handleCellClick}
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
              ? `${depth * (expandColumnSpace ?? 0)}rem`
              : '',
        }}
      >
        <If condition={cell.row.canExpand && !!expandable && isExpandColumn}>
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

        {cell.column?.money ? (
          <MoneyDisplay>{cell.render('Cell')}</MoneyDisplay>
        ) : (
          <>{cell.render('Cell')}</>
        )}
      </div>
    </div>
  );
}
