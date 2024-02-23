export enum ROW_TYPE {
  ITEM = 'ITEM',
  TOTAL = 'TOTAL',
}

export const HtmlTableCustomCss = `
table tr.row-type--total td {
  border-top: 1px solid #bbb;
  border-bottom: 3px double #000;
  font-weight: 600;
}
table .column--item_name{
  width: 300px;
}
table .column--average_price,
table .column--sold_quantity,
table .column--sold_amount,
table .cell--average_price,
table .cell--sold_quantity,
table .cell--sold_amount{
  text-align: right;
}
`;
