import 'models/ResourceField';
import 'models/View';
import { tenantFactory } from '~/dbInit';
import { expect } from '~/testInit';
import Resource from '../models/Resource';

describe('Model: Resource', () => {
  it('Resource model may has many associated views.', async () => {
    const view = await tenantFactory.create('view');
    await tenantFactory.create('view', { resource_id: view.resourceId });

    const resourceModel = await Resource.tenant().query().findById(view.resourceId);
    const resourceViews = await resourceModel.$relatedQuery('views');

    expect(resourceViews).to.have.lengthOf(2);
  });

  it('Resource model may has many fields.', async () => {
    const resourceField = await tenantFactory.create('resource_field');

    const resourceModel = await Resource.tenant().query().findById(resourceField.resourceId);
    const resourceFields = await resourceModel.$relatedQuery('fields');

    expect(resourceFields).to.have.lengthOf(1);
  });
});
