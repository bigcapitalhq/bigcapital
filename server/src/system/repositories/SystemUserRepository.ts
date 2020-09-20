import { Service, Inject } from 'typedi';
import moment from 'moment';
import SystemRepository from "system/repositories/SystemRepository";
import { SystemUser } from "system/models";
import { ISystemUser } from 'interfaces';

@Service()
export default class SystemUserRepository extends SystemRepository {
  @Inject('cache')
  cache: any;

  /**
   * Patches the last login date to the given system user.
   * @param {number} userId 
   */
  async patchLastLoginAt(userId: number) {
    const user = await SystemUser.query().patchAndFetchById(userId, {
      last_login_at: moment().toMySqlDateTime()
    });
    this.flushUserCache(user);
    return user;
  }

  /**
   * Finds system user by crediential.
   * @param  {string} crediential - Phone number or email.
   * @return {ISystemUser}
   */
  findByCrediential(crediential: string) {
    return SystemUser.query().whereNotDeleted()
      .findOne('email', crediential)
      .orWhere('phone_number', crediential);
  }
 
  /**
   * Retrieve system user details of the given id.
   * @param {number} userId 
   */
  getById(userId: number) {
    return this.cache.get(`systemUser.id.${userId}`, () => {
      return SystemUser.query().whereNotDeleted().findById(userId);
    });
  }

  /**
   * Retrieve user by id and tenant id.
   * @param {number} userId 
   * @param {number} tenantId 
   */
  getByIdAndTenant(userId: number, tenantId: number) {
    return this.cache.get(`systemUser.id.${userId}.tenant.${tenantId}`, () => {
      return SystemUser.query().whereNotDeleted()
        .findOne({ id: userId, tenant_id: tenantId });
    });
  }

  /**
   * Retrieve system user details by the given email.
   * @param {string} email 
   */
  getByEmail(email: string) {
    return this.cache.get(`systemUser.email.${email}`, () => {
      return SystemUser.query().whereNotDeleted().findOne('email', email);
    });
  }

  /**
   * Retrieve user by phone number.
   * @param {string} phoneNumber 
   */
  getByPhoneNumber(phoneNumber: string) {
    return this.cache.get(`systemUser.phoneNumber.${phoneNumber}`, () => {
      return SystemUser.query().whereNotDeleted().findOne('phoneNumber', phoneNumber);
    });
  }

  /**
   * Edits details.
   * @param {number} userId 
   * @param {number} user 
   */ 
  edit(userId: number, userInput: ISystemUser) {
    const user = SystemUser.query().patchAndFetchById(userId, { ...userInput });
    this.flushUserCache(user);
    return user;
  }

  /**
   * Creates a new user.
   * @param {IUser} userInput 
   */
  create(userInput: ISystemUser) {
    return SystemUser.query().insert({ ...userInput });
  }

  /**
   * Deletes user by the given id.
   * @param {number} userId 
   */
  async deleteById(userId: number) {
    const user = await this.getById(userId);
    await SystemUser.query().where('id', userId).delete();
    this.flushUserCache(user);
  }

  /**
   * Activate user by the given id.
   * @param {number} userId 
   */
  async activateById(userId: number) {
    const user = await SystemUser.query().patchAndFetchById(userId, { active: 1 });
    this.flushUserCache(user);
    return user;
  }

  /**
   * Inactivate user by the given id.
   * @param {number} userId 
   */
  async inactivateById(userId: number) {
    const user = await SystemUser.query().patchAndFetchById(userId, { active: 0 });
    this.flushUserCache(user);
    return user;
  }

  /**
   * Flush user cache.
   * @param {IUser} user 
   */
  flushUserCache(user: ISystemUser) {
    this.cache.del(`systemUser.phoneNumber.${user.phoneNumber}`);
    this.cache.del(`systemUser.email.${user.email}`);

    this.cache.del(`systemUser.id.${user.id}`);
    this.cache.del(`systemUser.id.${user.id}.tenant.${user.tenantId}`);
  }
}