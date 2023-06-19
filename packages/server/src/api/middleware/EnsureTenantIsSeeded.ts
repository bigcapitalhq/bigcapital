import { Container } from 'typedi';
import { Request, Response } from 'express';

export default (req: Request, res: Response, next: Function) => {
  const Logger = Container.get('logger');

  if (!req.tenant) {
    Logger.info('[ensure_tenant_initialized_middleware] no tenant model.');
    throw new Error('Should load this middleware after `TenancyMiddleware`.');
  }
  if (!req.tenant.seededAt) {
    Logger.info(
      '[ensure_tenant_initialized_middleware] tenant database not seeded.'
    );
    return res.boom.badRequest(
      'Tenant database is not seeded with initial data yet.',
      { errors: [{ type: 'TENANT.DATABASE.NOT.SEED' }] }
    );
  }
  next();
};
