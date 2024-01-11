import _ from 'lodash';
import deepdash from 'deepdash';

const {
  condense,
  condenseDeep,
  eachDeep,
  exists,
  filterDeep,
  findDeep,
  findPathDeep,
  findValueDeep,
  forEachDeep,
  index,
  keysDeep,
  mapDeep,
  mapKeysDeep,
  mapValuesDeep,
  omitDeep,
  pathMatches,
  pathToString,
  paths,
  pickDeep,
  reduceDeep,
  someDeep,
  iteratee,
} = deepdash(_);

const mapValuesDeepReverse = (nodes, callback, config?) => {
  const clonedNodes = _.clone(nodes);
  const nodesPaths = paths(nodes, config);
  const reversedPaths = _.reverse(nodesPaths);

  reversedPaths.forEach((pathStack: string[], i) => {
    const node = _.get(clonedNodes, pathStack);
    const pathString = pathToString(pathStack);
    const children = _.get(
      clonedNodes,
      `${pathString}.${config.childrenPath}`,
      []
    );
    const mappedNode = callback(node, children);

    if (!mappedNode.children && children) {
      mappedNode.children = children;
    }
    _.set(clonedNodes, pathString, mappedNode);
  });
  return clonedNodes;
};

const filterNodesDeep = (predicate, nodes) => {
  return condense(
    reduceDeep(
      nodes,
      (accumulator, value, key, parent, context) => {
        const newValue = { ...value };

        if (newValue.children) {
          _.set(newValue, 'children', condense(value.children));
        }
        const isTrue = predicate(newValue, key, parent, context);

        if (isTrue === true) {
          _.set(accumulator, context.path, newValue);
        } else if (isTrue === false) {
          _.unset(accumulator, context.path);
        }
        return accumulator;
      },
      [],
      {
        childrenPath: 'children',
        pathFormat: 'array',
        callbackAfterIterate: true,
      }
    )
  );
};

const flatNestedTree = (obj, mapper, options) => {
  return reduceDeep(
    obj,
    (accumulator, value, key, parentValue, context) => {
      const computedValue = _.omit(value, ['children']);
      const mappedValue = mapper
        ? mapper(computedValue, key, context)
        : computedValue;

      accumulator.push(mappedValue);
      return accumulator;
    },
    [],
    {
      childrenPath: 'children',
      pathFormat: 'array',
      ...options,
    }
  );
};

export {
  iteratee,
  condense,
  condenseDeep,
  eachDeep,
  exists,
  filterDeep,
  findDeep,
  findPathDeep,
  findValueDeep,
  forEachDeep,
  index,
  keysDeep,
  mapDeep,
  mapKeysDeep,
  mapValuesDeep,
  omitDeep,
  pathMatches,
  pathToString,
  paths,
  pickDeep,
  reduceDeep,
  someDeep,
  mapValuesDeepReverse,
  filterNodesDeep,
  flatNestedTree,
};
