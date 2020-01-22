import { create, expect } from '~/testInit';
import Resource from '@/models/Resource';
import '@/models/View';
import '@/models/ResourceField';

describe('Model: Resource', () => {
  it('Resource model may has many associated views.', async () => {
    const view = await create('view');
    await create('view', { resource_id: view.resourceId });

    const resourceModel = await Resource.query().findById(view.resourceId);
    const resourceViews = await resourceModel.$relatedQuery('views');

    expect(resourceViews).to.have.lengthOf(2);
  });

  it('Resource model may has many fields.', async () => {
    const resourceField = await create('resource_field');

    const resourceModel = await Resource.query().findById(resourceField.resourceId);
    const resourceFields = await resourceModel.$relatedQuery('fields');

    expect(resourceFields).to.have.lengthOf(1);
  });
});
