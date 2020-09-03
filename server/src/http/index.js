import express from 'express';
import { Container } from 'typedi';

// Middlewares
import JWTAuth from '@/http/middleware/jwtAuth';
import AttachCurrentTenantUser from '@/http/middleware/AttachCurrentTenantUser';
import SubscriptionMiddleware from '@/http/middleware/SubscriptionMiddleware';
import TenancyMiddleware from '@/http/middleware/TenancyMiddleware';
import EnsureTenantIsInitialized from '@/http/middleware/EnsureTenantIsInitialized';
import SettingsMiddleware from '@/http/middleware/SettingsMiddleware';

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
import Customers from '@/http/controllers/Customers';
import Vendors from '@/http/controllers/Vendors';
import Sales from '@/http/controllers/Sales'
import Purchases from '@/http/controllers/Purchases';
import Resources from './controllers/Resources';
import ExchangeRates from '@/http/controllers/ExchangeRates';
import Media from '@/http/controllers/Media';
import Ping from '@/http/controllers/Ping';
import Agendash from '@/http/controllers/Agendash';
import Subscription from '@/http/controllers/Subscription';
import VouchersController from '@/http/controllers/Subscription/Vouchers';


export default (app) => {
  app.use('/api/auth', Container.get(Authentication).router());
  app.use('/api/invite', Container.get(InviteUsers).router());
  app.use('/api/organization', Container.get(Organization).router());
  app.use('/api/vouchers', Container.get(VouchersController).router());
  app.use('/api/subscription', Container.get(Subscription).router());
  app.use('/api/ping', Container.get(Ping).router());

  const dashboard = express.Router(); 

  dashboard.use(JWTAuth);
  dashboard.use(AttachCurrentTenantUser)
  dashboard.use(TenancyMiddleware);
  dashboard.use(SubscriptionMiddleware('main'));
  dashboard.use(EnsureTenantIsInitialized);
  dashboard.use(SettingsMiddleware);
  
  dashboard.use('/api/users', Users.router());
  dashboard.use('/api/currencies', Currencies.router());
  dashboard.use('/api/accounts', Accounts.router());
  dashboard.use('/api/account_types', AccountTypes.router());
  dashboard.use('/api/accounting', Accounting.router());
  dashboard.use('/api/views', Views.router());
  dashboard.use('/api/items', Container.get(Items).router());
  dashboard.use('/api/item_categories', Container.get(ItemCategories).router());
  dashboard.use('/api/expenses', Expenses.router());
  dashboard.use('/api/financial_statements', FinancialStatements.router());
  dashboard.use('/api/settings', Container.get(Settings).router());
  dashboard.use('/api/sales', Sales.router());
  dashboard.use('/api/customers', Customers.router());
  dashboard.use('/api/vendors', Vendors.router());
  dashboard.use('/api/purchases', Purchases.router());
  dashboard.use('/api/resources', Resources.router());
  dashboard.use('/api/exchange_rates', ExchangeRates.router());
  dashboard.use('/api/media', Media.router());

  app.use('/agendash', Agendash.router());
  app.use('/', dashboard);
};
