import { Inject, Service } from 'typedi';
import events from '@/subscribers/events';
import { ServiceError } from '@/exceptions';
import {
  IEditUserDTO,
  ISystemUser,
  ITenantUser,
  ITenantUserActivatedPayload,
  ITenantUserDeletedPayload,
  ITenantUserEditedPayload,
  ITenantUserInactivatedPayload,
} from '@/interfaces';
import RolesService from '@/services/Roles/RolesService';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { ERRORS } from './constants';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';

@Service()
export default class UsersService {
  @Inject('logger')
  logger: any;

  @Inject('repositories')
  repositories: any;

  @Inject()
  rolesService: RolesService;

  @Inject()
  tenancy: HasTenancyService;

  @Inject()
  eventPublisher: EventPublisher;

  /**
   * Creates a new user.
   * @param {number} tenantId - Tenant id.
   * @param {number} userId - User id.
   * @param {IUserDTO} editUserDTO - Edit user DTO.
   * @return {Promise<ISystemUser>}
   */
  public async editUser(
    tenantId: number,
    userId: number,
    editUserDTO: IEditUserDTO,
    authorizedUser: ISystemUser
  ): Promise<any> {
    const { User } = this.tenancy.models(tenantId);
    const { email, phoneNumber } = editUserDTO;

    // Retrieve the tenant user or throw not found service error.
    const oldTenantUser = await this.getTenantUserOrThrowError(
      tenantId,
      userId
    );
    // Validate cannot mutate the authorized user.
    this.validateMutateRoleNotAuthorizedUser(
      oldTenantUser,
      editUserDTO,
      authorizedUser
    );
    // Validate user email should be unique.
    await this.validateUserEmailUniquiness(tenantId, email, userId);

    // Validate user phone number should be unique.
    await this.validateUserPhoneNumberUniqiness(tenantId, phoneNumber, userId);

    // Retrieve the given role or throw not found service error.
    const role = await this.rolesService.getRoleOrThrowError(
      tenantId,
      editUserDTO.roleId
    );
    // Updates the tenant user.
    const tenantUser = await User.query().updateAndFetchById(userId, {
      ...editUserDTO,
    });
    // Triggers `onTenantUserEdited` event.
    await this.eventPublisher.emitAsync(events.tenantUser.onEdited, {
      tenantId,
      userId,
      editUserDTO,
      tenantUser,
      oldTenantUser,
    } as ITenantUserEditedPayload);

    return tenantUser;
  }

  /**
   * Deletes the given user id.
   * @param {number} tenantId - Tenant id.
   * @param {number} userId - User id.
   */
  public async deleteUser(tenantId: number, userId: number): Promise<void> {
    const { User } = this.tenancy.models(tenantId);

    // Retrieve user details or throw not found service error.
    const tenantUser = await this.getTenantUserOrThrowError(tenantId, userId);

    // Validate the delete user should not be the last user.
    await this.validateNotLastUserDelete(tenantId);

    // Delete user from the storage.
    await User.query().findById(userId).delete();

    // Triggers `onTenantUserDeleted` event.
    await this.eventPublisher.emitAsync(events.tenantUser.onDeleted, {
      tenantId,
      userId,
      tenantUser,
    } as ITenantUserDeletedPayload);
  }

  /**
   * Activate the given user id.
   * @param {number} tenantId - Tenant id.
   * @param {number} userId - User id.
   * @return {Promise<void>}
   */
  public async activateUser(
    tenantId: number,
    userId: number,
    authorizedUser: ISystemUser
  ): Promise<void> {
    const { User } = this.tenancy.models(tenantId);

    // Throw service error if the given user is equals the authorized user.
    this.throwErrorIfUserSameAuthorizedUser(userId, authorizedUser);

    // Retrieve the user or throw not found service error.
    const tenantUser = await this.getTenantUserOrThrowError(tenantId, userId);

    // Throw serivce error if the user is already activated.
    this.throwErrorIfUserActive(tenantUser);

    // Marks the tenant user as active.
    await User.query().findById(userId).update({ active: true });

    // Triggers `onTenantUserActivated` event.
    await this.eventPublisher.emitAsync(events.tenantUser.onActivated, {
      tenantId,
      userId,
      authorizedUser,
      tenantUser,
    } as ITenantUserActivatedPayload);
  }

  /**
   * Inactivate the given user id.
   * @param {number} tenantId
   * @param {number} userId
   * @return {Promise<void>}
   */
  public async inactivateUser(
    tenantId: number,
    userId: number,
    authorizedUser: ISystemUser
  ): Promise<void> {
    const { User } = this.tenancy.models(tenantId);

    // Throw service error if the given user is equals the authorized user.
    this.throwErrorIfUserSameAuthorizedUser(userId, authorizedUser);

    // Retrieve the user or throw not found service error.
    const tenantUser = await this.getTenantUserOrThrowError(tenantId, userId);

    // Throw serivce error if the user is already inactivated.
    this.throwErrorIfUserInactive(tenantUser);

    // Marks the tenant user as active.
    await User.query().findById(userId).update({ active: true });

    // Triggers `onTenantUserActivated` event.
    await this.eventPublisher.emitAsync(events.tenantUser.onInactivated, {
      tenantId,
      userId,
      authorizedUser,
      tenantUser,
    } as ITenantUserInactivatedPayload);
  }

