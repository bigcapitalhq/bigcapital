export const HtmlTableCustomCss = `
table tr:last-child td {
  border-bottom: 1px solid #ececec;
}
table tr.row-type--account td,
table tr.row-type--opening-balance td,
table tr.row-type--closing-balance td{
  font-weight: 600;
}
table tr.row-type--closing-balance td {
  border-bottom: 1px solid #ececec; 
}

table .column--debit,
table .column--credit,
table .column--amount,
table .column--running_balance,
table .cell--debit,
table .cell--credit,
table .cell--amount,
table .cell--running_balance{
  text-align: right;
}
table tr.row-type--account .cell--date span,
table tr.row-type--opening-balance .cell--account_name span,
table tr.row-type--closing-balance .cell--account_name span{
  white-space: nowrap;
}
`;