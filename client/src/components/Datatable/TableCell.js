import React, { useContext } from 'react';
import classNames from 'classnames';
import { If } from 'components';
import { ConditionalWrapper } from 'utils';
import TableContext from './TableContext';

/**
 * Tabl cell.
 */
export default function TableCell({ cell, row, index }) {
  const {
    props: { expandToggleColumn, expandable }
  } = useContext(TableContext);

  return (
    <div
      {...cell.getCellProps({
        className: classNames(cell.column.className, 'td', {
          'is-text-overview': cell.column.textOverview,
        }),
      })}
    >
      {
        // Use the row.canExpand and row.getToggleRowExpandedProps prop getter
        // to build the toggle for expanding a row
      }
      <If
        condition={
          cell.row.canExpand && expandable && index === expandToggleColumn
        }
      >
        <span
          {...row.getToggleRowExpandedProps({ className: 'expand-toggle' })}
        >
          <span
            className={classNames({
              'arrow-down': row.isExpanded,
              'arrow-right': !row.isExpanded,
            })}
          />
        </span>
      </If>

      <ConditionalWrapper
        condition={cell.column.textOverview}
        wrapper={(children) => <span class="text-overview">{children}</span>}
      >
        {cell.render('Cell')}
      </ConditionalWrapper>
    </div>
  );
}
