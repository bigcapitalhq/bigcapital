import { Container } from 'typedi';
import { Request, Response } from 'express';


export default (req: Request, res: Response, next: Function) => {
  const Logger = Container.get('logger');

  if (!req.tenant) {
    Logger.info('[ensure_tenant_intialized_middleware] no tenant model.');
    throw new Error('Should load this middleware after `TenancyMiddleware`.');
  }
  if (!req.tenant.initializedAt) {
    Logger.info('[ensure_tenant_initialized_middleware] tenant database not initalized.');
    
    return res.boom.badRequest(
      'Tenant database is not migrated with application schema yut.',
      { errors: [{ type: 'TENANT.DATABASE.NOT.INITALIZED' }] },
    );
  }
  next();
};