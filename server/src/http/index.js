// import OAuth2 from '@/http/controllers/OAuth2';
import express from 'express';
import Authentication from '@/http/controllers/Authentication';
import InviteUsers from '@/http/controllers/InviteUsers';
import Users from '@/http/controllers/Users';
// import Roles from '@/http/controllers/Roles';
import Items from '@/http/controllers/Items';
import ItemCategories from '@/http/controllers/ItemCategories';
import Accounts from '@/http/controllers/Accounts';
import AccountTypes from '@/http/controllers/AccountTypes';
// import AccountOpeningBalance from '@/http/controllers/AccountOpeningBalance';
import Views from '@/http/controllers/Views';
// import CustomFields from '@/http/controllers/Fields';
import Accounting from '@/http/controllers/Accounting';
import FinancialStatements from '@/http/controllers/FinancialStatements';
import Expenses from '@/http/controllers/Expenses';
import Options from '@/http/controllers/Options';
// import Budget from '@/http/controllers/Budget';
// import BudgetReports from '@/http/controllers/BudgetReports';
import Currencies from '@/http/controllers/Currencies';
import Customers from '@/http/controllers/Customers';
import Vendors from '@/http/controllers/Vendors';
// import Suppliers from '@/http/controllers/Suppliers';
// import Bills from '@/http/controllers/Bills';
// import CurrencyAdjustment from './controllers/CurrencyAdjustment';
import Resources from './controllers/Resources';
import ExchangeRates from '@/http/controllers/ExchangeRates';
// import SalesReports from '@/http/controllers/SalesReports';
// import PurchasesReports from '@/http/controllers/PurchasesReports';
import Media from '@/http/controllers/Media';
import JWTAuth from '@/http/middleware/jwtAuth';
import TenancyMiddleware from '@/http/middleware/TenancyMiddleware';


export default (app) => {
  // app.use('/api/oauth2', OAuth2.router());
  app.use('/api/auth', Authentication.router());
  app.use('/api/invite', InviteUsers.router());

  const dashboard = express.Router();

  dashboard.use(JWTAuth);
  dashboard.use(TenancyMiddleware);

  dashboard.use('/api/currencies', Currencies.router());
  dashboard.use('/api/users', Users.router());
  // app.use('/api/roles', Roles.router());
  dashboard.use('/api/accounts', Accounts.router());
  dashboard.use('/api/account_types', AccountTypes.router());
  dashboard.use('/api/accounting', Accounting.router());
  // app.use('/api/accounts_opening_balances', AccountOpeningBalance.router());
  dashboard.use('/api/views', Views.router());
  // app.use('/api/fields', CustomFields.router());
  dashboard.use('/api/items', Items.router());
  dashboard.use('/api/item_categories', ItemCategories.router());
  dashboard.use('/api/expenses', Expenses.router());
  dashboard.use('/api/financial_statements', FinancialStatements.router());
  dashboard.use('/api/options', Options.router());
  // app.use('/api/budget_reports', BudgetReports.router());
  dashboard.use('/api/customers', Customers.router());
  dashboard.use('/api/vendors', Vendors.router());
  // app.use('/api/suppliers', Suppliers.router());
  // app.use('/api/bills', Bills.router());
  // app.use('/api/budget', Budget.router());
  dashboard.use('/api/resources', Resources.router());
  dashboard.use('/api/exchange_rates', ExchangeRates.router());
  dashboard.use('/api/media', Media.router());

  app.use('/', dashboard);  
  // app.use('/api/currency_adjustment', CurrencyAdjustment.router());
  // app.use('/api/reports/sales', SalesReports.router());
  // app.use('/api/reports/purchases', PurchasesReports.router());
};
