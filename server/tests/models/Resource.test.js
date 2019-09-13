import { create, expect } from '~/testInit';
import Resource from '@/models/Resource';
import '@/models/View';
import '@/models/ResourceField';

describe('Model: Resource', () => {
  it('Resource model may has many associated views.', async () => {
    const view = await create('view');
    await create('view', { resource_id: view.resource_id });

    const resourceModel = await Resource.where('id', view.resource_id).fetch();
    const resourceViews = await resourceModel.views().fetch();

    expect(resourceViews).to.have.lengthOf(2);
  });

  it('Resource model may has many fields.', async () => {
    const resourceField = await create('resource_field');

    const resourceModel = await Resource.where('id', resourceField.resource_id).fetch();
    const resourceFields = await resourceModel.fields().fetch();

    expect(resourceFields).to.have.lengthOf(1);
  });
});
