export interface IColumnMapperMeta {
  key: string;
  accessor?: string;
  value?: string;
}

export interface ITableCell {
  value: string;
  key: string;
}

export type ITableRow = {
  cells: ITableCell[];
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
