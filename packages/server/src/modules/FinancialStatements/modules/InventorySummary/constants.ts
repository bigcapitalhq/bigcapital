import * as moment from 'moment';
import { IInventorySummaryQuery } from './InventorySummary.types';

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
table .column--item_name {
  width: 300px;
}
table .column--opening_stock,
table .column--quantity_in,
table .column--quantity_out,
table .column--closing_stock,
table .cell--opening_stock,
table .cell--quantity_in,
table .cell--quantity_out,
table .cell--closing_stock {
  text-align: right;
}
`;

export const getInventorySummaryDefaultQuery = (): IInventorySummaryQuery => {
  return {
    fromDate: moment().startOf('month').format('YYYY-MM-DD'),
    toDate: moment().format('YYYY-MM-DD'),
    itemsIds: [],
    numberFormat: {
      precision: 2,
      divideOn1000: false,
      showZero: false,
      formatMoney: 'total',
      negativeFormat: 'mines',
    },
    noneTransactions: false,
    branchesIds: [],
    warehousesIds: [],
  };
};
