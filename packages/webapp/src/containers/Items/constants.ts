import intl from 'react-intl-universal';

/**
 * Units of measure an item can be measured in.
 * Keep in sync with the server `ITEM_UNITS` constant.
 */
export const ITEM_UNITS = [
  'piece',
  'dozen',
  'pair',
  'set',
  'pack',
  'box',
  'kg',
  'g',
  'lb',
  'oz',
  'l',
  'ml',
  'm',
  'cm',
  'm2',
  'm3',
  'hour',
  'day',
] as const;

export const DEFAULT_ITEM_UNIT = 'piece';

export type ItemUnit = (typeof ITEM_UNITS)[number];

export const getItemUnitOptions = (): Array<{
  value: ItemUnit;
  label: string;
}> =>
  ITEM_UNITS.map((value) => ({
    value,
    label: intl.get(`item.unit.${value}`),
  }));
