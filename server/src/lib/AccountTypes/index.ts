import { get } from 'lodash';
import { ACCOUNT_TYPES } from 'data/AccountTypes';

export default class AccountTypesUtils {

  /**
   * Retrieve account types list.
   */
  static getList() {
    return ACCOUNT_TYPES;
  }

  /**
   * 
   * @param {string} rootType 
   */
  static getTypesByRootType(rootType: string) {
    return ACCOUNT_TYPES.filter((type) => type.rootType === rootType);
  }

  /**
   * 
   * @param {string} key 
   * @param {string} accessor 
   */
  static getType(key: string, accessor?: string) {
    const type = ACCOUNT_TYPES.find((type) => type.key === key);

    if (accessor) {
      return get(type, accessor);
    }
    return type;
  }

  /**
   * 
   * @param {string} parentType 
   */
  static getTypesByParentType(parentType: string) {
    return ACCOUNT_TYPES.filter((type) => type.parentType === parentType);
  }

  /**
   * 
   * @param {string} normal 
   */
  static getTypesByNormal(normal: string) {
    return ACCOUNT_TYPES.filter((type) => type.normal === normal);
  }


  /**
   * 
   * @param {string} key 
   * @param {string} rootType 
   */
  static isRootTypeEqualsKey(key: string, rootType: string) {
    return ACCOUNT_TYPES.some((type) => {
      const isType = type.key === key;
      const isRootType = type.rootType === rootType;

      return isType && isRootType;
    });
  }

  /**
   * 
   * @param {string} key 
   * @param {string} parentType 
   */
  static isParentTypeEqualsKey(key: string, parentType: string) {
    return ACCOUNT_TYPES.some((type) => {
      const isType = type.key === key;
      const isParentType = type.parentType === parentType;

      return isType && isParentType;
    });
  }

  /**
   * 
   * @param {string} key 
   */
  static isTypeBalanceSheet(key: string) {
    return ACCOUNT_TYPES.some((type) => {
      const isType = type.key === key;
      return isType && type.balanceSheet;
    });
  }

  /**
   * 
   * @param {string} key 
   */
  static isTypePLSheet(key: string) {
    return ACCOUNT_TYPES.some((type) => {
      const isType = type.key === key;
      return isType && type.incomeSheet;
    });
  }
}