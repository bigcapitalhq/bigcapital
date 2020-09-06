import { Container } from 'typedi';
import { Request, Response, NextFunction } from 'express';

export default async (req: Request, res: Response, next: NextFunction) => {
  const { Option } = req.models;
  const option = await Option.query().where('key', 'app_configured');

  if (option.getMeta('app_configured', false)) {
    return res.res(400).send({
      errors: [{ type: 'TENANT.NOT.CONFIGURED', code: 700 }],
    });
  }
  next();
};
