import { Router } from 'express';
import { Container } from 'typedi';

// Middlewares
import JWTAuth from '@/api/middleware/jwtAuth';
import AttachCurrentTenantUser from '@/api/middleware/AttachCurrentTenantUser';
import TenancyMiddleware from '@/api/middleware/TenancyMiddleware';
import EnsureTenantIsInitialized from '@/api/middleware/EnsureTenantIsInitialized';
import SettingsMiddleware from '@/api/middleware/SettingsMiddleware';
import I18nMiddleware from '@/api/middleware/I18nMiddleware';
import I18nAuthenticatedMiddleware from '@/api/middleware/I18nAuthenticatedMiddleware';
import EnsureTenantIsSeeded from '@/api/middleware/EnsureTenantIsSeeded';

// Routes
import Authentication from '@/api/controllers/Authentication';
import InviteUsers from '@/api/controllers/InviteUsers';
import Organization from '@/api/controllers/Organization';
import Account from '@/api/controllers/Account';
import Users from '@/api/controllers/Users';
import Items from '@/api/controllers/Items';
import ItemCategories from '@/api/controllers/ItemCategories';
import Accounts from '@/api/controllers/Accounts';
import AccountTypes from '@/api/controllers/AccountTypes';
import Views from '@/api/controllers/Views';
import ManualJournals from '@/api/controllers/ManualJournals';
import FinancialStatements from '@/api/controllers/FinancialStatements';
import Expenses from '@/api/controllers/Expenses';
import Settings from '@/api/controllers/Settings';
import Currencies from '@/api/controllers/Currencies';
import Contacts from '@/api/controllers/Contacts/Contacts';
import Customers from '@/api/controllers/Contacts/Customers';
import Vendors from '@/api/controllers/Contacts/Vendors';
import Sales from '@/api/controllers/Sales';
import Purchases from '@/api/controllers/Purchases';
import Resources from './controllers/Resources';
import ExchangeRates from '@/api/controllers/ExchangeRates';
import Media from '@/api/controllers/Media';
import Ping from '@/api/controllers/Ping';
import InventoryAdjustments from '@/api/controllers/Inventory/InventoryAdjustments';
import asyncRenderMiddleware from './middleware/AsyncRenderMiddleware';
import Jobs from './controllers/Jobs';
import Miscellaneous from '@/api/controllers/Miscellaneous';
import OrganizationDashboard from '@/api/controllers/OrganizationDashboard';
import CashflowController from './controllers/Cashflow/CashflowController';
import AuthorizationMiddleware from './middleware/AuthorizationMiddleware';
import RolesController from './controllers/Roles';
import TransactionsLocking from './controllers/TransactionsLocking';
import DashboardController from './controllers/Dashboard';
import { BranchesController } from './controllers/Branches';
import { WarehousesController } from './controllers/Warehouses';
import { WarehousesTransfers } from './controllers/Warehouses/WarehouseTransfers';
import { WarehousesItemController } from './controllers/Warehouses/WarehousesItem';
import { BranchIntegrationErrorsMiddleware } from '@/services/Branches/BranchIntegrationErrorsMiddleware';
import { InventoryItemsCostController } from './controllers/Inventory/InventoryItemsCosts';
import { ProjectsController } from './controllers/Projects/Projects';
import { ProjectTasksController } from './controllers/Projects/Tasks';
import { ProjectTimesController } from './controllers/Projects/Times';

export default () => {
  const app = Router();

  // - Global routes.
  // ---------------------------
  app.use(asyncRenderMiddleware);
  app.use(I18nMiddleware);

  app.use('/auth', Container.get(Authentication).router());
  app.use('/invite', Container.get(InviteUsers).nonAuthRouter());
  app.use('/organization', Container.get(Organization).router());
  app.use('/ping', Container.get(Ping).router());
  app.use('/jobs', Container.get(Jobs).router());
  app.use('/account', Container.get(Account).router());

  // - Dashboard routes.
  // ---------------------------
  const dashboard = Router();

  dashboard.use(JWTAuth);
  dashboard.use(AttachCurrentTenantUser);
  dashboard.use(TenancyMiddleware);
  dashboard.use(EnsureTenantIsInitialized);
  dashboard.use(SettingsMiddleware);
  dashboard.use(I18nAuthenticatedMiddleware);
  dashboard.use(EnsureTenantIsSeeded);
  dashboard.use(AuthorizationMiddleware);

  dashboard.use('/organization', Container.get(OrganizationDashboard).router());
  dashboard.use('/users', Container.get(Users).router());
  dashboard.use('/invite', Container.get(InviteUsers).authRouter());
  dashboard.use('/currencies', Container.get(Currencies).router());
  dashboard.use('/settings', Container.get(Settings).router());
  dashboard.use('/accounts', Container.get(Accounts).router());
  dashboard.use('/account_types', Container.get(AccountTypes).router());
  dashboard.use('/manual-journals', Container.get(ManualJournals).router());
  dashboard.use('/views', Container.get(Views).router());
  dashboard.use('/items', Container.get(Items).router());
  dashboard.use('/item_categories', Container.get(ItemCategories).router());
  dashboard.use('/expenses', Container.get(Expenses).router());
  dashboard.use(
    '/financial_statements',
    Container.get(FinancialStatements).router()
  );
  dashboard.use('/contacts', Container.get(Contacts).router());
  dashboard.use('/customers', Container.get(Customers).router());
  dashboard.use('/vendors', Container.get(Vendors).router());
  dashboard.use('/sales', Container.get(Sales).router());
  dashboard.use('/purchases', Container.get(Purchases).router());
  dashboard.use('/resources', Container.get(Resources).router());
  dashboard.use('/exchange_rates', Container.get(ExchangeRates).router());
  dashboard.use('/media', Container.get(Media).router());
  dashboard.use(
    '/inventory_adjustments',
    Container.get(InventoryAdjustments).router()
  );
  dashboard.use(
    '/inventory',
    Container.get(InventoryItemsCostController).router()
  );
  dashboard.use('/cashflow', Container.get(CashflowController).router());
  dashboard.use('/roles', Container.get(RolesController).router());
  dashboard.use(
    '/transactions-locking',
    Container.get(TransactionsLocking).router()
  );
  dashboard.use('/branches', Container.get(BranchesController).router());
  dashboard.use(
    '/warehouses/transfers',
    Container.get(WarehousesTransfers).router()
  );
  dashboard.use('/warehouses', Container.get(WarehousesController).router());
  dashboard.use('/projects', Container.get(ProjectsController).router());
  dashboard.use('/', Container.get(ProjectTasksController).router());
  dashboard.use('/', Container.get(ProjectTimesController).router());

  dashboard.use('/', Container.get(WarehousesItemController).router());

  dashboard.use('/dashboard', Container.get(DashboardController).router());
  dashboard.use('/', Container.get(Miscellaneous).router());

  app.use('/', dashboard);

  app.use(BranchIntegrationErrorsMiddleware);

  return app;
};
