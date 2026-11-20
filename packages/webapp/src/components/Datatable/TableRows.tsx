import React, { useContext } from 'react';
import TableContext from './TableContext';

export default function TableRows() {
  const {
    table: { prepareRow, page, rows },
    props: { TableRowRenderer, TableCellRenderer, pagination },
  } = useContext(TableContext);

  // usePagination always limits `page` to its page size, even without a paginator.
  return (
    <>
      {(pagination ? page : rows).map((row, index) => {
        prepareRow(row);
        return (
          <TableRowRenderer
            key={index}
            row={row}
            TableCellRenderer={TableCellRenderer}
          />
        );
      })}
    </>
  );
}
