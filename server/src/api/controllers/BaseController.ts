import { Response, Request } from 'express';
import { matchedData, validationResult } from "express-validator";
import { camelCase, omit } from "lodash";
import { mapKeysDeep } from 'utils'

export default class BaseController {

  matchedBodyData(req: Request, options: any = {}) {
    const data = matchedData(req, {
      locations: ['body'],
      includeOptionals: true,
      ...omit(options, ['locations']), // override any propery except locations.
    });
    return mapKeysDeep(data, (v, k) => camelCase(k));
  }

  validationResult(req: Request, res: Response, next: NextFunction) {
    const validationErrors = validationResult(req);
    
    if (!validationErrors.isEmpty()) {
      return res.boom.badData(null, {
        code: 'validation_error',
        ...validationErrors,
      });
    }
    next();
  }
}