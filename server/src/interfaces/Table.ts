
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
  rows: ITableCell[];
};