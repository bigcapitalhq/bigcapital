import { create, expect } from '~/testInit';
import 'models/Item';
import ItemCategory from 'models/ItemCategory';
import {
  tenantWebsite,
  tenantFactory,
  loginRes
} from '~/dbInit';


describe('Model: ItemCategories', () => {
  it('Should item category model has many associated items.', async () => {
    const category = await tenantFactory.create('item_category');
    await tenantFactory.create('item', { category_id: category.id });
    await tenantFactory.create('item', { category_id: category.id });

    const categoryModel = await ItemCategory.tenant().query()
      .where('id', category.id).first();

    const categoryItems = await categoryModel.$relatedQuery('items');

    expect(categoryItems.length).equals(2);
  });
});
