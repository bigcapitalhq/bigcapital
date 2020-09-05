import { Response, Request } from 'express';
import { matchedData, validationResult } from "express-validator";
import { mapKeys, camelCase, omit } from "lodash";

export default class BaseController {

  matchedBodyData(req: Request, options: any) {
    const data = matchedData(req, {
      locations: ['body'],
      includeOptionals: true,
      ...omit(options, ['locations']), // override any propery except locations.
    });
    return mapKeys(data, (v, k) => camelCase(k));
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