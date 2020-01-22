import { create, expect } from '~/testInit';
import Option from '@/models/Option';
import MetableCollection from '@/lib/Metable/MetableCollection';

describe('Model: Option', () => {
  it('Should result collection be instance of `MetableCollection` class.', async () => {
    await create('option');
    await create('option');
    const options = await Option.query();

    expect(options).to.be.an.instanceof(MetableCollection);
  });
});
