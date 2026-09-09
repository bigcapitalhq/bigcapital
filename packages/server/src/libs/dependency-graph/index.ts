/**
 * A simple dependency graph
 */

export interface DepGraphOptions {
  /**
   * Allows circular dependencies (defaults to `false`).
   */
  circular?: boolean;
}

export interface DepGraphFromArrayOptions {
  /**
   * The key of the item id.
   */
  itemId: string;
  /**
   * The key of the item parent id.
   */
  parentItemId: string;
}

/**
 * Helper for creating a Topological Sort using Depth-First-Search on a set of edges.
 *
 * Detects cycles and throws an Error if one is detected (unless the "circular"
 * parameter is "true" in which case it ignores them).
 *
 * @param edges The set of edges to DFS through
 * @param leavesOnly Whether to only return "leaf" nodes (ones who have no edges)
 * @param result An array in which the results will be populated
 * @param circular A boolean to allow circular dependencies
 */
function createDFS<K extends string | number>(
  edges: { [key: string]: K[] },
  leavesOnly: boolean,
  result: K[],
  circular: boolean,
) {
  const visited: { [key: string]: boolean } = {};
  return function (start: K) {
    if (visited[start]) {
      return;
    }
    const inCurrentPath: { [key: string]: boolean } = {};
    const currentPath: K[] = [];
    const todo: Array<{ node: K; processed: boolean }> = []; // used as a stack
    todo.push({ node: start, processed: false });
    while (todo.length > 0) {
      const current = todo[todo.length - 1]; // peek at the todo stack
      const processed = current.processed;
      const node = current.node;
      if (!processed) {
        // Haven't visited edges yet (visiting phase)
        if (visited[node]) {
          todo.pop();
          continue;
        } else if (inCurrentPath[node]) {
          // It's not a DAG
          if (circular) {
            todo.pop();
            // If we're tolerating cycles, don't revisit the node
            continue;
          }
          currentPath.push(node);
          throw new DepGraphCycleError(currentPath as string[]);
        }

        inCurrentPath[node] = true;
        currentPath.push(node);
        const nodeEdges = edges[node];
        // (push edges onto the todo stack in reverse order to be order-compatible with the old DFS implementation)
        for (let i = nodeEdges.length - 1; i >= 0; i--) {
          todo.push({ node: nodeEdges[i], processed: false });
        }
        current.processed = true;
      } else {
        // Have visited edges (stack unrolling phase)
        todo.pop();
        currentPath.pop();
        inCurrentPath[node] = false;
        visited[node] = true;
        if (!leavesOnly || edges[node].length === 0) {
          result.push(node);
        }
      }
    }
  };
}

/**
 * Simple Dependency Graph
 */
export class DepGraph<T = any, K extends string | number = string | number> {
  private nodes: { [key: string]: T }; // Node -> Node/Data (treated like a Set)
  private outgoingEdges: { [key: string]: K[] }; // Node -> [Dependency Node]
  private incomingEdges: { [key: string]: K[] }; // Node -> [Dependant Node]
  private circular: boolean; // Allows circular deps

  constructor(opts?: DepGraphOptions) {
    this.nodes = {};
    this.outgoingEdges = {};
    this.incomingEdges = {};
    this.circular = opts && !!opts.circular;
  }

  /**
   * Builds a dependency graph from the given flat items list.
   * @param items
   * @param options
   * @returns {DepGraph<T>}
   */
  static fromArray<T extends Record<string, any>>(
    items: T[],
    options: DepGraphFromArrayOptions = {
      itemId: 'id',
      parentItemId: 'parent_id',
    },
  ): DepGraph<T, any> {
    const depGraph = new DepGraph<T, any>();

    items.forEach((item) => {
      depGraph.addNode(item[options.itemId], item);
    });
    items.forEach((item) => {
      if (item[options.parentItemId]) {
        depGraph.addDependency(
          item[options.parentItemId],
          item[options.itemId],
        );
      }
    });
    return depGraph;
  }

  /**
   * The number of nodes in the graph.
   */
  size(): number {
    return Object.keys(this.nodes).length;
  }

  /**
   * Add a node to the dependency graph. If a node already exists, this method will do nothing.
   */
  addNode(node: K, data?: T): void {
    if (!this.hasNode(node)) {
      // Checking the arguments length allows the user to add a node with undefined data
      if (arguments.length === 2) {
        this.nodes[node] = data;
      } else {
        this.nodes[node] = node as unknown as T;
      }
      this.outgoingEdges[node] = [];
      this.incomingEdges[node] = [];
    }
  }

  /**
   * Remove a node from the dependency graph. If a node already exists, this method will do nothing.
   */
  removeNode(node: K): void {
    if (this.hasNode(node)) {
      delete this.nodes[node];
      delete this.outgoingEdges[node];
      delete this.incomingEdges[node];
      [this.incomingEdges, this.outgoingEdges].forEach((edgeList) => {
        Object.keys(edgeList).forEach((key) => {
          const idx = edgeList[key].indexOf(node);
          if (idx >= 0) {
            edgeList[key].splice(idx, 1);
          }
        });
      });
    }
  }

  /**
   * Check if a node exists in the graph
   */
  hasNode(node: K): boolean {
    return this.nodes.hasOwnProperty(node);
  }

  /**
   * Get the data associated with a node name
   */
  getNodeData(node: K): T {
    if (this.hasNode(node)) {
      return this.nodes[node];
    } else {
      throw new Error('Node does not exist: ' + node);
    }
  }

  /**
   * Set the associated data for a given node name. If the node does not exist, this method will throw an error
   */
  setNodeData(node: K, data: T): void {
    if (this.hasNode(node)) {
      this.nodes[node] = data;
    } else {
      throw new Error('Node does not exist: ' + node);
    }
  }

