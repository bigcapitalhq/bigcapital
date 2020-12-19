import { Router } from 'express';
import { Container } from 'typedi';

// Middlewares
import JWTAuth from 'api/middleware/jwtAuth';
import AttachCurrentTenantUser from 'api/middleware/AttachCurrentTenantUser';
import SubscriptionMiddleware from 'api/middleware/SubscriptionMiddleware';
import TenancyMiddleware from 'api/middleware/TenancyMiddleware';
import EnsureTenantIsInitialized from 'api/middleware/EnsureTenantIsInitialized';
import SettingsMiddleware from 'api/middleware/SettingsMiddleware';
import I18nMiddleware from 'api/middleware/I18nMiddleware';
import EnsureConfiguredMiddleware from 'api/middleware/EnsureConfiguredMiddleware';
import EnsureTenantIsSeeded from 'api/middleware/EnsureTenantIsSeeded';

// Routes
import Authentication from 'api/controllers/Authentication';
import InviteUsers from 'api/controllers/InviteUsers';
import Organization from 'api/controllers/Organization';
import Users from 'api/controllers/Users';
import Items from 'api/controllers/Items';
import ItemCategories from 'api/controllers/ItemCategories';
import Accounts from 'api/controllers/Accounts';
import AccountTypes from 'api/controllers/AccountTypes';
import Views from 'api/controllers/Views';
import ManualJournals from 'api/controllers/ManualJournals';
import FinancialStatements from 'api/controllers/FinancialStatements';
import Expenses from 'api/controllers/Expenses';
import Settings from 'api/controllers/Settings';
import Currencies from 'api/controllers/Currencies';
import Customers from 'api/controllers/Contacts/Customers';
import Vendors from 'api/controllers/Contacts/Vendors';
import Sales from 'api/controllers/Sales'
import Purchases from 'api/controllers/Purchases';
import Resources from './controllers/Resources';
import ExchangeRates from 'api/controllers/ExchangeRates';
import Media from 'api/controllers/Media';
import Ping from 'api/controllers/Ping';
import Subscription from 'api/controllers/Subscription';
import Licenses from 'api/controllers/Subscription/Licenses';

export default () => {
  const app = Router();

  // - Global routes.
  // ---------------------------
  app.use(I18nMiddleware);

  app.use('/auth', Container.get(Authentication).router());
  app.use('/invite', Container.get(InviteUsers).nonAuthRouter());
  app.use('/licenses', Container.get(Licenses).router());
  app.use('/subscription', Container.get(Subscription).router());
  app.use('/organization', Container.get(Organization).router());
  app.use('/ping', Container.get(Ping).router());
  
  // - Settings routes.
  // ---------------------------
  const settings = Router();

  settings.use(JWTAuth);
  settings.use(AttachCurrentTenantUser);
  settings.use(TenancyMiddleware);
  settings.use(SubscriptionMiddleware('main'));
  settings.use(EnsureTenantIsInitialized);
  settings.use(SettingsMiddleware);

  settings.use('/', Container.get(Settings).router());

  app.use('/settings', settings);

  // - Dashboard routes.
  // ---------------------------
  const dashboard = Router();

  dashboard.use(JWTAuth);
  dashboard.use(AttachCurrentTenantUser);
  dashboard.use(TenancyMiddleware);
  dashboard.use(I18nMiddleware);
  dashboard.use(SubscriptionMiddleware('main'));
  dashboard.use(EnsureTenantIsInitialized);
  dashboard.use(SettingsMiddleware);
  dashboard.use(EnsureConfiguredMiddleware);
  dashboard.use(EnsureTenantIsSeeded);

  dashboard.use('/users', Container.get(Users).router());
  dashboard.use('/invite', Container.get(InviteUsers).authRouter());
  dashboard.use('/currencies', Container.get(Currencies).router());
  dashboard.use('/accounts', Container.get(Accounts).router());
  dashboard.use('/account_types', Container.get(AccountTypes).router());
  dashboard.use('/manual-journals', Container.get(ManualJournals).router());
  dashboard.use('/views', Container.get(Views).router());
  dashboard.use('/items', Container.get(Items).router());
  dashboard.use('/item_categories', Container.get(ItemCategories).router());
  dashboard.use('/expenses', Container.get(Expenses).router());
  dashboard.use('/financial_statements', Container.get(FinancialStatements).router());
  dashboard.use('/customers', Container.get(Customers).router());
  dashboard.use('/vendors', Container.get(Vendors).router());
  dashboard.use('/sales', Container.get(Sales).router());
  dashboard.use('/purchases', Container.get(Purchases).router());
  dashboard.use('/resources', Container.get(Resources).router());
  dashboard.use('/exchange_rates', Container.get(ExchangeRates).router());
  dashboard.use('/media', Container.get(Media).router());

  app.use('/', dashboard);

  return app;
};
