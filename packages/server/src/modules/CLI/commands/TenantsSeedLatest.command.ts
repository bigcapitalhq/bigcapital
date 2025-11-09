import { Command, CommandRunner } from 'nest-commander';

@Command({
  name: 'tenants:seed:latest',
  description: 'Seed all tenant databases with the latest data',
})
export class TenantsSeedLatestCommand extends CommandRunner {
  async run(): Promise<void> {
    console.log('Tenants seeding with latest data - No operation performed');
    // TODO: Implement tenants seeding logic
  }
}
