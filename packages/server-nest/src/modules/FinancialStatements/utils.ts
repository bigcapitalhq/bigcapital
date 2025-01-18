import { kebabCase } from 'lodash';
import { ITableRow } from './types/Table.types';

export const formatNumber = (balance, { noCents, divideOn1000 }): string => {
  let formattedBalance: number = parseFloat(balance);

  if (noCents) {
    formattedBalance = parseInt(formattedBalance.toString(), 10);
  }
  if (divideOn1000) {
    formattedBalance /= 1000;
  }
  return formattedBalance.toString();
};

export const tableClassNames = (rows: ITableRow[]): ITableRow[] => {
  return rows.map((row) => {
    const classNames =
      row?.rowTypes?.map((rowType) => `row-type--${kebabCase(rowType)}`) || [];

    if (row.id) {
      classNames.push(`row-id--${kebabCase(row.id)}`);
    }

    return {
      ...row,
      classNames,
    };
  });
};
