
export enum ROW_TYPE {
  TOTAL = 'TOTAL',
  ITEM = 'ITEM'
}

export const HtmlTableCustomCss = `
table tr.row-type--total td {
  border-top: 1px solid #bbb;
  border-bottom: 3px double #000;
  font-weight: 600;
}
`;