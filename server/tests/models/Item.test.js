import { create, expect } from '~/testInit';
import Item from '@/models/Item';
// eslint-disable-next-line no-unused-vars
import itemCategory from '@/models/ItemCategory';
import '@/models/ItemMetadata';

describe('Model: Item', () => {
  it('Should item model belongs to the associated category model.', async () => {
    const category = await create('item_category');
    const item = await create('item', { category_id: category.id });

    const itemModel = await Item.query().where('id', item.id);
    const itemCategoryModel = await itemModel.$relatedQuery('category');

    expect(itemCategoryModel.attributes.id).equals(category.id);
  });

  it('Should item model has many metadata that assciated to the item model.', async () => {
    const item = await create('item');
    await create('item_metadata', { item_id: item.id });
    await create('item_metadata', { item_id: item.id });

    const itemModel = await Item.query().where('id', item.id);
    const itemMetadataCollection = await itemModel.$relatedQuery('metadata');

    expect(itemMetadataCollection.length).equals(2);
  });
});
