import 'models/Item';
import ItemCategory from 'models/ItemCategory';
import { tenantFactory } from '~/dbInit';
import { expect } from '~/testInit';

describe('Model: ItemCategories', () => {
  it('Shoud item category model has many associated items.', async () => {
    const category = await tenantFactory.create('item_category');
    await tenantFactory.create('item', { category_id: category.id });
    await tenantFactory.create('item', { category_id: category.id });

    const categoryModel = await ItemCategory.tenant().query().where('id', category.id).first();

    const categoryItems = await categoryModel.$relatedQuery('items');

    expect(categoryItems.length).equals(2);
  });
});
