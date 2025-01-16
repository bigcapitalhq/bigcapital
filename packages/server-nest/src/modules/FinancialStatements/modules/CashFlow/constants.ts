export const DISPLAY_COLUMNS_BY = {
  DATE_PERIODS: 'date_periods',
  TOTAL: 'total',
};

export const MAP_CONFIG = { childrenPath: 'children', pathFormat: 'array' };
export const HtmlTableCustomCss = `
table tr.row-type--accounts td {
  border-top: 1px solid #bbb;
}
table tr.row-id--cash-end-period td {
  border-bottom: 3px double #333;
}
table tr.row-type--total {
  font-weight: 600;
}
table tr.row-type--total td { 
  color: #000;
}
table tr.row-type--total:not(:first-child) td {
  border-top: 1px solid #bbb;
}
table .column--name,
table .cell--name {
  width: 400px;
}
table .column--total,
table .cell--total,
table [class*="column--date-range"],
table [class*="cell--date-range"] {
  text-align: right;
}
`;
