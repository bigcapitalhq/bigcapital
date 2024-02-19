export enum IROW_TYPE {
  ACCOUNT = 'ACCOUNT',
  TOTAL = 'TOTAL',
}

export const HtmlTableCustomCss = `
table tr.row-type--total td{
  border-top: 1px solid #bbb;
  font-weight: 500;
  border-bottom: 3px double #000;
}
`;
