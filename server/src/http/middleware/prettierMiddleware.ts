import { camelCase, snakeCase } from 'lodash';

/**
 * create a middleware to change json format from snake case to camelcase in request
 * then change back to snake case in response
 *
 */
export default function createMiddleware() {
  return function (req, res, next) {
    /**
     * camelize req.body
     */
    if (req.body && typeof req.body === 'object') {
      req.body = camelCase(req.body);
    }

    /**
     * camelize req.query
     */
    if (req.query && typeof req.query === 'object') {
      req.query = camelCase(req.query);
    }

    /**
     * wrap res.json()
     */
    const sendJson = res.json;

    res.json = (data) => {
      return sendJson.call(res, snakeCase(data));
    }

    return next();
  }
}