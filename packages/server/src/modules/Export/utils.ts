import { flatMap, get } from 'lodash';
/**
 * Flattens the data based on a specified attribute.
 * @param data - The data to be flattened.
 * @param flattenAttr - The attribute to be flattened.
 * @returns - The flattened data.
 */
export const flatDataCollections = (
  data: Record<string, any>,
  flattenAttr: string
): Record<string, any>[] => {
  return flatMap(data, (item) =>
    item[flattenAttr].map((entry) => ({
      ...item,
      [flattenAttr]: entry,
    }))
  );
};

/**
 * Gets the data accessor for a given column.
 * @param col - The column to get the data accessor for.
 * @returns - The data accessor.
 */
export const getDataAccessor = (col: any) => {
  return col.group ? `${col.group}.${col.accessor}` : col.accessor;
};

/**
 * Maps the data retrieved from the service layer to the pdf document.
 * @param {any} columns
 * @param {Record<stringm any>} data
 * @returns
 */
export const mapPdfRows = (columns: any, data: Record<string, any>) => {
  return data.map((item) => {
    const cells = columns.map((column) => {
      return {
        key: column.accessor,
        value: get(item, getDataAccessor(column)),
      };
    });
    return { cells, classNames: '' };
  });
};
