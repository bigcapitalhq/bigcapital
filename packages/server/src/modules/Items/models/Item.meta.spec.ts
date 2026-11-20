import { ITEM_UNITS, ItemsSampleData } from '../Items.constants';
import { ItemMeta } from './Item.meta';

describe('ItemMeta unit', () => {
  it('maps the unit column on import with every unit as an option', () => {
    const field: any = (ItemMeta.fields2 as any).unit;

    expect(field).toBeDefined();
    expect(field.fieldType).toBe('enumeration');
    expect(field.options.map((option) => option.key)).toEqual([...ITEM_UNITS]);
  });

  it('exports the unit column', () => {
    const column: any = (ItemMeta.columns as any).unit;

    expect(column).toBeDefined();
    expect(column.exportable).toBe(true);
  });

  it('includes a unit column in the import sample', () => {
    ItemsSampleData.forEach((row) => expect(row).toHaveProperty('Unit'));
  });
});
