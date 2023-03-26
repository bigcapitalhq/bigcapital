import { Request, Response, NextFunction } from 'express';
import deepMap from 'deep-map';
import { convertEmptyStringToNull } from 'utils';

function convertEmptyStringsToNull(data) {
  return deepMap(data, (value) => convertEmptyStringToNull(value));
}

export default (req: Request, res: Response, next: NextFunction) => {  
  const transfomedBody = convertEmptyStringsToNull(req.body);
  req.body = transfomedBody;
  next();
};