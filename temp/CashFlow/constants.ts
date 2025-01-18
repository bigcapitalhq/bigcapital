import { ICashFlowStatementQuery } from "./Cashflow.types";

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

export const getDefaultCashflowQuery = (): ICashFlowStatementQuery => ({
  displayColumnsType: 'total',
  displayColumnsBy: 'day',
  fromDate: moment().startOf('year').format('YYYY-MM-DD'),
  toDate: moment().format('YYYY-MM-DD'),
  numberFormat: {
    precision: 2,
    divideOn1000: false,
    showZero: false,
    formatMoney: 'total',
    negativeFormat: 'mines',
  },
  noneZero: false,
  noneTransactions: false,
  basis: 'cash',
});
