// @ts-nocheck
import _ from 'lodash';
import Deepdash from 'deepdash';

export const deepdash = Deepdash(_);

export const filterValuesDeep = (predicate, nodes) => {
  return deepdash.condense(
    deepdash.reduceDeep(
      nodes,
      (accumulator, value, key, parent, context) => {
        const newValue = { ...value };

        if (newValue.children) {
          _.set(newValue, 'children', deepdash.condense(value.children));
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
      },
    ),
  );
};
