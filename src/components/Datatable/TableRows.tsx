// @ts-nocheck
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

  return page.map((row, index) => {
    prepareRow(row);
    return <TableRowRenderer key={index} row={row} TableCellRenderer={TableCellRenderer} />;
  });
}