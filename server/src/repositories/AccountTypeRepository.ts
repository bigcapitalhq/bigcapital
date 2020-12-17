import TenantRepository from 'repositories/TenantRepository';
import { IAccountType } from 'interfaces';
import { AccountType } from 'models';

export default class AccountTypeRepository extends TenantRepository {
  /**
   * Gets the repository's model.
   */
  get model() {
    return AccountType.bindKnex(this.knex);
  }

  /**
   * Retrieve accounts types of the given keys.
   * @param {string[]} keys 
   * @return {Promise<IAccountType[]>}
   */
  getByKeys(keys: string[]): Promise<IAccountType[]> {
    return super.findWhereIn('key', keys);
  }

  /**
   * Retrieve account tpy eof the given key.
   * @param {string} key 
   * @return {Promise<IAccountType>}
   */
  getByKey(key: string): Promise<IAccountType> {
    return super.findOne({ key });
  }

  /**
   * Retrieve accounts types of the given root type.
   * @param {string} rootType 
   * @return {Promise<IAccountType[]>}
   */
  getByRootType(rootType: string): Promise<IAccountType[]> {
    return super.find({ root_type: rootType });
  }

  /**
   * Retrieve accounts types of the given child type.
   * @param {string} childType 
   * @return {Promise<IAccountType[]>}
   */
  getByChildType(childType: string): Promise<IAccountType[]> {
    return super.find({ child_type: childType });
  }
}