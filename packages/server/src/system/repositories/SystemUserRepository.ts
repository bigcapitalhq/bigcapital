import moment from 'moment';
import SystemRepository from '@/system/repositories/SystemRepository';
import { SystemUser } from '@/system/models';
import { ISystemUser } from '@/interfaces';

export default class SystemUserRepository extends SystemRepository {
  /**
   * Gets the repository's model.
   */
  get model() {
    return SystemUser.bindKnex(this.knex);
  }

  /**
   * Finds system user by credential.
   * @param  {string} credential - Phone number or email.
   * @return {ISystemUser}
   * @return {Promise<ISystemUser>}
   */
  findByCredential(credential: string): Promise<ISystemUser> {
    const cacheKey = this.getCacheKey('findByCredential', credential);

    return this.cache.get(cacheKey, () => {
      return this.model.query()
        .findOne('email', credential)
        .orWhere('phone_number', credential);
    });
  }

  /**
   * Retrieve user by id and tenant id.
   * @param  {number} userId - User id.
   * @param  {number} tenantId - Tenant id.
   * @return {Promise<ISystemUser>}
   */
  findOneByIdAndTenant(userId: number, tenantId: number): Promise<ISystemUser> {
    const cacheKey = this.getCacheKey('findOneByIdAndTenant', userId, tenantId);

    return this.cache.get(cacheKey, () => {
      return this.model.query()
        .findOne({ id: userId, tenant_id: tenantId });
    });
  }

  /**
   * Retrieve system user details by the given email.
   * @param  {string} email - Email
   * @return {Promise<ISystemUser>}
   */
  findOneByEmail(email: string): Promise<ISystemUser> {
    const cacheKey = this.getCacheKey('findOneByEmail', email);

    return this.cache.get(cacheKey, () => {
      return this.model.query().findOne('email', email);
    });
  }

  /**
   * Retrieve user by phone number.
   * @param {string} phoneNumber - Phone number
   * @return {Promise<ISystemUser>}
   */
  findOneByPhoneNumber(phoneNumber: string): Promise<ISystemUser> {
    const cacheKey = this.getCacheKey('findOneByPhoneNumber', phoneNumber);

    return this.cache.get(cacheKey, () => {
      return this.model.query()
        .findOne('phoneNumber', phoneNumber);
    });
  }

  /**
   * Patches the last login date to the given system user.
   * @param  {number} userId
   * @return {Promise<void>}
   */
  patchLastLoginAt(userId: number): Promise<void> {
    return super.update(
      { last_login_at: moment().toMySqlDateTime() },
      { id: userId }
    );
  }

  /**
   * Activate user by the given id.
   * @param  {number} userId - User id.
   * @return {Promise<void>}
   */
  activateById(userId: number): Promise<void> {
    return super.update({ active: 1 }, { id: userId });
  }

  /**
   * Inactivate user by the given id.
   * @param  {number} userId - User id.
   * @return {Promise<void>}
   */
  inactivateById(userId: number): Promise<void> {
    return super.update({ active: 0 }, { id: userId });
  }
}
