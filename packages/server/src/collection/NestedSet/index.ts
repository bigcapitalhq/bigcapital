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
    this.items = items || [];
    this.tree = this.linkChildren();
  }

  setItems(items) {
    this.items = items;
    this.tree = this.linkChildren();
  }

  /**
   * Link nodes children.
   */
  linkChildren() {
    if (this.items.length <= 0) return false;

    const map = {};
    for (const item of this.items) {
      map[item.id] = item;
      map[item.id].children = {};
    }

    for (const item of this.items) {
      const parentNodeId = item[this.options.parentId];
      if (parentNodeId) {
        map[parentNodeId].children[item.id] = item;
      }
    }
    return map;
  }

  toArray() {
    const stack = [];
    const treeNodes = this.items.map((i) => ({ ...i }));

    const walk = (nodes) => {
      for (const node of nodes) {
        if (!node[this.options.parentId]) {
          stack.push(node);
        }
        if (node.children) {
          const childrenNodes = Object.values(node.children).map((i) => Object.assign({}, i));

          node.children = childrenNodes;
          walk(childrenNodes);
        }
      }
    };
    walk(treeNodes);
    return stack;
  }

  getTree() {
    return this.tree;
  }

  getElementById(id) {
    return this.tree[id] || null;
  }

  getParents(id) {
    const item = this.getElementById(id);
    const parents = [];
    let index = 0;

    const walk = (_item) => {
      if (!item) return;

      if (index) {
        parents.push(_item);
      }
      if (_item[this.options.parentId]) {
        const parentItem = this.getElementById(_item[this.options.parentId]);

        index++;
        walk(parentItem);
      }
    };
    walk(item);
    return parents;
  }

  toFlattenArray(nodeMapper) {
    const flattenTree = [];

    const traversal = (nodes, parentNode) => {
      for (const node of nodes) {
        let nodeMapped = node;

        if (typeof nodeMapper === 'function') {
          nodeMapped = nodeMapper(nodeMapped, parentNode);
        }
        flattenTree.push(nodeMapped);

        if (node.children && node.children.length > 0) {
          traversal(node.children, node);
        }
      }
    };
    traversal(this.collection);

    return flattenTree;
  }
}
