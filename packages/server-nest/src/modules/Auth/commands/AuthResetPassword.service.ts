import { ConfigService } from '@nestjs/config';
import { Inject, Injectable } from '@nestjs/common';
import { SystemUser } from '@/modules/System/models/SystemUser';
import { PasswordReset } from '../models/PasswordReset';
import { ServiceError } from '@/modules/Items/ServiceError';
import { ERRORS } from '../Auth.constants';
import { hashPassword } from '../Auth.utils';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { IAuthResetedPasswordEventPayload } from '../Auth.interfaces';

@Injectable()
export class AuthResetPasswordService {
  /**
   * @param {ConfigService} configService - Config service.
   * @param {EventEmitter2} eventEmitter - Event emitter.
   * @param {typeof SystemUser} systemUserModel
   * @param {typeof PasswordReset} passwordResetModel - Reset password model.
   */
  constructor(
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,

    @Inject(SystemUser.name)
    private readonly systemUserModel: typeof SystemUser,

    @Inject(PasswordReset.name)
    private readonly passwordResetModel: typeof PasswordReset,
  ) {}

  /**
   * Resets a user password from given token.
   * @param {string} token - Password reset token.
   * @param {string} password - New Password.
   * @return {Promise<void>}
   */
  public async resetPassword(token: string, password: string): Promise<void> {
    // Finds the password reset token.
    const tokenModel = await this.passwordResetModel
      .query()
      .findOne('token', token);

    // In case the password reset token not found throw token invalid error..
    if (!tokenModel) {
      throw new ServiceError(ERRORS.TOKEN_INVALID);
    }
    const resetPasswordSeconds = this.configService.get('resetPasswordSeconds');

    // Different between tokne creation datetime and current time.
    if (moment().diff(tokenModel.createdAt, 'seconds') > resetPasswordSeconds) {
      // Deletes the expired token by expired token email.
      await this.deletePasswordResetToken(tokenModel.email);
      throw new ServiceError(ERRORS.TOKEN_EXPIRED);
    }
    const user = await this.systemUserModel
      .query()
      .findOne({ email: tokenModel.email });

    if (!user) {
      throw new ServiceError(ERRORS.USER_NOT_FOUND);
    }
    const hashedPassword = await hashPassword(password);

    await this.systemUserModel
      .query()
      .findById(user.id)
      .update({ password: hashedPassword });

    // Deletes the used token.
    await this.deletePasswordResetToken(tokenModel.email);

    // Triggers `onResetPassword` event.
    await this.eventEmitter.emitAsync(events.auth.resetPassword, {
      user,
      token,
      password,
    } as IAuthResetedPasswordEventPayload);
  }

  /**
   * Deletes the password reset token by the given email.
   * @param {string} email
   * @returns {Promise}
   */
  private async deletePasswordResetToken(email: string) {
    return PasswordReset.query().where('email', email).delete();
  }
}
