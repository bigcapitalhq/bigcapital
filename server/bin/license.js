const commander = require('commander');
const color = require('colorette');
const argv = require('getopts')(process.argv.slice(2));
const cryptoRandomString = require('crypto-random-string');
const { 
  initSystemKnex,
  getAllSystemTenants,
  initTenantKnex,
  exit,
  success,
  log,
} = require('./utils');

// License generate key.
commander
  .command('license:generate <license_period>')
  .description('Generates a new license key.')
  .action(async (interval) => {
    try {
      const sysDb = initSystemKnex();
      let repeat = true;

      while(repeat) {
        key = cryptoRandomString(16).toUpperCase();
        const license = await sysDb('subscription_licenses').where('key', key);

        if (license.length === 0) {
          repeat = false;
        }
      }
      const licenseIds = await sysDb('subscription_licenses').insert({
        key,
        license_period: interval ? parseInt(interval, 10) : 1,
        license_interval: 'month',
      });
      const license = await sysDb('subscription_licenses').where('id', licenseIds[0]).first();
      success(`ID: ${license.id} | License: ${license.key} | Interval: ${license.licenseInterval} | Period: ${license.licensePeriod}`);
    } catch(error) {
      exit(error);
    }
  });

// Retrieve licenses list.
commander
  .command('licenses:list')
  .description('Retrieve a list of subscription licenses.')
  .action(async () => {
    const sysDb = initSystemKnex();
    const licenses = await sysDb('subscription_licenses');

    licenses.forEach((license) => {
      log(`ID: ${license.id} | Key: ${license.key} | Interval: ${license.licenseInterval} | Period: ${license.licensePeriod}`);
    });
    exit();
  });