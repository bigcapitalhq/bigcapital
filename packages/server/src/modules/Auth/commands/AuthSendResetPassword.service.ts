import { Inject, Injectable } from '@nestjs/common';
import * as uniqid from 'uniqid';
import {
  IAuthSendedResetPassword,
  IAuthSendingResetPassword,
} from '../Auth.interfaces';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PasswordReset } from '../models/PasswordReset';
import { SystemUser } from '@/modules/System/models/SystemUser';
import { events } from '@/common/events/events';

@Injectable()
export class AuthSendResetPasswordService {
  /**
   * @param {EventEmitter2} eventPublisher - Event emitter.
   * @param {typeof PasswordReset} resetPasswordModel - Password reset model.
   * @param {typeof SystemUser} systemUserModel - System user model.
   */
  constructor(
    private readonly eventPublisher: EventEmitter2,

    @Inject(PasswordReset.name)
    private readonly resetPasswordModel: typeof PasswordReset,

    @Inject(SystemUser.name)
    private readonly systemUserModel: typeof SystemUser,
  ) { }

  /**
   * Sends the given email reset password email.
   * @param {string} email - Email address.
   */
  async sendResetPassword(email: string): Promise<void> {
    const user = await this.systemUserModel
      .query()
      .findOne({ email });

    if (!user) return;

    const token: string = uniqid();

    // Triggers sending reset password event.
    await this.eventPublisher.emitAsync(events.auth.sendingResetPassword, {
      user,
      token,
    } as IAuthSendingResetPassword);

    // Delete all stored tokens of reset password that associate to the give email.
    this.deletePasswordResetToken(email);

    // Creates a new password reset row with unique token.
    await this.resetPasswordModel.query().insert({ email, token });

    // Triggers sent reset password event.
    await this.eventPublisher.emitAsync(events.auth.sendResetPassword, {
      user,
      token,
    } as IAuthSendedResetPassword);
  }

  /**
   * Deletes the password reset token by the given email.
   * @param {string} email
   * @returns {Promise}
   */
  private async deletePasswordResetToken(email: string) {
    return this.resetPasswordModel.query().where('email', email).delete();
  }
}
