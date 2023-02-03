import { Container } from 'typedi';
import { Request, Response, NextFunction } from 'express';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { injectI18nUtils } from './TenantDependencyInjection';

/**
 * I18n from organization settings.
 */
export default (req: Request, res: Response, next: NextFunction) => {
  const Logger = Container.get('logger');
  const I18n = Container.get('i18n');

  const { tenantId, tenant } = req;

  if (!req.user) {
    throw new Error('Should load this middleware after `JWTAuth`.');
  }
  if (!req.settings) {
    throw new Error('Should load this middleware after `SettingsMiddleware`.');
  }
  // Get the organization language from settings.
  const { language } = tenant.metadata;

  if (language) {
    I18n.setLocale(req, language);
  }
  Logger.info('[i18n_authenticated_middleware] set locale language to i18n.', {
    language,
    user: req.user,
  });
  const tenantServices = Container.get(HasTenancyService);
  const tenantContainer = tenantServices.tenantContainer(tenantId);

  tenantContainer.set('i18n', injectI18nUtils(req));

  next();
};
