import TenancyService from 'services/Tenancy/TenancyService';
import { Inject, Service } from 'typedi';
import { ServiceError, ServiceErrors } from 'exceptions';
import { ISystemUser, ISystemUserDTO } from 'interfaces';
import { SystemUser } from 'system/models';

const ERRORS = {
  CANNOT_DELETE_LAST_USER: 'CANNOT_DELETE_LAST_USER',
  USER_ALREADY_ACTIVE: 'USER_ALREADY_ACTIVE',
  USER_ALREADY_INACTIVE: 'USER_ALREADY_INACTIVE',
  EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS',
  PHONE_NUMBER_ALREADY_EXIST: 'PHONE_NUMBER_ALREADY_EXIST',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  USER_SAME_THE_AUTHORIZED_USER: 'USER_SAME_THE_AUTHORIZED_USER',
};

@Service()
export default class UsersService {
  @Inject()
  tenancy: TenancyService;

  @Inject('logger')
  logger: any;

  @Inject('repositories')
  repositories: any;

  /**
   * Creates a new user.
   * @param  {number} tenantId
   * @param  {number} userId
   * @param  {IUserDTO} userDTO
   * @return {Promise<ISystemUser>}
   */
  public async editUser(
    tenantId: number,
    userId: number,
    userDTO: ISystemUserDTO
  ): Promise<ISystemUser> {
    const { systemUserRepository } = this.repositories;

    const userByEmail = await SystemUser.query()
      .where('email', userDTO.email)
      .whereNot('id', userId);

    const userByPhoneNumber = await SystemUser.query()
      .where('phone_number', userDTO.phoneNumber)
      .whereNot('id', userId);

    const serviceErrors: ServiceError[] = [];

    if (userByEmail.length > 0) {
      serviceErrors.push(new ServiceError(ERRORS.EMAIL_ALREADY_EXISTS));
    }
    if (userByPhoneNumber.length > 0) {
      serviceErrors.push(new ServiceError(ERRORS.PHONE_NUMBER_ALREADY_EXIST));
    }
    if (serviceErrors.length > 0) {
      throw new ServiceErrors(serviceErrors);
    }
    const updateSystemUser = await systemUserRepository.update(
      { ...userDTO },
      { id: userId }
    );
    return updateSystemUser;
  }

  /**
   * Deletes the given user id.
   * @param {number} tenantId
   * @param {number} userId
   */
  public async deleteUser(tenantId: number, userId: number): Promise<void> {
    const { systemUserRepository } = this.repositories;

    // Retrieve user details or throw not found service error.
    const oldUser = await this.getUserOrThrowError(tenantId, userId);

    this.logger.info('[users] trying to delete the given user.', {
      tenantId,
      userId,
    });
    // Validate the delete user should not be the last user.
    await this.validateNotLastUserDelete(tenantId);

    // Delete user from the storage.
    await systemUserRepository.deleteById(userId);

    this.logger.info('[users] the given user deleted successfully.', {
      tenantId,
      userId,
    });
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
    const { systemUserRepository } = this.repositories;

    // Throw service error if the given user is equals the authorized user.
    this.throwErrorIfUserSameAuthorizedUser(userId, authorizedUser);

    // Retrieve the user or throw not found service error.
    const user = await this.getUserOrThrowError(tenantId, userId);

    // Throw serivce error if the user is already activated.
    this.throwErrorIfUserActive(user);

    await systemUserRepository.activateById(userId);
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
    const { systemUserRepository } = this.repositories;

    // Throw service error if the given user is equals the authorized user.
    this.throwErrorIfUserSameAuthorizedUser(userId, authorizedUser);

    // Retrieve the user or throw not found service error.
    const user = await this.getUserOrThrowError(tenantId, userId);

    // Throw serivce error if the user is already inactivated.
    this.throwErrorIfUserInactive(user);

    await systemUserRepository.inactivateById(userId);
  }

  /**
   * Retrieve users list based on the given filter.
   * @param {number} tenantId
   * @param {object} filter
   */
  public async getList(tenantId: number) {
    const { systemUserRepository } = this.repositories;

    const users = await systemUserRepository.find({ tenantId });

    return users;
  }

  /**
   * Retrieve the given user details.
   * @param {number} tenantId - Tenant id.
   * @param {number} userId - User id.
   */
  public async getUser(tenantId: number, userId: number) {
    return this.getUserOrThrowError(tenantId, userId);
  }

    /**
   * Validate user existance throw error in case user was not found.,
   * @param {number} tenantId -
   * @param {number} userId -
   * @returns {ISystemUser}
   */
  async getUserOrThrowError(
    tenantId: number,
    userId: number
  ): Promise<ISystemUser> {
    const { systemUserRepository } = this.repositories;

    const user = await systemUserRepository.findOneByIdAndTenant(
      userId,
      tenantId
    );
    if (!user) {
      this.logger.info('[users] the given user not found.', {
        tenantId,
        userId,
      });
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
  private throwErrorIfUserInactive(user: ISystemUser) {
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
}
