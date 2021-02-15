import React, { useContext } from 'react';
import TableContext from './TableContext';

/**
 * Table footer.
 */
export default function TableFooter() {
  const {
    table: { footerGroups },
  } = useContext(TableContext);

  return (
    <div class="tfooter">
      {footerGroups.map((group) => (
        <div {...group.getFooterGroupProps({ className: 'tr' })}>
          {group.headers.map((column) => (
            <div
              {...column.getFooterProps({
                className: 'td',
              })}
            >
              {column.render('Footer')}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
