import React, { useContext } from "react";
import TableContext from "./TableContext";

/**
 * Table rows.
 */
export default function TableRows() {
  const {
    table: { prepareRow, page },
    props: { TableRowRenderer, TableCellRenderer },
  } = useContext(TableContext);

  return page.map((row) => {
    prepareRow(row);
    return <TableRowRenderer row={row} TableCellRenderer={TableCellRenderer} />;
  });
}