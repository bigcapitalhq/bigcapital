import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '@casl/ability';

/**
 *
 */
export default (ability: string, subject: string) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      ForbiddenError.from(req.ability).throwUnlessCan(ability, subject);
    } catch (error) {
      return res.status(403).send({
        type: 'USER_PERMISSIONS_FORBIDDEN',
        message: `You are not allowed to ${error.action} on ${error.subjectType}`,
      });
    }
    next();
  };
