import { create, expect } from '~/testInit';
import View from '@/models/View';
import Resource from '@/models/Resource';
import '@/models/ResourceField';
import '@/models/ViewRole';


describe('Model: View', () => {
  it('View model may has many associated resource.', async () => {
    const view = await create('view');

    const viewModel = await View.where('id', view.id).fetch();
    const viewResource = await viewModel.resource().fetch();

    const foundResource = await Resource.where('id', view.resource_id).fetch();

    expect(viewResource.attributes.id).equals(foundResource.id);
    expect(viewResource.attributes.name).equals(foundResource.attributes.name);
  });

  it('View model may has many associated view roles.', async () => {
    const view = await create('view');
    await create('view_role', { view_id: view.id });
    await create('view_role', { view_id: view.id });

    const viewModel = await View.where('id', view.id).fetch();
    const viewRoles = await viewModel.viewRoles().fetch();

    expect(viewRoles).to.have.lengthOf(2);
  });

  it('View model may has many associated view columns', async () => {
    const view = await create('view');
    await create('view_has_columns', { view_id: view.id });
    await create('view_has_columns', { view_id: view.id });

    const viewModel = await View.where('id', view.id).fetch();
    const viewColumns = await viewModel.columns().fetch();

    expect(viewColumns).to.have.lengthOf(2);
  });
});
