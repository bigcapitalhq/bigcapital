import { Request, Response, NextFunction } from 'express';
import { convertEmptyStringsToNull } from 'utils';

export default (req: Request, res: Response, next: NextFunction) => {  
  const transfomedBody = convertEmptyStringsToNull(req.body);
  req.body = transfomedBody;
  next();
};