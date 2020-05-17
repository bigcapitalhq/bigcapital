import { create, expect } from '~/testInit';
import Option from '@/models/Option';
import MetableCollection from '@/lib/Metable/MetableCollection';
import {
  tenantFactory,
  tenantWebsite,
} from '~/dbInit';


describe('Model: Option', () => {
  it('Should result collection be instance of `MetableCollection` class.', async () => {
    await tenantFactory.create('option');
    await tenantFactory.create('option');
    const options = await Option.tenant().query();

    expect(options).to.be.an.instanceof(MetableCollection);
  });
});
