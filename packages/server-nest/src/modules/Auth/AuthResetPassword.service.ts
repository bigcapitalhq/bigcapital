import { Injectable, Inject } from '@nestjs/common';
import uniqid from 'uniqid';
import moment from 'moment';
import config from '@/config';
import {
  IAuthResetedPasswordEventPayload,
  IAuthSendedResetPassword,
  IAuthSendingResetPassword,
  IPasswordReset,
  ISystemUser,
} from '@/interfaces';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import events from '@/subscribers/events';
import { PasswordReset } from '@/system/models';
import { ERRORS } from './_constants';
import { ServiceError } from '@/exceptions';
import { hashPassword } from '@/utils';

@Injectable()
export class AuthSendResetPasswordService {
  constructor(
    private readonly eventPublisher: EventPublisher,
    @Inject('SystemUserRepository') private readonly systemUserRepository: any,

    @Inject('PasswordResetModel')
    private readonly passwordResetModel: typeof PasswordReset,
  ) {}

  /**
   * Generates and retrieve password reset token for the given user email.
   * @param {string} email
   * @return {<Promise<IPasswordReset>}
   */
  public async sendResetPassword(email: string): Promise<PasswordReset> {
    const user = await this.validateEmailExistance(email);

    const token: string = uniqid();

    // Triggers sending reset password event.
    await this.eventPublisher.emitAsync(events.auth.sendingResetPassword, {
      user,
      token,
    } as IAuthSendingResetPassword);

    // Delete all stored tokens of reset password that associate to the give email.
    this.deletePasswordResetToken(email);

    // Creates a new password reset row with unique token.
    const passwordReset = await this.passwordResetModel
      .query()
      .insert({ email, token });

    // Triggers sent reset password event.
    await this.eventPublisher.emitAsync(events.auth.sendResetPassword, {
      user,
      token,
    } as IAuthSendedResetPassword);

    return passwordReset;
  }

  /**
   * Resets a user password from given token.
   * @param {string} token - Password reset token.
   * @param {string} password - New Password.
   * @return {Promise<void>}
   */
  public async resetPassword(token: string, password: string): Promise<void> {
    // Finds the password reset token.
    const tokenModel: IPasswordReset = await this.passwordResetModel
      .query()
      .findOne('token', token);
    // In case the password reset token not found throw token invalid error..
    if (!tokenModel) {
      throw new ServiceError(ERRORS.TOKEN_INVALID);
    }
    // Different between token creation datetime and current time.
    if (
      moment().diff(tokenModel.createdAt, 'seconds') >
      config.resetPasswordSeconds
    ) {
      // Deletes the expired token by expired token email.
      await this.deletePasswordResetToken(tokenModel.email);
      throw new ServiceError(ERRORS.TOKEN_EXPIRED);
    }
    const user = await this.systemUserRepository.findOneByEmail(
      tokenModel.email,
    );

    if (!user) {
      throw new ServiceError(ERRORS.USER_NOT_FOUND);
    }
    const hashedPassword = await hashPassword(password);

    await this.systemUserRepository.update(
      { password: hashedPassword },
      { id: user.id },
    );
    // Deletes the used token.
    await this.deletePasswordResetToken(tokenModel.email);

    // Triggers `onResetPassword` event.
    await this.eventPublisher.emitAsync(events.auth.resetPassword, {
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
    return this.passwordResetModel.query().where('email', email).delete();
  }

  /**
   * Validates the given email existance on the storage.
   * @throws {ServiceError}
   * @param {string} email - email address.
   */
  private async validateEmailExistance(email: string): Promise<ISystemUser> {
    const userByEmail = await this.systemUserRepository.findOneByEmail(email);

    if (!userByEmail) {
      throw new ServiceError(ERRORS.EMAIL_NOT_FOUND);
    }
    return userByEmail;
  }
}
