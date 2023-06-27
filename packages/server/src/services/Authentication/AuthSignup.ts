import { isEmpty, omit } from 'lodash';
import moment from 'moment';
import { ServiceError } from '@/exceptions';
import {
  IAuthSignedUpEventPayload,
  IAuthSigningUpEventPayload,
  IRegisterDTO,
  ISystemUser,
} from '@/interfaces';
import { ERRORS } from './_constants';
import { Inject } from 'typedi';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import TenantsManagerService from '../Tenancy/TenantsManager';
import events from '@/subscribers/events';
import { hashPassword } from '@/utils';
import config from '@/config';

export class AuthSignupService {
  @Inject()
  private eventPublisher: EventPublisher;

  @Inject('repositories')
  private sysRepositories: any;

  @Inject()
  private tenantsManager: TenantsManagerService;

  /**
   * Registers a new tenant with user from user input.
   * @throws {ServiceErrors}
   * @param {IRegisterDTO} signupDTO
   * @returns {Promise<ISystemUser>}
   */
  public async signUp(signupDTO: IRegisterDTO): Promise<ISystemUser> {
    const { systemUserRepository } = this.sysRepositories;

    // Validates the signup disable restrictions.
    await this.validateSignupRestrictions(signupDTO.email);

    // Validates the given email uniqueness.
    await this.validateEmailUniqueness(signupDTO.email);

    const hashedPassword = await hashPassword(signupDTO.password);

    // Triggers signin up event.
    await this.eventPublisher.emitAsync(events.auth.signingUp, {
      signupDTO,
    } as IAuthSigningUpEventPayload);

    const tenant = await this.tenantsManager.createTenant();
    const registeredUser = await systemUserRepository.create({
      ...omit(signupDTO, 'country'),
      active: true,
      password: hashedPassword,
      tenantId: tenant.id,
      inviteAcceptedAt: moment().format('YYYY-MM-DD'),
    });
    // Triggers signed up event.
    await this.eventPublisher.emitAsync(events.auth.signUp, {
      signupDTO,
      tenant,
      user: registeredUser,
    } as IAuthSignedUpEventPayload);

    return registeredUser;
  }

  /**
   * Validates email uniqueness on the storage.
   * @throws {ServiceErrors}
   * @param  {string} email - Email address
   */
  private async validateEmailUniqueness(email: string) {
    const { systemUserRepository } = this.sysRepositories;
    const isEmailExists = await systemUserRepository.findOneByEmail(email);

    if (isEmailExists) {
      throw new ServiceError(ERRORS.EMAIL_EXISTS);
    }
  }

  /**
   * Validate sign-up disable restrictions.
   * @param {string} email
   */
  private async validateSignupRestrictions(email: string) {
    // Can't continue if the signup is not disabled.
    if (!config.signupRestrictions.disabled) return;

    // Validate the allowed email addresses and domains.
    if (
      !isEmpty(config.signupRestrictions.allowedEmails) ||
      !isEmpty(config.signupRestrictions.allowedDomains)
    ) {
      const emailDomain = email.split('@').pop();
      const isAllowedEmail =
        config.signupRestrictions.allowedEmails.indexOf(email) !== -1;

      const isAllowedDomain = config.signupRestrictions.allowedDomains.some(
        (domain) => emailDomain === domain
      );

      if (!isAllowedEmail && !isAllowedDomain) {
        throw new ServiceError(ERRORS.SIGNUP_RESTRICTED_NOT_ALLOWED);
      }
      // Throw error if the signup is disabled with no exceptions.
    } else {
      throw new ServiceError(ERRORS.SIGNUP_RESTRICTED);
    }
  }
}
