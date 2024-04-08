import Account from '../models/Account';

describe('CachableModel', () => {
  describe('remember()', () => {
    it('Should retrieve the data from the storage.', async () => {
      for (let i = 0; i < 1; i++) {
        const account = await Account.tenant().query().remember().where('id', 1);

        const account2 = await Account.tenant().query().remember().withGraphFetched('balance');

        console.log(account2);
        // \\\
      }
      // Account.flushCache();
    });
  });
});
