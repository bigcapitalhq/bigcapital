import { create, expect } from '~/testInit';
import Resource from '@/models/Resource';
import ResourceField from '@/models/ResourceField';
import '@/models/View';

describe('Model: ResourceField', () => {
  it('Resource field model may belongs to associated resource.', async () => {
    const resourceField = await create('resource_field');

    const resourceFieldModel = await ResourceField.where('id', resourceField.id).fetch();
    const resourceModel = resourceFieldModel.resource().fetch();

    const foundResource = await Resource.where('id', resourceField.resource_id).fetch();

    expect(resourceModel.attributes.id).equals(foundResource.id);
    expect(resourceModel.attributes.name).equals(foundResource.name);
  });
});