  /**
   * Add a dependency between two nodes. If either of the nodes does not exist,
   * an Error will be thrown.
   */
  addDependency(from: K, to: K): boolean {
    if (!this.hasNode(from)) {
      throw new Error('Node does not exist: ' + from);
    }
    if (!this.hasNode(to)) {
      throw new Error('Node does not exist: ' + to);
    }
    if (this.outgoingEdges[from].indexOf(to) === -1) {
      this.outgoingEdges[from].push(to);
    }
    if (this.incomingEdges[to].indexOf(from) === -1) {
      this.incomingEdges[to].push(from);
    }
    return true;
  }

  /**
   * Remove a dependency between two nodes.
   */
  removeDependency(from: K, to: K): void {
    let idx: number;
    if (this.hasNode(from)) {
      idx = this.outgoingEdges[from].indexOf(to);
      if (idx >= 0) {
        this.outgoingEdges[from].splice(idx, 1);
      }
    }

    if (this.hasNode(to)) {
      idx = this.incomingEdges[to].indexOf(from);
      if (idx >= 0) {
        this.incomingEdges[to].splice(idx, 1);
      }
    }
  }

  /**
   * Return a clone of the dependency graph. If any custom data is attached
   * to the nodes, it will only be shallow copied.
   */
  clone(): DepGraph<T, K> {
    const result = new DepGraph<T, K>();
    const keys = Object.keys(this.nodes);
    keys.forEach((n) => {
      result.nodes[n] = this.nodes[n];
      result.outgoingEdges[n] = this.outgoingEdges[n].slice(0);
      result.incomingEdges[n] = this.incomingEdges[n].slice(0);
    });
    return result;
  }

  /**
   * Get an array containing the nodes that the specified node depends on (transitively).
   *
   * Throws an Error if the graph has a cycle, or the specified node does not exist.
   *
   * If `leavesOnly` is true, only nodes that do not depend on any other nodes will be returned
   * in the array.
   */
  dependenciesOf(node: K, leavesOnly?: boolean): K[] {
    if (this.hasNode(node)) {
      const result: K[] = [];
      const DFS = createDFS(
        this.outgoingEdges,
        leavesOnly,
        result,
        this.circular,
      );
      DFS(node);
      const idx = result.indexOf(node);
      if (idx >= 0) {
        result.splice(idx, 1);
      }
      return result;
    } else {
      throw new Error('Node does not exist: ' + node);
    }
  }

  /**
   * get an array containing the nodes that depend on the specified node (transitively).
   *
   * Throws an Error if the graph has a cycle, or the specified node does not exist.
   *
   * If `leavesOnly` is true, only nodes that do not have any dependants will be returned in the array.
   */
  dependantsOf(node: K, leavesOnly?: boolean): K[] {
    if (this.hasNode(node)) {
      const result: K[] = [];
      const DFS = createDFS(
        this.incomingEdges,
        leavesOnly,
        result,
        this.circular,
      );
      DFS(node);
      const idx = result.indexOf(node);
      if (idx >= 0) {
        result.splice(idx, 1);
      }
      return result;
    } else {
      throw new Error('Node does not exist: ' + node);
    }
  }

  /**
   * Construct the overall processing order for the dependency graph.
   *
   * Throws an Error if the graph has a cycle.
   *
   * If `leavesOnly` is true, only nodes that do not depend on any other nodes will be returned.
   */
  overallOrder(leavesOnly?: boolean): K[] {
    const result: K[] = [];
    // Node keys are stored as object keys, therefore stringified.
    const keys = Object.keys(this.nodes) as unknown as K[];
    if (keys.length === 0) {
      return result; // Empty graph
    } else {
      if (!this.circular) {
        // Look for cycles - we run the DFS starting at all the nodes in case there
        // are several disconnected subgraphs inside this dependency graph.
        const CycleDFS = createDFS(
          this.outgoingEdges,
          false,
          [],
          this.circular,
        );
        keys.forEach((n) => {
          CycleDFS(n);
        });
      }

      const DFS = createDFS(
        this.outgoingEdges,
        leavesOnly,
        result,
        this.circular,
      );
      // Find all potential starting points (nodes with nothing depending on them) an
      // run a DFS starting at these points to get the order
      keys
        .filter((node) => {
          return this.incomingEdges[node].length === 0;
        })
        .forEach((n) => {
          DFS(n);
        });

      // If we're allowing cycles - we need to run the DFS against any remaining
      // nodes that did not end up in the initial result (as they are part of a
      // subgraph that does not have a clear starting point)
      if (this.circular) {
        keys
          .filter((node) => {
            return result.indexOf(node) === -1;
          })
          .forEach((n) => {
            DFS(n);
          });
      }

      return result;
    }
  }

  mapNodes(_mapper) {}
}

/**
 * Cycle error, including the path of the cycle.
 */
export interface IDepGraphCycleError extends Error {
  cyclePath: string[];
}

export const DepGraphCycleError = function (
  this: any,
  cyclePath: string[],
): IDepGraphCycleError {
  const message = 'Dependency Cycle Found: ' + cyclePath.join(' -> ');
  const instance = new Error(message) as IDepGraphCycleError;
  instance.cyclePath = cyclePath;
  Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
  if (Error.captureStackTrace) {
    Error.captureStackTrace(instance, DepGraphCycleError);
  }
  return instance;
} as unknown as {
  new (cyclePath: string[]): IDepGraphCycleError;
  prototype: IDepGraphCycleError;
};
DepGraphCycleError.prototype = Object.create(Error.prototype, {
  constructor: {
    value: Error,
    enumerable: false,
    writable: true,
    configurable: true,
  },
});
Object.setPrototypeOf(DepGraphCycleError, Error);

export default DepGraph;
