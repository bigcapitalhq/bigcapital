import { ITableRow } from '@/interfaces';
import { flatNestedTree } from '@/utils/deepdash';
import { repeat } from 'lodash';

interface FlatNestTreeOpts {
  nestedPrefix?: string;
  nestedPrefixIndex?: number;
}

export class FinancialTableStructure {
  /**
   * Converts the given table object with nested rows in flat rows.
   * @param {ITableRow[]}
   * @param {FlatNestTreeOpts}
   * @returns {ITableRow[]}
   */
  public static flatNestedTree = (
    obj: ITableRow[],
    options?: FlatNestTreeOpts
  ): ITableRow[] => {
    const parsedOptions = {
      nestedPrefix: '   ',
      nestedPrefixIndex: 0,
      ...options,
    };
    const { nestedPrefixIndex, nestedPrefix } = parsedOptions;

    return flatNestedTree(
      obj,
      (item, key, context) => {
        const cells = item.cells.map((cell, index) => {
          return {
            ...cell,
            value:
              (context.depth > 1 && nestedPrefixIndex === index
                ? repeat(nestedPrefix, context.depth)
                : '') + cell.value,
          };
        });
        return {
          ...item,
          cells,
        };
      },
      parsedOptions
    );
  };
}
