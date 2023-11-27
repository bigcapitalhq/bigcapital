import { get } from 'lodash';
import { IColumnMapperMeta, ITableRow } from '@/interfaces';

export function tableMapper(
  data: Object[],
  columns: IColumnMapperMeta[],
  rowsMeta
): ITableRow[] {
  return data.map((object) => tableRowMapper(object, columns, rowsMeta));
}

function getAccessor(object, accessor) {
  return typeof accessor === 'function'
    ? accessor(object)
    : get(object, accessor);
}

export function tableRowMapper(
  object: Object,
  columns: IColumnMapperMeta[],
  rowMeta
): ITableRow {
  const cells = columns.map((column) => ({
    key: column.key,
    value: column.value
      ? column.value
      : getAccessor(object, column.accessor) || '',
  }));

  return {
    cells,
    ...rowMeta,
  };
}
