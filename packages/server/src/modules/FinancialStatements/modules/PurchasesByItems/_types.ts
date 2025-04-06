export enum ROW_TYPE {
  TOTAL = 'TOTAL',
  ITEM = 'ITEM',
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
table .column--quantity_purchases,
table .column--purchase_amount,
table .column--average_cost,
table .cell--quantity_purchases,
table .cell--purchase_amount,
table .cell--average_cost{
  text-align: right;
}
`;
