import React, { useContext } from 'react';
import classNames from 'classnames';
import { If } from 'components';
import { ConditionalWrapper } from 'utils';
import TableContext from './TableContext';

/**
 * Tabl cell.
 */
export default function TableCell({
  cell,
  row: { depth, getToggleRowExpandedProps, isExpanded },
  index,
}) {
  const {
    props: { expandToggleColumn, expandColumnSpace, expandable },
  } = useContext(TableContext);

  const isExpandColumn = expandToggleColumn === index;

  return (
    <div
      {...cell.getCellProps({
        className: classNames(cell.column.className, 'td', {
          'is-text-overview': cell.column.textOverview,
        }),
      })}
    >
      <div
        className={classNames({
          'text-overview': cell.column.textOverview,
        })}
        style={{
          'padding-left':
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
