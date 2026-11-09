import classNames from 'classnames';
import React, { useContext } from 'react';
import TableContext from './TableContext';

export default function TableFooter() {
  const {
    props: { footer },
    table: { footerGroups },
  } = useContext(TableContext);

  if (!footer) {
    return null;
  }

  return (
    <div className="tfooter">
      {footerGroups.map((group) => (
        <div {...group.getFooterGroupProps({ className: 'tr' })}>
          {group.headers.map((column) => (
            <div
              {...column.getFooterProps({
                className: classNames(column.className || '', 'td'),
              })}
            >
              <div className={'cell-inner'}>{column.render('Footer')}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
