import { ProfitLossNodeType } from '@/interfaces';

export const MAP_CONFIG = { childrenPath: 'children', pathFormat: 'array' };

export const DISPLAY_COLUMNS_BY = {
  DATE_PERIODS: 'date_periods',
  TOTAL: 'total',
};

export enum IROW_TYPE {
  AGGREGATE = 'AGGREGATE',
  ACCOUNTS = 'ACCOUNTS',
  ACCOUNT = 'ACCOUNT',
  TOTAL = 'TOTAL',
}

export const TOTAL_NODE_TYPES = [
  ProfitLossNodeType.ACCOUNTS,
  ProfitLossNodeType.AGGREGATE,
  ProfitLossNodeType.EQUATION
];

export const HtmlTableCustomCss =`
table tr.row-type--total td {
  font-weight: 600;
  border-top: 1px solid #bbb;
  color: #000;
}
table tr.row-id--net-income td{
  border-bottom: 3px double #000;
}
table .column--name,
table .cell--name {
  width: 400px;
}

table .column--total {
  width: 25%;
}
table td.cell--total,
table td.cell--previous_year,
table td.cell--previous_year_change,
table td.cell--previous_year_percentage,

table td.cell--previous_period,
table td.cell--previous_period_change,
table td.cell--previous_period_percentage,

table td.cell--percentage_of_row,
table td.cell--percentage_of_column,
table td[class*="cell--date-range"] {
  text-align: right;
}

table .column--total,
table .column--previous_year,
table .column--previous_year_change,
table .column--previous_year_percentage,

table .column--previous_period,
table .column--previous_period_change,
table .column--previous_period_percentage,

table .column--percentage_of_row,
table .column--percentage_of_column,
table [class*="column--date-range"] {
  text-align: right;
}
`;