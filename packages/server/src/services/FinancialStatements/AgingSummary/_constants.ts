export enum AgingSummaryRowType {
  Contact = 'contact',
  Total = 'total',
}

export const HtmlTableCss = `
table tr.row-type--total td{
  font-weight: 600;
  border-top: 1px solid #bbb;
  border-bottom: 3px double #333;
}

table .column--current,
table .column--aging_period,
table .column--total,
table .cell--current,
table .cell--aging_period,
table .cell--total  {
  text-align: right;
}
`;
