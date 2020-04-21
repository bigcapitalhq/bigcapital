import { program } from 'commander';

program
  .version('0.0.1')
  .description('An application for pizzas ordering')
  .command('tenants:migrate')
  .description('Migrate all tenants or the given tenant id.')
  .option('-t, --tenant_id [tenant_id]', 'Which tenant id do you migrate.')
  .action(async () => {
    
  });

program.parse(process.argv);