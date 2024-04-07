// Dependency Graph Cycle Error Class
class DepGraphCycleError extends Error {
  constructor(cyclePath) {
    const message = `Dependency Cycle Found: ${cyclePath.join(' -> ')}`;
    super(message);
    this.name = 'DepGraphCycleError';
    this.cyclePath = cyclePath;
  }
}

// Helper function for creating a Topological Sort using Depth-First Search
function createDFS(edges, leavesOnly, result, circular) {
  const visited = {};
  return function DFS(start) {
    if (visited[start]) {
      return;
    }
    const inCurrentPath = {};
    const currentPath = [];
    const todo = []; // Used as a stack
    todo.push({ node: start, processed: false });
    while (todo.length > 0) {
      const current = todo[todo.length - 1]; // Peek at the todo stack
      const { processed, node } = current;
      if (!processed) {
        if (visited[node]) {
          todo.pop();
          continue;
        } else if (inCurrentPath[node]) {
          if (circular) {
            todo.pop();
            continue;
          }
          currentPath.push(node);
          throw new DepGraphCycleError(currentPath);
        }
        inCurrentPath[node] = true;
        currentPath.push(node);
        const nodeEdges = edges[node] || [];
        for (let i = nodeEdges.length - 1; i >= 0; i--) {
          todo.push({ node: nodeEdges[i], processed: false });
        }
        current.processed = true;
      } else {
        todo.pop();
        currentPath.pop();
        inCurrentPath[node] = false;
        visited[node] = true;
        if (!leavesOnly || (edges[node] && edges[node].length === 0)) {
          result.push(node);
        }
      }
    }
  };
}

// Dependency Graph Class
class DepGraph {
  constructor(opts = {}) {
    this.nodes = {}; // Node -> Node/Data
    this.outgoingEdges = {}; // Node -> [Dependency Node]
    this.incomingEdges = {}; // Node -> [Dependent Node]
    this.circular = !!opts.circular; // Allows circular dependencies
  }

  addNode(node, data = node) {
    if (!this.hasNode(node)) {
      this.nodes[node] = data;
      this.outgoingEdges[node] = [];
      this.incomingEdges[node] = [];
    }
  }

  removeNode(node) {
    if (this.hasNode(node)) {
      delete this.nodes[node];
      delete this.outgoingEdges[node];
      delete this.incomingEdges[node];
      Object.values(this.outgoingEdges).forEach((edges) => {
        const index = edges.indexOf(node);
        if (index > -1) edges.splice(index, 1);
      });
      Object.values(this.incomingEdges).forEach((edges) => {
        const index = edges.indexOf(node);
        if (index > -1) edges.splice(index, 1);
      });
    }
  }

  hasNode(node) {
    return Object.hasOwnProperty.call(this.nodes, node);
  }

  addDependency(from, to) {
    if (!this.hasNode(from) || !this.hasNode(to)) {
      throw new Error('One or both of the nodes do not exist.');
    }
    if (!this.outgoingEdges[from].includes(to)) {
      this.outgoingEdges[from].push(to);
    }
    if (!this.incomingEdges[to].includes(from)) {
      this.incomingEdges[to].push(from);
    }
  }

  removeDependency(from, to) {
    const fromEdges = this.outgoingEdges[from];
    const toEdges = this.incomingEdges[to];
    if (fromEdges) {
      const index = fromEdges.indexOf(to);
      if (index > -1) fromEdges.splice(index, 1);
    }
    if (toEdges) {
      const index = toEdges.indexOf(from);
      if (index > -1) toEdges.splice(index, 1);
    }
  }

  dependenciesOf(node, leavesOnly = false) {
    if (!this.hasNode(node)) {
      throw new Error('Node does not exist.');
    }
    const result = [];
    const DFS = createDFS(this.outgoingEdges, leavesOnly, result, this.circular);
    DFS(node);
    const index = result.indexOf(node);
    if (index > -1) {
      result.splice(index, 1);
    }
    return result;
  }

  overallOrder(leavesOnly = false) {
    const result = [];
    const keys = Object.keys(this.nodes);
    if (keys.length === 0) {
      return result; // Empty graph
    }
    if (!this.circular) {
      // Look for cycles
      const CycleDFS = createDFS(this.outgoingEdges, false, [], this.circular);
      keys.forEach((n) => CycleDFS(n));
    }
    const DFS = createDFS(this.outgoingEdges, leavesOnly, result, this.circular);
    keys.filter((node) => this.incomingEdges[node].length === 0).forEach((n) => DFS(n));
    if (this.circular) {
      keys.filter((node) => result.indexOf(node) === -1).forEach((n) => DFS(n));
    }
    return result;
  }
}

// Export classes and helper functions
export { DepGraph, DepGraphCycleError };

export default DepGraph;
