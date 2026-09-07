import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { fetchUsers, fetchRoles } from '@bigcapital/sdk-ts';
import { createAuthenticatedFetcher } from '../config';
import { handleError } from '../utils/errors';
import { createTable, formatStatus } from '../utils/table';

export function createUsersCommand(): Command {
  const command = new Command('users')
    .description('Manage users and roles');

  command
    .command('list')
    .description('List all users')
    .action(async () => {
      const spinner = ora('Loading users...').start();

      try {
        const fetcher = createAuthenticatedFetcher();
        const response = await fetchUsers(fetcher);

        spinner.stop();

        const users = (response as unknown as { users: Array<{
          id: number;
          firstName?: string;
          lastName?: string;
          email?: string;
          role?: { name?: string };
          active?: boolean;
        }> }).users;

        if (!users || users.length === 0) {
          console.log(chalk.yellow('No users found.'));
          return;
        }

        const table = createTable(['ID', 'Name', 'Email', 'Role', 'Status']);

        users.forEach((user) => {
          const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || '-';
          table.push([
            user.id,
            name,
            user.email || '-',
            user.role?.name || '-',
            formatStatus(user.active ? 'active' : 'inactive'),
          ]);
        });

        console.log(table.toString());
      } catch (error) {
        spinner.stop();
        handleError(error);
      }
    });

  command
    .command('roles')
    .description('List all roles')
    .action(async () => {
      const spinner = ora('Loading roles...').start();

      try {
        const fetcher = createAuthenticatedFetcher();
        const response = await fetchRoles(fetcher);

        spinner.stop();

        const roles = (response as unknown as { roles: Array<{
          id: number;
          name?: string;
          description?: string;
          slug?: string;
        }> }).roles;

        if (!roles || roles.length === 0) {
          console.log(chalk.yellow('No roles found.'));
          return;
        }

        const table = createTable(['ID', 'Name', 'Slug', 'Description']);

        roles.forEach((role) => {
          table.push([
            role.id,
            role.name || '-',
            role.slug || '-',
            role.description || '-',
          ]);
        });

        console.log(table.toString());
      } catch (error) {
        spinner.stop();
        handleError(error);
      }
    });

  return command;
}
