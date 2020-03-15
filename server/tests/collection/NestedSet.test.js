import { expect } from '~/testInit';
import NestedSet from '@/collection/NestedSet';

describe('NestedSet', () => {
  it('Should link parent and children nodes.', () => {
    const flattenArray = [
      { id: 1 },
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
    const treeGroups = collection.toTree();

    expect(treeGroups[0].id).equals(1);
    expect(treeGroups[0].children[0].id).equals(2);
    expect(treeGroups[0].children[1].id).equals(3);
    expect(treeGroups[0].children[1].children[0].id).equals(4);
  });

  it('Should flatten the nested set collection.', () => {
    const flattenArray = [
      { id: 1 },
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
    const treeGroups = collection.toTree();
    const flatten = collection.flattenTree();

    expect(flatten.length).equals(4);
    expect(flatten[0].id).equals(1);
    expect(flatten[1].id).equals(2);
    expect(flatten[2].id).equals(3);
    expect(flatten[3].id).equals(4);
  })
});
