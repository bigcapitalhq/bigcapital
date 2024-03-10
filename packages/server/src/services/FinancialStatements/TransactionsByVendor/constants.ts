export const HtmlTableCustomCss = `
table tr td:not(:first-child) {
  border-left: 1px solid #ececec;
}
table tr:last-child td {
  border-bottom: 1px solid #ececec; 
}
table .cell--credit,
table .cell--debit,
table .column--credit,
table .column--debit,
table .column--running_balance,
table .cell--running_balance{
  text-align: right;
}
table tr.row-type--closing-balance td,
table tr.row-type--opening-balance td {
  font-weight: 600;
}
table tr.row-type--vendor:not(:first-child) td {
  border-top: 1px solid #ddd;
}
`;
