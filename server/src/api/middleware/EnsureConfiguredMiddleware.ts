import { Request, Response, NextFunction } from 'express';

export default (req: Request, res: Response, next: NextFunction) => {
  const { settings } = req;

  if (!settings.get('app_configured', false)) {
    return res.boom.badRequest(null, {
      errors: [{ type: 'APP.NOT.CONFIGURED', code: 100 }],
    });
  }
  next();
};
