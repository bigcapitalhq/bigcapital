import * as moment from 'moment';
import { IInventoryDetailsQuery } from './InventoryItemDetails.types';

export const HtmlTableCustomCss = `
table tr.row-type--item td, 
table tr.row-type--opening-entry td,
table tr.row-type--closing-entry td{
  font-weight: 500;
}
`;

export const getInventoryItemDetailsDefaultQuery =
  (): IInventoryDetailsQuery => {
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

export const MAP_CONFIG = { childrenPath: 'children', pathFormat: 'array' };

export enum INodeTypes {
  ITEM = 'item',
  TRANSACTION = 'transaction',
  OPENING_ENTRY = 'OPENING_ENTRY',
  CLOSING_ENTRY = 'CLOSING_ENTRY',
}
