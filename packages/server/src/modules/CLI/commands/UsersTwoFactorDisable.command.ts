import { Command, Option } from 'nest-commander';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseCommand } from './BaseCommand';

interface UsersTwoFactorDisableOptions {
  email?: string;
}

/**
 * Turns two-factor authentication off for one user, for a user who lost both
 * the authenticator app and the recovery codes. Run on the server only.
 */
@Injectable()
@Command({
  name: 'users:two-factor:disable',
  description:
    'Turn off two-factor authentication of a user (lost authenticator and recovery codes).',
})
export class UsersTwoFactorDisableCommand extends BaseCommand {
  constructor(configService: ConfigService) {
    super(configService);
  }

  @Option({
    flags: '-e, --email <email>',
    description: 'Email address of the user.',
    required: true,
  })
  parseEmail(value: string): string {
    return value;
  }

  async run(
    _passedParams: string[],
    options: UsersTwoFactorDisableOptions,
  ): Promise<void> {
    const knex = this.initSystemKnex();

    try {
      const users = await knex('users')
        .where('email', options.email)
        .select('id');

      if (users.length === 0) {
        this.exit(`No user with the email ${options.email}.`);
      }
      let removed = 0;

      for (const user of users) {
        await knex.transaction(async (trx) => {
          await trx('users_two_factor_recovery_codes')
            .where('userId', user.id)
            .delete();
          removed += await trx('users_two_factor')
            .where('userId', user.id)
            .delete();
        });
      }
      await knex.destroy();
      this.success(
        removed > 0
          ? `Two-factor authentication turned off for ${options.email}.`
          : `${options.email} did not have two-factor authentication.`,
      );
    } catch (error) {
      this.exit(error);
    }
  }
}
