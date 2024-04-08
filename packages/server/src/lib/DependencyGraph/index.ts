interface IDepGraphOptions {
  circular?: boolean;
}

interface IFromToArrayOptions {
  itemId: string;
  parentItemId: string;
}

interface INodeData {
  [key: string]: any; // Flexible for user's data structure
}

interface IEdges {
  [node: string]: string[];
}

// Dependency Graph Cycle Error Class
class DepGraphCycleError extends Error {
  cyclePath: string[];

  constructor(cyclePath: string[]) {
    const message = `Dependency Cycle Found: ${cyclePath.join(' -> ')}`;
    super(message);
    this.name = 'DepGraphCycleError';
    this.cyclePath = cyclePath;
  }
}

// Helper function for creating a Topological Sort using Depth-First Search
function createDFS(edges: IEdges, leavesOnly: boolean, result: string[], circular: boolean) {
  const visited: { [node: string]: boolean } = {};
  return function DFS(start: string) {
    if (visited[start]) {
      return;
    }
    const inCurrentPath: { [node: string]: boolean } = {};
    const currentPath: string[] = [];
    const todo: { node: string; processed: boolean }[] = []; // Used as a stack
    todo.push({ node: start, processed: false });
    while (todo.length > 0) {
      const current = todo[todo.length - 1]; // Peek at the todo stack
      const { processed, node } = current;
      if (!processed) {
        if (visited[node]) {
          todo.pop();
          continue;
        }
        if (inCurrentPath[node]) {
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
// Dependency Graph Class
class DepGraph {
  nodes: { [node: string]: INodeData };
  outgoingEdges: IEdges;
  incomingEdges: IEdges;
  circular: boolean;

  constructor(opts: IDepGraphOptions = {}) {
    this.nodes = {};
    this.outgoingEdges = {};
    this.incomingEdges = {};
    this.circular = !!opts.circular;
  }

  static fromArray(items: INodeData[], options: IFromToArrayOptions = { itemId: 'id', parentItemId: 'parent_id' }): DepGraph {
    const depGraph = new DepGraph();

    for (const item of items) {
      depGraph.addNode(item[options.itemId], item);
    }
    for (const item of items) {
      if (item[options.parentItemId]) {
        depGraph.addDependency(item[options.parentItemId], item[options.itemId]);
      }
    }
    return depGraph;
  }

  /**
   * The number of nodes in the graph.
   */
  size(): number {
    return Object.keys(this.nodes).length;
  }

  addNode(node: string, data: INodeData | string = node): void {
    if (!this.hasNode(node)) {
      this.nodes[node] = data as INodeData;
      this.outgoingEdges[node] = [];
      this.incomingEdges[node] = [];
    }
  }

  removeNode(node: string): void {
    if (this.hasNode(node)) {
      delete this.nodes[node];
      delete this.outgoingEdges[node];
      delete this.incomingEdges[node];
      for (const edgeList of [this.incomingEdges, this.outgoingEdges]) {
        for (const key of Object.keys(edgeList)) {
          const idx = edgeList[key].indexOf(node);
          if (idx >= 0) {
            edgeList[key].splice(idx, 1);
          }
        }
      }
    }
  }

  hasNode(node: string): boolean {
    return Object.hasOwnProperty.call(this.nodes, node);
  }

  addDependency(from: string, to: string): void {
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

  removeDependency(from: string, to: string): void {
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

  dependenciesOf(node: string, leavesOnly = false): string[] {
  // Check if the node exists in the graph
  if (!this.hasNode(node)) {
    throw new Error('Node does not exist.');
  }
  
  // Use a string array to store the result to maintain type consistency
  const result: string[] = [];
  // Explicitly type the DFS function for better readability and safety
  const DFS: (start: string) => void = createDFS(this.outgoingEdges, leavesOnly, result, this.circular);
  DFS(node);

  // Remove the original node from the result if it exists
  const index: number = result.indexOf(node);
  if (index > -1) {
    result.splice(index, 1);
  }

  return result;
}

dependantsOf(node: string, leavesOnly = false): string[] {
  // Check if the node exists in the graph
  if (!this.hasNode(node)) {
    throw new Error(`Node does not exist: ${node}`);
  }
  
  const result: string[] = [];
  const DFS: (start: string) => void = createDFS(this.incomingEdges, leavesOnly, result, this.circular);
  DFS(node);

  const idx: number = result.indexOf(node);
  if (idx >= 0) {
    result.splice(idx, 1);
  }

  return result;
}


overallOrder(leavesOnly = false): string[] {
  const result: string[] = [];
  const keys: string[] = Object.keys(this.nodes);

  if (keys.length === 0) {
    return result; // Return an empty array for an empty graph
  }

  // Check for cycles if the graph is not circular
  if (!this.circular) {
    const CycleDFS: (start: string) => void = createDFS(this.outgoingEdges, false, [], this.circular);
    for (const n of keys) {
      CycleDFS(n);
    }
  }

  const DFS: (start: string) => void = createDFS(this.outgoingEdges, leavesOnly, result, this.circular);
  for (const node of keys.filter(node => this.incomingEdges[node].length === 0)) {
    DFS(node);
  }

  // Handle circular dependencies
  if (this.circular) {
    for (const node of keys.filter(node => result.indexOf(node) === -1)) {
      DFS(node);
    }
  }

  return result;
}
}

// Export classes and helper functions
export { DepGraph, DepGraphCycleError };

export default DepGraph;
