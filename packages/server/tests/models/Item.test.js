import Item from 'models/Item';
import { tenantFactory } from '~/dbInit';
import { expect } from '~/testInit';

describe('Model: Item', () => {
  it('Should item model belongs to the associated category model.', async () => {
    const category = await tenantFactory.create('item_category');
    const item = await tenantFactory.create('item', { category_id: category.id });

    const itemModel = await Item.tenant().query().where('id', item.id).first();
    const itemCategoryModel = await itemModel.$relatedQuery('category');

    expect(itemCategoryModel.id).equals(category.id);
  });
});
