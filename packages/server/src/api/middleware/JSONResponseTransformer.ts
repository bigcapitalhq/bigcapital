import { snakeCase } from 'lodash';
import { mapKeysDeep } from 'utils';

/**
 * Express middleware for intercepting and transforming json responses
 *
 * @param {function} [condition] - takes the req and res and returns a boolean indicating whether to run the transform on this response
 * @param {function} transform - takes an object passed to res.json and returns a replacement object
 * @return {function} the middleware
 */
export function JSONResponseTransformer(transform: Function) {
  const replaceJson = (res) => {
    var origJson = res.json;
  
    res.json = function (val) {
      const json = JSON.parse(JSON.stringify(val));

      return origJson.call(res, transform(json));
    };
  };

  return function (req, res, next) {
    replaceJson(res);
    next();
  };
}

/**
 * Transforms the given response keys to snake case.
 * @param response
 * @returns
 */
export const snakecaseResponseTransformer = (response) => {
  return mapKeysDeep(response, (value, key) => {
    return snakeCase(key);
  });
};
