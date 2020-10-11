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
   * @return {Promise<void>}
   */
  async patchLastLoginAt(userId: number): Promise<void> {
    await SystemUser.query().patchAndFetchById(userId, {
      last_login_at: moment().toMySqlDateTime()
    });
    this.flushCache();
  }

  /**
   * Finds system user by crediential.
   * @param  {string} crediential - Phone number or email.
   * @return {ISystemUser}
   * @return {Promise<ISystemUser>}
   */
  findByCrediential(crediential: string): Promise<ISystemUser> {
    return SystemUser.query().whereNotDeleted()
      .findOne('email', crediential)
      .orWhere('phone_number', crediential);
  }
 
  /**
   * Retrieve system user details of the given id.
   * @param {number} userId - User id.
   * @return {Promise<ISystemUser>}
   */
  getById(userId: number): Promise<ISystemUser> {
    return this.cache.get(`systemUser.id.${userId}`, () => {
      return SystemUser.query().whereNotDeleted().findById(userId);
    });
  }

  /**
   * Retrieve user by id and tenant id.
   * @param {number} userId - User id.
   * @param {number} tenantId - Tenant id.
   * @return {Promise<ISystemUser>}
   */
  getByIdAndTenant(userId: number, tenantId: number): Promise<ISystemUser> {
    return this.cache.get(`systemUser.id.${userId}.tenant.${tenantId}`, () => {
      return SystemUser.query().whereNotDeleted()
        .findOne({ id: userId, tenant_id: tenantId });
    });
  }

  /**
   * Retrieve system user details by the given email.
   * @param {string} email - Email
   * @return {Promise<ISystemUser>}
   */
  getByEmail(email: string): Promise<ISystemUser> {
    return this.cache.get(`systemUser.email.${email}`, () => {
      return SystemUser.query().whereNotDeleted().findOne('email', email);
    });
  }

  /**
   * Retrieve user by phone number.
   * @param {string} phoneNumber - Phone number
   * @return {Promise<ISystemUser>}
   */
  getByPhoneNumber(phoneNumber: string): Promise<ISystemUser> {
    return this.cache.get(`systemUser.phoneNumber.${phoneNumber}`, () => {
      return SystemUser.query().whereNotDeleted().findOne('phoneNumber', phoneNumber);
    });
  }

  /**
   * Edits details.
   * @param {number} userId - User id.
   * @param {number} user - User input.
   * @return {Promise<void>}
   */ 
  async edit(userId: number, userInput: ISystemUser): Promise<void> {
    await SystemUser.query().patchAndFetchById(userId, { ...userInput });
    this.flushCache();
  }

  /**
   * Creates a new user.
   * @param  {IUser} userInput - User input.
   * @return {Promise<ISystemUser>}
   */
  async create(userInput: ISystemUser): Promise<ISystemUser> {
    const systemUser = await SystemUser.query().insert({ ...userInput });
    this.flushCache();

    return systemUser;
  }

  /**
   * Deletes user by the given id.
   * @param  {number} userId - User id.
   * @return {Promise<void>}
   */
  async deleteById(userId: number): Promise<void> {
    await SystemUser.query().where('id', userId).delete();
    this.flushCache();
  }

  /**
   * Activate user by the given id.
   * @param {number} userId - User id.
   * @return {Promise<void>}
   */
  async activateById(userId: number): Promise<void> {
    await SystemUser.query().patchAndFetchById(userId, { active: 1 });
    this.flushCache();
  }

  /**
   * Inactivate user by the given id.
   * @param {number} userId - User id.
   * @return {Promise<void>}
   */
  async inactivateById(userId: number): Promise<void> {
    await SystemUser.query().patchAndFetchById(userId, { active: 0 });
    this.flushCache();
  }

  /**
   * Flushes user repository cache.
   */
  flushCache() {
    this.cache.delStartWith('systemUser');
  }
}