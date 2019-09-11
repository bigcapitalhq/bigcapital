// import OAuth2 from '@/http/controllers/OAuth2';
import Authentication from '@/http/controllers/Authentication';
import Users from '@/http/controllers/Users';
import Roles from '@/http/controllers/Roles';
import Items from '@/http/controllers/Items';
import ItemCategories from '@/http/controllers/ItemCategories';
import Accounts from '@/http/controllers/Accounts';
import AccountOpeningBalance from '@/http/controllers/AccountOpeningBalance';

export default (app) => {
  // app.use('/api/oauth2', OAuth2.router());
  app.use('/api/auth', Authentication.router());
  app.use('/api/users', Users.router());
  app.use('/api/roles', Roles.router());
  app.use('/api/accounts', Accounts.router());
  app.use('/api/accountOpeningBalance', AccountOpeningBalance.router());
  app.use('/api/items', Items.router());
  app.use('/api/item_categories', ItemCategories.router());
};
