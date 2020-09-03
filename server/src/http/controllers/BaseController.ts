import { matchedData } from "express-validator";
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
}