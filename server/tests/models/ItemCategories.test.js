import { create, expect } from '~/testInit';
import '@/models/Item';
import ItemCategory from '@/models/ItemCategory';

describe('Model: ItemCategories', () => {
  it('Shoud item category model has many associated items.', async () => {
    const category = await create('item_category');
    await create('item', { category_id: category.id });
    await create('item', { category_id: category.id });

    const categoryModel = await ItemCategory.where('id', category.id).fetch();
    const categoryItems = await categoryModel.items().fetch();

    expect(categoryItems.length).equals(2);
  });
});
