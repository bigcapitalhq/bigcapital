import { Router } from 'express';
import { Container } from 'typedi';

// Middlewares
import JWTAuth from '@/http/middleware/jwtAuth';
import AttachCurrentTenantUser from '@/http/middleware/AttachCurrentTenantUser';
import SubscriptionMiddleware from '@/http/middleware/SubscriptionMiddleware';
import TenancyMiddleware from '@/http/middleware/TenancyMiddleware';
import EnsureTenantIsInitialized from '@/http/middleware/EnsureTenantIsInitialized';
import SettingsMiddleware from '@/http/middleware/SettingsMiddleware';
import I18nMiddleware from '@/http/middleware/I18nMiddleware';

// Routes
import Authentication from '@/http/controllers/Authentication';
import InviteUsers from '@/http/controllers/InviteUsers';
import Organization from '@/http/controllers/Organization';
import Users from '@/http/controllers/Users';
import Items from '@/http/controllers/Items';
import ItemCategories from '@/http/controllers/ItemCategories';
import Accounts from '@/http/controllers/Accounts';
import AccountTypes from '@/http/controllers/AccountTypes';
import Views from '@/http/controllers/Views';
import Accounting from '@/http/controllers/Accounting';
import FinancialStatements from '@/http/controllers/FinancialStatements';
import Expenses from '@/http/controllers/Expenses';
import Settings from '@/http/controllers/Settings';
import Currencies from '@/http/controllers/Currencies';
import Customers from '@/http/controllers/Contacts/Customers';
import Vendors from '@/http/controllers/Contacts/Vendors';
import Sales from '@/http/controllers/Sales'
import Purchases from '@/http/controllers/Purchases';
import Resources from './controllers/Resources';
import ExchangeRates from '@/http/controllers/ExchangeRates';
import Media from '@/http/controllers/Media';
import Ping from '@/http/controllers/Ping';
import Subscription from '@/http/controllers/Subscription';
import Licenses from '@/http/controllers/Subscription/Licenses';

export default () => {
  const app = Router();

  app.use(I18nMiddleware);

  app.use('/auth', Container.get(Authentication).router());
  app.use('/invite', Container.get(InviteUsers).nonAuthRouter());
  app.use('/licenses', Container.get(Licenses).router());
  app.use('/subscription', Container.get(Subscription).router());
  app.use('/ping', Container.get(Ping).router());
  app.use('/organization', Container.get(Organization).router());

  const dashboard = Router();

  dashboard.use(JWTAuth);
  dashboard.use(AttachCurrentTenantUser);
  dashboard.use(TenancyMiddleware);
  dashboard.use(I18nMiddleware);
  dashboard.use(SubscriptionMiddleware('main'));
  dashboard.use(EnsureTenantIsInitialized);
  dashboard.use(SettingsMiddleware);

  dashboard.use('/users', Container.get(Users).router());
  dashboard.use('/invite', Container.get(InviteUsers).authRouter());
  dashboard.use('/currencies', Currencies.router());
  dashboard.use('/accounts', Container.get(Accounts).router());
  dashboard.use('/account_types', Container.get(AccountTypes).router());
  dashboard.use('/accounting', Accounting.router());
  dashboard.use('/views', Views.router());
  dashboard.use('/items', Container.get(Items).router());
  dashboard.use('/item_categories', Container.get(ItemCategories).router());
  dashboard.use('/expenses', Expenses.router());
  dashboard.use('/financial_statements', FinancialStatements.router());
  dashboard.use('/settings', Container.get(Settings).router());
  dashboard.use('/sales', Sales.router());
  dashboard.use('/customers', Container.get(Customers).router());
  dashboard.use('/vendors', Container.get(Vendors).router());
  dashboard.use('/purchases', Purchases.router());
  dashboard.use('/resources', Resources.router());
  dashboard.use('/exchange_rates', ExchangeRates.router());
  dashboard.use('/media', Media.router())

  app.use('/', dashboard);

  return app;
};
