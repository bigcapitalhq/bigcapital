import type { Command } from 'commander';
import { registerAddCommand } from './add';
import { registerDoctorCommand } from './doctor';
import { registerRemoveCommand } from './remove';
import { registerSyncCommand } from './sync';
import { registerVerifyCommand } from './verify';

export * from './add';
export * from './doctor';
export * from './remove';
export * from './sync';
export * from './verify';

export function registerCommands(program: Command): void {
  registerAddCommand(program);
  registerRemoveCommand(program);
  registerVerifyCommand(program);
  registerSyncCommand(program);
  registerDoctorCommand(program);
}
