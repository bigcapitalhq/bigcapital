import { expect } from '~/testInit';
import NestedSet from '@/collection/NestedSet';

describe('NestedSet', () => {
  it('Should link parent and children nodes.', () => {
    const flattenArray = [
      {
        id: 1,
      },
      {
        id: 2,
        parent_id: 1,
      },
      {
        id: 3,
        parent_id: 1,
      },
      {
        id: 4,
        parent_id: 3,
      },
    ];

    const collection = new NestedSet(flattenArray);

    expect(collection[0].id).equals(1);
    expect(collection[0].children[0].id).equals(2);
    expect(collection[0].children[1].id).equals(3);
    expect(collection[0].children[1].children[0].id).equals(4);
  });
});
