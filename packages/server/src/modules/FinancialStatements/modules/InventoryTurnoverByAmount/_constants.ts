import * as moment from 'moment';

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

export const getInventoryTurnoverByAmountDefaultQuery = () => {
  return {
    fromDate: moment().startOf('month').format('YYYY-MM-DD'),
    toDate: moment().format('YYYY-MM-DD'),
    itemsIds: [],
    numberFormat: {
      precision: 2,
      divideOn1000: false,
      showZero: false,
      formatMoney: 'always',
      negativeFormat: 'mines',
    },
    warehousesIds: [],
    branchesIds: [],
  };
};
