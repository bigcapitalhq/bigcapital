import { OPERATION } from './Parser';

export default class QueryParser {

  constructor(tree, queries) {
    this.tree = tree;
    this.queries = queries;
    this.query = null;
  }

  setQuery(query) {
    this.query = query.clone();
  }

  parse() {
    return this.parseNode(this.tree);
  }

  parseNode(node) {
    if (typeof node === 'string') {
      const nodeQuery = this.getQuery(node);
      return (query) => { nodeQuery(query); };
    }
    if (OPERATION[node.operation] === undefined) {
      throw new Error(`unknow expression ${node.operation}`);
    }
    const leftQuery = this.getQuery(node.left);
    const rightQuery = this.getQuery(node.right);

    switch (node.operation) {
      case '&&':
      case 'AND':
      default:
        return (nodeQuery) => nodeQuery.where((query) => {
          query.where((q) => { leftQuery(q); });
          query.andWhere((q) => { rightQuery(q); });
        });
      case '||':
      case 'OR':
        return (nodeQuery) => nodeQuery.where((query) => {
          query.where((q) => { leftQuery(q); });
          query.orWhere((q) => { rightQuery(q); });
        });
    }
  }

  getQuery(node) {
    if (typeof node !== 'string' && node !== null) {
      return this.parseNode(node);
    }
    const value = parseFloat(node);

    if (!isNaN(value)) {
      if (typeof this.queries[node] === 'undefined') {
        throw new Error(`unknow query under index ${node}`);
      }
      return this.queries[node];
    }
    return null;
  }
}