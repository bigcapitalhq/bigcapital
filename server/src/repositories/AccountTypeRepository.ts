import TenantRepository from 'repositories/TenantRepository';
import { IAccountType } from 'interfaces';

export default class AccountTypeRepository extends TenantRepository {
  /**
   * Retrieve all accounts types.
   * @return {IAccountType[]}
   */
  all() {
    const { AccountType } = this.models;
    return this.cache.get('accountType.all', () => {
      return AccountType.query();
    });
  }

  /**
   * Retrieve account type meta.
   * @param {number} accountTypeId 
   * @return {IAccountType}
   */
  getTypeMeta(accountTypeId: number): IAccountType {
    const { AccountType } = this.models;
    return this.cache.get(`accountType.id.${accountTypeId}`, () => {
      return AccountType.query().findById(accountTypeId);
    });
  }

  /**
   * Retrieve accounts types of the given keys.
   * @param {string[]} keys 
   * @return {IAccountType[]}
   */
  getByKeys(keys: string[]): IAccountType[] {
    const { AccountType } = this.models;
    return this.cache.get(`accountType.keys.${keys.join(',')}`, () => {
      return AccountType.query().whereIn('key', keys);
    });
  }

  /**
   * Retrieve account tpy eof the given key.
   * @param {string} key 
   * @return {IAccountType}
   */
  getByKey(key: string): IAccountType {
    const { AccountType } = this.models;
    return this.cache.get(`accountType.key.${key}`, () => {
      return AccountType.query().findOne('key', key);
    });
  }

  /**
   * Retrieve accounts types of the given root type.
   * @param {string} rootType 
   * @return {IAccountType[]}
   */
  getByRootType(rootType: string): Promise<IAccountType[]> {
    const { AccountType } = this.models;
    return this.cache.get(`accountType.rootType.${rootType}`, () => {
      return AccountType.query().where('root_type', rootType);
    });
  }

  /**
   * Retrieve accounts types of the given child type.
   * @param {string} childType 
   */
  getByChildType(childType: string): Promise<IAccountType[]> {
    const { AccountType } = this.models;
    return this.cache.get(`accountType.childType.${childType}`, () => {
      return AccountType.query().where('child_type', childType);
    });
  }

  /**
   * Flush repository cache.
   */
  flushCache() {
    this.cache.delStartWith('accountType');
  }
}