// @ts-nocheck
import React, { useContext } from 'react';
import classNames from 'classnames';
import TableContext from './TableContext';

/**
 * Table footer.
 */
export default function TableFooter() {
  const {
    props: { footer },
    table: { footerGroups },
  } = useContext(TableContext);

  // Can't continue if the footer is disabled.
  if (!footer) { return null; }
  
  return (
    <div class="tfooter">
      {footerGroups.map((group) => (
        <div {...group.getFooterGroupProps({ className: 'tr' })}>
          {group.headers.map((column) => (
            <div
              {...column.getFooterProps({
                className: classNames(column.className || '', 'td'),
              })}
            >
              <div className={'cell-inner'}>
                {column.render('Footer')}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