  /**
   * Retrieve users list based on the given filter.
   * @param {number} tenantId
   * @param {object} filter
   */
  public async getList(tenantId: number) {
    const { User } = this.tenancy.models(tenantId);

    const users = await User.query().withGraphFetched('role');

    return users;
  }

  /**
   * Retrieve the given user details.
   * @param {number} tenantId - Tenant id.
   * @param {number} userId - User id.
   */
  public async getUser(tenantId: number, userId: number) {
    // Retrieve the system user.
    const user = await this.getTenantUserOrThrowError(tenantId, userId);

    return user;
  }

  /**
   * Validate user existance throw error in case user was not found.,
   * @param {number} tenantId -
   * @param {number} userId -
   * @returns {ISystemUser}
   */
  async getTenantUserOrThrowError(
    tenantId: number,
    userId: number
  ): Promise<ITenantUser> {
    const { User } = this.tenancy.models(tenantId);

    const user = await User.query().findById(userId);

    if (!user) {
      throw new ServiceError(ERRORS.USER_NOT_FOUND);
    }
    return user;
  }

  /**
   * Validate the delete user should not be the last user.
   * @param {number} tenantId
   */
  private async validateNotLastUserDelete(tenantId: number) {
    const { systemUserRepository } = this.repositories;

    const usersFound = await systemUserRepository.find({ tenantId });

    if (usersFound.length === 1) {
      throw new ServiceError(ERRORS.CANNOT_DELETE_LAST_USER);
    }
  }

  /**
   * Throws service error in case the user was already active.
   * @param {ISystemUser} user
   * @throws {ServiceError}
   */
  private throwErrorIfUserActive(user: ISystemUser) {
    if (user.active) {
      throw new ServiceError(ERRORS.USER_ALREADY_ACTIVE);
    }
  }

  /**
   * Throws service error in case the user was already inactive.
   * @param {ISystemUser} user
   * @throws {ServiceError}
   */
  private throwErrorIfUserInactive(user: ITenantUser) {
    if (!user.active) {
      throw new ServiceError(ERRORS.USER_ALREADY_INACTIVE);
    }
  }

  /**
   * Throw service error in case the given user same the authorized user.
   * @param {number} userId
   * @param {ISystemUser} authorizedUser
   */
  private throwErrorIfUserSameAuthorizedUser(
    userId: number,
    authorizedUser: ISystemUser
  ) {
    if (userId === authorizedUser.id) {
      throw new ServiceError(ERRORS.USER_SAME_THE_AUTHORIZED_USER);
    }
  }

  /**
   * Validate the given user email should be unique in the storage.
   * @param {string} email
   * @param {number} userId
   */
  private validateUserEmailUniquiness = async (
    tenantId: number,
    email: string,
    userId: number
  ) => {
    const { User } = this.tenancy.models(tenantId);

    const userByEmail = await User.query()
      .findOne('email', email)
      .whereNot('id', userId);

    if (userByEmail) {
      throw new ServiceError(ERRORS.EMAIL_ALREADY_EXISTS);
    }
  };

  /**
   * Validate user phone number should be unique.
   * @param {string} phoneNumber -
   * @param {number} userId -
   */
  private validateUserPhoneNumberUniqiness = async (
    tenantId: number,
    phoneNumber: string,
    userId: number
  ) => {
    const { User } = this.tenancy.models(tenantId);

    const userByPhoneNumber = await User.query()
      .findOne('phone_number', phoneNumber)
      .whereNot('id', userId);

    if (userByPhoneNumber) {
      throw new ServiceError(ERRORS.PHONE_NUMBER_ALREADY_EXIST);
    }
  };

  /**
   * Validate the authorized user cannot mutate its role.
   * @param {ITenantUser} oldTenantUser 
   * @param {IEditUserDTO} editUserDTO 
   * @param {ISystemUser} authorizedUser 
   */
  validateMutateRoleNotAuthorizedUser(
    oldTenantUser: ITenantUser,
    editUserDTO: IEditUserDTO,
    authorizedUser: ISystemUser
  ) {
    if (
      authorizedUser.id === oldTenantUser.systemUserId &&
      editUserDTO.roleId !== oldTenantUser.roleId
    ) {
      throw new ServiceError(ERRORS.CANNOT_AUTHORIZED_USER_MUTATE_ROLE);
    }
  }

}
