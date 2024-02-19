export const MAP_CONFIG = { childrenPath: 'children', pathFormat: 'array' };

export const DISPLAY_COLUMNS_BY = {
  DATE_PERIODS: 'date_periods',
  TOTAL: 'total',
};

export enum IROW_TYPE {
  AGGREGATE = 'AGGREGATE',
  ACCOUNTS = 'ACCOUNTS',
  ACCOUNT = 'ACCOUNT',
  NET_INCOME = 'NET_INCOME',
  TOTAL = 'TOTAL',
}

export const HtmlTableCustomCss = `
table tr.row-type--total td {
  font-weight: 600;
  border-top: 1px solid #bbb;
  color: #000;  
}
table tr.row-type--total.row-id--assets td,
table tr.row-type--total.row-id--liability-equity td {
  border-bottom: 3px double #000;
}
`;
