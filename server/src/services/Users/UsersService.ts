import { Inject, Service } from "typedi";
import TenancyService from '@/services/Tenancy/TenancyService';
import { SystemUser } from "@/system/models";
import { ServiceError, ServiceErrors } from "@/exceptions";
import { ISystemUser, ISystemUserDTO } from "@/interfaces";

@Service()
export default class UsersService {
  @Inject()
  tenancy: TenancyService;

  @Inject('logger')
  logger: any;

  /**
   * Creates a new user.
   * @param  {number} tenantId 
   * @param  {number} userId 
   * @param  {IUserDTO} userDTO 
   * @return {Promise<ISystemUser>}
   */
  async editUser(tenantId: number, userId: number, userDTO: ISystemUserDTO): Promise<ISystemUser> {
    const foundUsers = await SystemUser.query()
      .whereNot('id', userId)
      .andWhere((query) => {
        query.where('email', userDTO.email);
        query.orWhere('phone_number', userDTO.phoneNumber);
      })
      .where('tenant_id', tenantId);

    const sameUserEmail = foundUsers
      .some((u: ISystemUser) => u.email === userDTO.email);

    const samePhoneNumber = foundUsers
      .some((u: ISystemUser) => u.phoneNumber === userDTO.phone_number);

    const serviceErrors: ServiceError[] = [];

    if (sameUserEmail) {
      serviceErrors.push(new ServiceError('email_already_exists'));
    }
    if (samePhoneNumber) {
      serviceErrors.push(new ServiceError('phone_number_already_exist'));
    }
    if (serviceErrors.length > 0) {
      throw new ServiceErrors(serviceErrors);
    }
    const updateSystemUser = await SystemUser.query()
      .where('id', userId)
      .update({
        ...userDTO,
      });
    return updateSystemUser;
  }

  /**
   * Validate user existance throw error in case user was not found.,
   * @param {number} tenantId - 
   * @param {number} userId -
   * @returns {ISystemUser}
   */
  async getUserOrThrowError(tenantId: number, userId: number): void {
    const user = await SystemUser.query().findOne({
      id: userId, tenant_id: tenantId,
    });
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
    await this.getUserOrThrowError(tenantId, userId);
    
    this.logger.info('[users] trying to delete the given user.', { tenantId, userId });
    await SystemUser.query().where('tenant_id', tenantId)
      .where('id', userId).delete();
     
    this.logger.info('[users] the given user deleted successfully.', { tenantId, userId });
  }

  /**
   * Activate the given user id.
   * @param {number} tenantId 
   * @param {number} userId 
   */
  async activateUser(tenantId: number, userId: number): Promise<void> {
    const user = await this.getUserOrThrowError(tenantId, userId);
    this.throwErrorIfUserActive(user);

    await SystemUser.query().findById(userId).update({ active: true });
  }
  
  /**
   * Inactivate the given user id.
   * @param {number} tenantId 
   * @param {number} userId 
   * @return {Promise<void>}
   */
  async inactivateUser(tenantId: number, userId: number): Promise<void> {
    const user = await this.getUserOrThrowError(tenantId, userId);
    this.throwErrorIfUserInactive(user);

    await SystemUser.query().findById(userId).update({ active: false });
  }

  /**
   * Retrieve users list based on the given filter.
   * @param {number} tenantId 
   * @param {object} filter 
   */
  async getList(tenantId: number) {
    const users = await SystemUser.query()
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
}