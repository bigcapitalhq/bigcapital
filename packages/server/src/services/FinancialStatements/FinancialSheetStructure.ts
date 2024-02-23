import * as R from 'ramda';
import { set, sumBy } from 'lodash';
import {
  mapValuesDeepReverse,
  mapValuesDeep,
  mapValues,
  condense,
  filterDeep,
  reduceDeep,
  findValueDeep,
  filterNodesDeep,
} from 'utils/deepdash';

export const FinancialSheetStructure = (Base: Class) =>
  class extends Base {
    /**
     *
     * @param nodes
     * @param callback
     * @returns
     */
    public mapNodesDeepReverse = (nodes, callback) => {
      return mapValuesDeepReverse(nodes, callback, {
        childrenPath: 'children',
        pathFormat: 'array',
      });
    };

    /**
     *
     * @param nodes
     * @param callback
     * @returns
     */
    public mapNodesDeep = (nodes, callback) => {
      return mapValuesDeep(nodes, callback, {
        childrenPath: 'children',
        pathFormat: 'array',
      });
    };

    public mapNodes = (nodes, callback) => {
      return mapValues(nodes, callback, {
        childrenPath: 'children',
        pathFormat: 'array',
      });
    };

    public filterNodesDeep2 = R.curry((predicate, nodes) => {
      return filterNodesDeep(predicate, nodes);
    });

    /**
     *
     * @param
     */
    public filterNodesDeep = (nodes, callback) => {
      return filterDeep(nodes, callback, {
        childrenPath: 'children',
        pathFormat: 'array',
      });
    };

    public findNodeDeep = (nodes, callback) => {
      return findValueDeep(nodes, callback, {
        childrenPath: 'children',
        pathFormat: 'array',
      });
    };

    public mapAccNodesDeep = (nodes, callback) => {
      return reduceDeep(
        nodes,
        (acc, value, key, parentValue, context) => {
          set(
            acc,
            context.path,
            callback(value, key, parentValue, acc, context)
          );
          return acc;
        },
        [],
        {
          childrenPath: 'children',
          pathFormat: 'array',
        }
      );
    };

    /**
     *
     */
    public reduceNodesDeep = (nodes, iteratee, accumulator) => {
      return reduceDeep(nodes, iteratee, accumulator, {
        childrenPath: 'children',
        pathFormat: 'array',
      });
    };

    public getTotalOfChildrenNodes = (node) => {
      return this.getTotalOfNodes(node.children);
    };

    public getTotalOfNodes = (nodes) => {
      return sumBy(nodes, 'total.amount');
    };
  };
