export interface IColumnMapperMeta {
  key: string;
  accessor?: string | ((value: any) => string);
  value?: string;
}

export interface ITableCell {
  value: string;
  key: string;
}

export type ITableRow = {
  cells: ITableCell[];
  rowTypes?: Array<any>;
  id?: string;
};

export interface ITableColumn {
  key: string;
  label: string;
  cellIndex?: number;
  children?: ITableColumn[];
}

export interface ITable {
  columns: ITableColumn[];
  data: ITableRow[];
}

export interface ITableColumnAccessor {
  key: string;
  accessor: string;
}

export interface ITableData {
  columns: ITableColumn[];
  rows: ITableRow[];
}

export interface IFinancialTable {
  table: ITableData;
}

export interface IFinancialTableTotal {
  amount: number;
  formattedAmount: string;
  currencyCode: string;
}
