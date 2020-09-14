import { create, expect } from '~/testInit';
import View from 'models/View';
import Resource from 'models/Resource';
import ResourceField from 'models/ResourceField';
import ViewRole from 'models/ViewRole';
import {
  tenantWebsite,
  tenantFactory,
  loginRes
} from '~/dbInit';


describe('Model: View', () => {
  it('View model may has many associated resource.', async () => {
    const view = await tenantFactory.create('view');

    const viewModel = await View.tenant().query().findById(view.id);
    const viewResource = await viewModel.$relatedQuery('resource');

    const foundResource = await Resource.tenant().query().findById(view.resourceId);

    expect(viewResource.id).equals(foundResource.id);
    expect(viewResource.name).equals(foundResource.name);
  });

  it('View model may has many associated view roles.', async () => {
    const view = await tenantFactory.create('view');
    await tenantFactory.create('view_role', { view_id: view.id });
    await tenantFactory.create('view_role', { view_id: view.id });

    const viewModel = await View.tenant().query().findById(view.id);
    const viewRoles = await viewModel.$relatedQuery('roles');

    expect(viewRoles).to.have.lengthOf(2);
  });

  it('View model may has many associated view columns', async () => {
    const view = await tenantFactory.create('view');
    await tenantFactory.create('view_column', { view_id: view.id });
    await tenantFactory.create('view_column', { view_id: view.id });

    const viewModel = await View.tenant().query().findById(view.id);
    const viewColumns = await viewModel.$relatedQuery('columns');

    expect(viewColumns).to.have.lengthOf(2);
  });
});
