import * as mathjs from 'mathjs';
import * as R from 'ramda';
import { compose } from 'lodash/fp';
import { omit, get, mapValues } from 'lodash';
import { FinancialSheetStructure } from './FinancialSheetStructure';

export const FinancialEvaluateEquation = (Base) =>
  class extends compose(FinancialSheetStructure)(Base) {
    /**
     * Evaluate equation string with the given scope table.
     * @param {string} equation -
     * @param {{ [key: string]: number }} scope -
     * @return {number}
     */
    protected evaluateEquation = (
      equation: string,
      scope: { [key: string | number]: number }
    ): number => {
      return mathjs.evaluate(equation, scope);
    };

    /**
     * Transformes the given nodes nested array to object key/value by id.
     * @param nodes
     * @returns
     */
    private transformNodesToMap = (nodes: any[]) => {
      return this.mapAccNodesDeep(
        nodes,
        (node, key, parentValue, acc, context) => {
          if (node.id) {
            acc[`${node.id}`] = omit(node, ['children']);
          }
          return acc;
        },
        {}
      );
    };

    /**
     *
     * @param nodesById
     * @returns
     */
    private mapNodesToTotal = R.curry(
      (path: string, nodesById: { [key: number]: any }) => {
        return mapValues(nodesById, (node) => get(node, path, 0));
      }
    );

    /**
     *
     */
    protected getNodesTableForEvaluating = R.curry(
      (path = 'total.amount', nodes) => {
        return R.compose(
          this.mapNodesToTotal(path),
          this.transformNodesToMap
        )(nodes);
      }
    );
  };
