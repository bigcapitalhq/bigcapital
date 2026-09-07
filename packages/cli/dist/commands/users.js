"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUsersCommand = createUsersCommand;
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const sdk_ts_1 = require("@bigcapital/sdk-ts");
const config_1 = require("../config");
const errors_1 = require("../utils/errors");
const table_1 = require("../utils/table");
function createUsersCommand() {
    const command = new commander_1.Command('users')
        .description('Manage users and roles');
    command
        .command('list')
        .description('List all users')
        .action(async () => {
        const spinner = (0, ora_1.default)('Loading users...').start();
        try {
            const fetcher = (0, config_1.createAuthenticatedFetcher)();
            const response = await (0, sdk_ts_1.fetchUsers)(fetcher);
            spinner.stop();
            const users = response.users;
            if (!users || users.length === 0) {
                console.log(chalk_1.default.yellow('No users found.'));
                return;
            }
            const table = (0, table_1.createTable)(['ID', 'Name', 'Email', 'Role', 'Status']);
            users.forEach((user) => {
                const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || '-';
                table.push([
                    user.id,
                    name,
                    user.email || '-',
                    user.role?.name || '-',
                    (0, table_1.formatStatus)(user.active ? 'active' : 'inactive'),
                ]);
            });
            console.log(table.toString());
        }
        catch (error) {
            spinner.stop();
            (0, errors_1.handleError)(error);
        }
    });
    command
        .command('roles')
        .description('List all roles')
        .action(async () => {
        const spinner = (0, ora_1.default)('Loading roles...').start();
        try {
            const fetcher = (0, config_1.createAuthenticatedFetcher)();
            const response = await (0, sdk_ts_1.fetchRoles)(fetcher);
            spinner.stop();
            const roles = response.roles;
            if (!roles || roles.length === 0) {
                console.log(chalk_1.default.yellow('No roles found.'));
                return;
            }
            const table = (0, table_1.createTable)(['ID', 'Name', 'Slug', 'Description']);
            roles.forEach((role) => {
                table.push([
                    role.id,
                    role.name || '-',
                    role.slug || '-',
                    role.description || '-',
                ]);
            });
            console.log(table.toString());
        }
        catch (error) {
            spinner.stop();
            (0, errors_1.handleError)(error);
        }
    });
    return command;
}
