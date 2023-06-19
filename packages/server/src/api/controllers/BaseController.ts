import { Response, Request, NextFunction } from 'express';
import { matchedData, validationResult } from 'express-validator';
import accepts from 'accepts';
import { isArray, drop, first, camelCase, snakeCase, omit, set, get } from 'lodash';
import { mapKeysDeep } from 'utils';
import asyncMiddleware from '@/api/middleware/asyncMiddleware';

export default class BaseController {
  /**
   * Converts plain object keys to cameCase style.
   * @param {Object} data
   */
  protected dataToCamelCase(data) {
    return mapKeysDeep(data, (v, k) => camelCase(k));
  }

  /**
   * Matches the body data from validation schema.
   * @param {Request} req
   * @param options
   */
  protected matchedBodyData(req: Request, options: any = {}) {
    const data = matchedData(req, {
      locations: ['body'],
      includeOptionals: true,
      ...omit(options, ['locations']), // override any property except locations.
    });
    return this.dataToCamelCase(data);
  }

  /**
   * Matches the query data from validation schema.
   * @param {Request} req
   */
  protected matchedQueryData(req: Request) {
    const data = matchedData(req, {
      locations: ['query'],
    });
    return this.dataToCamelCase(data);
  }

  /**
   * Validate validation schema middleware.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  protected validationResult(req: Request, res: Response, next: NextFunction) {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      return res.boom.badData(null, {
        code: 'validation_error',
        ...validationErrors,
      });
    }
    next();
  }

  /**
   * Sets localization to response object by the given path.
   * @param {Response} response - 
   * @param {string} path - 
   * @param {Request} req - 
   */
  private setLocalizationByPath(
    response: any,
    path: string,
    req: Request,
  ) {
    const DOT = '.';

    if (isArray(response)) {
      response.forEach((va) => {
        const currentPath = first(path.split(DOT));
        const value = get(va, currentPath);

        if (isArray(value)) {
          const nextPath = drop(path.split(DOT)).join(DOT);
          this.setLocalizationByPath(value, nextPath, req);
        } else {
          set(va, path, req.__(value));
        }
      })
    } else {
      const value = get(response, path);
      set(response, path, req.__(value));
    }
  }

  /**
   * Transform the given data to response.
   * @param {any} data
   */
  protected transfromToResponse(
    data: any,
    translatable?: string | string[],
    req?: Request
  ) {
    const response = mapKeysDeep(data, (v, k) => snakeCase(k));

    if (translatable) {
      const translatables = Array.isArray(translatable)
        ? translatable
        : [translatable];

      translatables.forEach((path) => {
        this.setLocalizationByPath(response, path, req);
      });
    }
    return response;
  }

  /**
   * Async middleware.
   * @param {function} callback
   */
  protected asyncMiddleware(callback) {
    return asyncMiddleware(callback);
  }

  /**
   *
   * @param {Request} req
   * @returns
   */
  protected accepts(req) {
    return accepts(req);
  }

  /**
   * 
   * @param {Request} req 
   * @param {string[]} types 
   * @returns {string}
   */
  protected acceptTypes(req: Request, types: string[])  {
    return this.accepts(req).types(types);
  }
}
