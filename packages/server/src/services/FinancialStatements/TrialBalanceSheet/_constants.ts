export enum IROW_TYPE {
  ACCOUNT = 'ACCOUNT',
  TOTAL = 'TOTAL',
}

export const HtmlTableCustomCss = `
table tr.row-type--total td{
  border-top: 1px solid #bbb;
  font-weight: 600;
  border-bottom: 3px double #000;
}

table .column--account {
  width: 400px;
}

table .column--debit,
table .column--credit,
table .column--total,
table .cell--debit,
table .cell--credit,
table .cell--total{
  text-align: right;
}
`;
