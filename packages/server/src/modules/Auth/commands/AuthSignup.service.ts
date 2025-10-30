import * as crypto from 'crypto';
import * as moment from 'moment';
import { events } from '@/common/events/events';
import { ServiceError } from '@/modules/Items/ServiceError';
import { SystemUser } from '@/modules/System/models/SystemUser';
import { TenantsManagerService } from '@/modules/TenantDBManager/TenantsManager';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { isEmpty } from 'class-validator';
import { AuthSignupDto } from '../dtos/AuthSignup.dto';
import {
  IAuthSignedUpEventPayload,
  IAuthSigningUpEventPayload,
} from '../Auth.interfaces';
import { defaultTo } from 'ramda';
import { ERRORS } from '../Auth.constants';
import { hashPassword } from '../Auth.utils';

@Injectable()
export class AuthSignupService {
  /**
   * @param {ConfigService} configService - Config service
   * @param {EventEmitter2} eventEmitter - Event emitter
   * @param {TenantsManagerService} tenantsManager - Tenants manager
   * @param {typeof SystemUser} systemUserModel - System user model
   */
  constructor(
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,
    private readonly tenantsManager: TenantsManagerService,

    @Inject(SystemUser.name)
    private readonly systemUserModel: typeof SystemUser,
  ) { }

  /**
   * Registers a new tenant with user from user input.
   * @param {AuthSignupDto} signupDTO
   */
  public async signUp(signupDTO: AuthSignupDto) {
    // Validates the signup disable restrictions.
    await this.validateSignupRestrictions(signupDTO.email);

    // Validates the given email uniqiness.
    await this.validateEmailUniqiness(signupDTO.email);

    const hashedPassword = await hashPassword(signupDTO.password);
    const signupConfirmation = this.configService.get('signupConfirmation');

    const verifyTokenCrypto = crypto.randomBytes(64).toString('hex');
    const verifiedEnabed = defaultTo(signupConfirmation.enabled, false);
    const verifyToken = verifiedEnabed ? verifyTokenCrypto : '';
    const verified = !verifiedEnabed;

    const inviteAcceptedAt = moment().format('YYYY-MM-DD');

    // Triggers signin up event.
    await this.eventEmitter.emitAsync(events.auth.signingUp, {
      signupDTO,
    } as IAuthSigningUpEventPayload);

    const tenant = await this.tenantsManager.createTenant();
    const user = await this.systemUserModel.query().insert({
      ...signupDTO,
      verifyToken,
      verified,
      active: true,
      password: hashedPassword,
      tenantId: tenant.id,
      inviteAcceptedAt,
    });
    // Triggers signed up event.
    await this.eventEmitter.emitAsync(events.auth.signUp, {
      signupDTO,
      tenant,
      user,
    } as IAuthSignedUpEventPayload);

    return {
      userId: user.id,
      tenantId: user.tenantId,
      organizationId: tenant.organizationId,
    };
  }

  /**
   * Validates email uniqiness on the storage.
   * @param {string} email - Email address
   */
  private async validateEmailUniqiness(email: string) {
    const isEmailExists = await this.systemUserModel.query().findOne({ email });

    if (isEmailExists) {
      throw new ServiceError(
        ERRORS.EMAIL_EXISTS,
        'The given email address is already signed-up',
      );
    }
  }

  /**
   * Validate sign-up disable restrictions.
   * @param {string} email - Signup email address
   */
  private async validateSignupRestrictions(email: string) {
    const signupRestrictions = this.configService.get('signupRestrictions');

    // Can't continue if the signup is not disabled.
    if (!signupRestrictions.disabled) return;

    // Validate the allowed email addresses and domains.
    if (
      !isEmpty(signupRestrictions.allowedEmails) ||
      !isEmpty(signupRestrictions.allowedDomains)
    ) {
      const emailDomain = email.split('@').pop();
      const isAllowedEmail =
        signupRestrictions.allowedEmails.indexOf(email) !== -1;

      const isAllowedDomain = signupRestrictions.allowedDomains.some(
        (domain) => emailDomain === domain,
      );
      if (!isAllowedEmail && !isAllowedDomain) {
        throw new ServiceError(
          ERRORS.SIGNUP_RESTRICTED_NOT_ALLOWED,
          'The given email address format is not allowed to signup.',
        );
      }
      // Throw error if the signup is disabled with no exceptions.
    } else {
      throw new ServiceError(
        ERRORS.SIGNUP_RESTRICTED,
        'The sign-up is disabled',
      );
    }
  }
}
