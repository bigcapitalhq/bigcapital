import { Container } from 'typedi';

export default (req: Request, res: Response, next: Function) => {
  const Logger = Container.get('logger');

  if (!req.tenant) {
    Logger.info('[ensure_tenant_intialized_middleware] no tenant model.');
    throw new Error('Should load this middleware after `TenancyMiddleware`.');
  }
  if (!req.tenant.initialized) {
    Logger.info('[ensure_tenant_intialized_middleware] tenant database not initalized.');
    return res.status(400).send({
      errors: [{ type: 'TENANT.DATABASE.NOT.INITALIZED' }],
    });
  }
  next();
};