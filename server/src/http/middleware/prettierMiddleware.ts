import { Request, Response } from 'express';
import { camelCase, snakeCase, mapKeys } from 'lodash';

/**
 * create a middleware to change json format from snake case to camelcase in request
 * then change back to snake case in response
 *
 */
export default (req: Request, res: Response, next: Function) => {
  /**
   * camelize `req.body`
   */
  if (req.body && typeof req.body === 'object') {
    req.body = mapKeys(req.body, (value: any, key: string) => camelCase(key));
  }

  /**
   * camelize `req.query`
   */
  if (req.query && typeof req.query === 'object') {
    req.query = mapKeys(req.query, (value: any, key: string) => camelCase(key));
  }

  /**
   * wrap `res.json()`
   */
  const sendJson = res.json;

  res.json = (data: any) => {
    const mapped = mapKeys(data, (value: any, key: string) => snakeCase(key));
    return sendJson.call(res, mapped);
  };
  return next();
};