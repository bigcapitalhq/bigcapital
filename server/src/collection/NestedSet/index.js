
export default class NestedSet {
  /**
   * Constructor method.
   * @param {Object} options -
   */
  constructor(items, options) {
    this.options = {
      parentId: 'parent_id',
      id: 'id',
      ...options,
    };
    this.items = items;
    this.collection = {};
    this.toTree();

    return this.collection;
  }

  /**
   * Link nodes children.
   */
  linkChildren() {
    if (this.items.length <= 0) return false;

    const map = {};
    this.items.forEach((item) => {
      map[item.id] = item;
      map[item.id].children = [];
    });

    this.items.forEach((item) => {
      const parentNodeId = item[this.options.parentId];
      if (parentNodeId) {
        map[parentNodeId].children.push(item);
      }
    });
    return map;
  }

  toTree() {
    const map = this.linkChildren();
    const tree = {};

    this.items.forEach((item) => {
      const parentNodeId = item[this.options.parentId];
      if (!parentNodeId) {
        tree[item.id] = map[item.id];
      }
    });
    this.collection = Object.values(tree);
  }

  walk() {

  }

  getParents() {

  }

  getChildren() {
    
  }

  toFlattenArray() {

  }

  toArray() {

  }
}
