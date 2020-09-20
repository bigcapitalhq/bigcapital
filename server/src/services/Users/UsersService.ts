import { Inject, Service } from "typedi";
import TenancyService from 'services/Tenancy/TenancyService';
import { SystemUser } from "system/models";
import { ServiceError, ServiceErrors } from "exceptions";
import { ISystemUser, ISystemUserDTO } from "interfaces";
import systemRepositories from "loaders/systemRepositories";

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
  async editUser(tenantId: number, userId: number, userDTO: ISystemUserDTO): Promise<ISystemUser> {
    const { systemUserRepository } = this.repositories;

    const isEmailExists = await systemUserRepository.isEmailExists(userDTO.email, userId);
    const isPhoneNumberExists = await systemUserRepository.isPhoneNumberExists(userDTO.phoneNumber, userId);

    const serviceErrors: ServiceError[] = [];

    if (isEmailExists) {
      serviceErrors.push(new ServiceError('email_already_exists'));
    }
    if (isPhoneNumberExists) {
      serviceErrors.push(new ServiceError('phone_number_already_exist'));
    }
    if (serviceErrors.length > 0) {
      throw new ServiceErrors(serviceErrors);
    }
    const updateSystemUser = await SystemUser.query()
      .where('id', userId)
      .update({ ...userDTO });

    return updateSystemUser;
  }

  /**
   * Validate user existance throw error in case user was not found.,
   * @param {number} tenantId - 
   * @param {number} userId -
   * @returns {ISystemUser}
   */
  async getUserOrThrowError(tenantId: number, userId: number): Promise<ISystemUser> {
    const { systemUserRepository } = this.repositories;
    const user = await systemUserRepository.getByIdAndTenant(userId, tenantId);

    if (!user) {
      this.logger.info('[users] the given user not found.', { tenantId, userId });
      throw new ServiceError('user_not_found');
    }
    return user;
  }

  /**
   * Deletes the given user id.
   * @param {number} tenantId 
   * @param {number} userId 
   */
  async deleteUser(tenantId: number, userId: number): Promise<void> {
    const { systemUserRepository } = this.repositories;
    await this.getUserOrThrowError(tenantId, userId);

    this.logger.info('[users] trying to delete the given user.', { tenantId, userId });
    await systemUserRepository.deleteById(userId);
     
    this.logger.info('[users] the given user deleted successfully.', { tenantId, userId });
  }

  /**
   * Activate the given user id.
   * @param {number} tenantId 
   * @param {number} userId 
   */
  async activateUser(tenantId: number, userId: number, authorizedUser: ISystemUser): Promise<void> {
    this.throwErrorIfUserIdSameAuthorizedUser(userId, authorizedUser);
    const { systemUserRepository } = this.repositories;

    const user = await this.getUserOrThrowError(tenantId, userId);
    this.throwErrorIfUserActive(user);

    await systemUserRepository.activateUser(userId);
  }

  /**
   * Inactivate the given user id.
   * @param {number} tenantId 
   * @param {number} userId 
   * @return {Promise<void>}
   */
  async inactivateUser(tenantId: number, userId: number, authorizedUser: ISystemUser): Promise<void> {
    this.throwErrorIfUserIdSameAuthorizedUser(userId, authorizedUser);
    const { systemUserRepository } = this.repositories;

    const user = await this.getUserOrThrowError(tenantId, userId);
    this.throwErrorIfUserInactive(user);

    await systemUserRepository.inactivateById(userId);
  }

  /**
   * Retrieve users list based on the given filter.
   * @param {number} tenantId 
   * @param {object} filter 
   */
  async getList(tenantId: number) {
    const users = await SystemUser.query()
      .whereNotDeleted()
      .where('tenant_id', tenantId);

    return users;
  }

  /**
   * Retrieve the given user details.
   * @param {number} tenantId - Tenant id.
   * @param {number} userId - User id.
   */
  async getUser(tenantId: number, userId: number) {
    return this.getUserOrThrowError(tenantId, userId);
  }

  /**
   * Throws service error in case the user was already active.
   * @param {ISystemUser} user 
   * @throws {ServiceError}
   */
  throwErrorIfUserActive(user: ISystemUser) {
    if (user.active) {
      throw new ServiceError('user_already_active');
    }
  }

  /**
   * Throws service error in case the user was already inactive.
   * @param {ISystemUser} user 
   * @throws {ServiceError}
   */
  throwErrorIfUserInactive(user: ISystemUser) {
    if (!user.active) {
      throw new ServiceError('user_already_inactive');
    }
  }

  /**
   * Throw service error in case the given user same the authorized user. 
   * @param {number} userId 
   * @param {ISystemUser} authorizedUser 
   */
  throwErrorIfUserIdSameAuthorizedUser(userId: number, authorizedUser: ISystemUser) {
    if (userId === authorizedUser.id) {
      throw new ServiceError('user_same_the_authorized_user');
    }
  }
}