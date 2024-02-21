export enum ROW_TYPE {
  ITEM = 'ITEM',
  TOTAL = 'TOTAL',
}

export const HtmlTableCustomCss = `
table tr.row-type--total td {
  border-top: 1px solid #bbb;
  font-weight: 600;
  border-bottom: 3px double #000;
}
`;
