import { flatToNestedArray } from './flat-to-nested-array';

const config = { id: 'id', parentId: 'parentAccountId' };

describe('flatToNestedArray', () => {
  it('nests children under their parents', () => {
    const tree = flatToNestedArray(
      [
        { id: 1, parentAccountId: null },
        { id: 2, parentAccountId: 1 },
        { id: 3, parentAccountId: 2 },
      ],
      config,
    );
    expect(tree).toHaveLength(1);
    expect(tree[0].children[0].id).toBe(2);
    expect(tree[0].children[0].children[0].id).toBe(3);
  });

  it('puts an item whose parent is missing at the top level', () => {
    // e.g. a chart of accounts search that matches only a sub-account.
    const tree = flatToNestedArray(
      [
        { id: 1172, parentAccountId: 1079 },
        { id: 1173, parentAccountId: 1079 },
      ],
      config,
    );
    expect(tree.map((a) => a.id)).toEqual([1172, 1173]);
    expect(tree[0].children).toEqual([]);
  });

  it('keeps found children under a found parent', () => {
    const tree = flatToNestedArray(
      [
        { id: 2, parentAccountId: 1 },
        { id: 1, parentAccountId: null },
        { id: 5, parentAccountId: 99 },
      ],
      config,
    );
    expect(tree.map((a) => a.id)).toEqual([1, 5]);
    expect(tree[0].children.map((a) => a.id)).toEqual([2]);
  });
});
