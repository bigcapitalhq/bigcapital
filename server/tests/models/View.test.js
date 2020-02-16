import { create, expect } from '~/testInit';
import View from '@/models/View';
import Resource from '@/models/Resource';
import ResourceField from '@/models/ResourceField';
import ViewRole from '@/models/ViewRole';

describe('Model: View', () => {
  it('View model may has many associated resource.', async () => {
    const view = await create('view');

    const viewModel = await View.query().findById(view.id);
    const viewResource = await viewModel.$relatedQuery('resource');

    const foundResource = await Resource.query().findById(view.resourceId);

    expect(viewResource.id).equals(foundResource.id);
    expect(viewResource.name).equals(foundResource.name);
  });

  it('View model may has many associated view roles.', async () => {
    const view = await create('view');
    await create('view_role', { view_id: view.id });
    await create('view_role', { view_id: view.id });

    const viewModel = await View.query().findById(view.id);
    const viewRoles = await viewModel.$relatedQuery('viewRoles');

    expect(viewRoles).to.have.lengthOf(2);
  });

  it('View model may has many associated view columns', async () => {
    const view = await create('view');
    await create('view_column', { view_id: view.id });
    await create('view_column', { view_id: view.id });

    const viewModel = await View.query().findById(view.id);
    const viewColumns = await viewModel.$relatedQuery('columns');

    expect(viewColumns).to.have.lengthOf(2);
  });
});
