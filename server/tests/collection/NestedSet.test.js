import { expect } from '~/testInit';
import NestedSet from '@/collection/NestedSet';

describe('NestedSet', () => {
  describe('linkChildren()', () => {  
    it('Should link parent and children nodes.', () => {
      const flattenArray = [
        { id: 10 },
        { id: 1 },
        {
          id: 3,
          parent_id: 1,
        },
        {
          id: 2,
          parent_id: 1,
        },
        {
          id: 4,
          parent_id: 3,
        },
      ];
      const nestSet = new NestedSet(flattenArray);
      const treeGroups = nestSet.linkChildren();

      expect(treeGroups['1']).deep.equals({
        id: 1,
        children: {
          '2': { id: 2, parent_id: 1, children: {} },
          '3': {
            id: 3, parent_id: 1, children: {
              '4': { id: 4, parent_id: 3, children: {} }
            }
          }
        }
      });
      expect(treeGroups['2']).deep.equals({
        id: 2, parent_id: 1, children: {},
      });
      expect(treeGroups['3']).deep.equals({      
        id: 3,
        parent_id: 1,
        children: { '4': { id: 4, parent_id: 3, children: {} } }
      });
      expect(treeGroups['4']).deep.equals({
        id: 4, parent_id: 3, children: {},
      });
    });
  });

  describe('toArray()', () => {
    it('Should retrieve nested sets as array.', () => {
      const flattenArray = [
        { id: 10 },
        { id: 1 },
        {
          id: 3,
          parent_id: 1,
        },
        {
          id: 2,
          parent_id: 1,
        },
        {
          id: 4,
          parent_id: 3,
        },
      ];
      const nestSet = new NestedSet(flattenArray);
      const treeArray = nestSet.toArray();

      expect(treeArray[0]).deep.equals({
        id: 10, children: [],
      });
      expect(treeArray[1]).deep.equals({
        id: 1,
        children: [
          { id: 2, parent_id: 1, children: [] },
          { id: 3, parent_id: 1, children: [{
            id: 4, parent_id: 3, children: []
          }] }
        ]
      });
    });
  });

  describe('getParents(id)', () => {
    it('Should retrieve parent nodes of the given node id.', () => {
      const flattenArray = [
        { id: 10 },
        { id: 1 },
        {
          id: 3,
          parent_id: 1,
        },
        {
          id: 2,
          parent_id: 1,
        },
        {
          id: 4,
          parent_id: 3,
        },
      ];
      const nestSet = new NestedSet(flattenArray);
      const parentNodes = nestSet.getParents(4);
    
      expect(parentNodes).deep.equals([
        { id: 4, parent_id: 3, children: {} },
        {      
          id: 3,
          parent_id: 1,
          children: { '4': { id: 4, parent_id: 3, children: {} } } 
        },
        {
          id: 1,
          children: {
            '2': { id: 2, parent_id: 1, children: {} },
            '3': {
              id: 3, parent_id: 1, children: {
                '4': { id: 4, parent_id: 3, children: {} }
              }
            }
          }
        }
      ]);
    });
  })

});
