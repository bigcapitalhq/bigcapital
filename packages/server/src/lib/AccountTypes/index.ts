import { get } from 'lodash';
import { ACCOUNT_TYPES } from '@/data/AccountTypes';

export default class AccountTypesUtils {
  /**
   * Retrieve account types list.
   */
  static getList() {
    return ACCOUNT_TYPES;
  }

  /**
   * Retrieve accounts types by the given root type.
   * @param {string} rootType -
   * @return {string}
   */
  static getTypesByRootType(rootType: string) {
    return ACCOUNT_TYPES.filter((type) => type.rootType === rootType);
  }

  /**
   * Retrieve account type by the given account type key.
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
   * Retrieve accounts types by the parent account type.
   * @param {string} parentType 
   */
  static getTypesByParentType(parentType: string) {
    return ACCOUNT_TYPES.filter((type) => type.parentType === parentType);
  }

  /**
   * Retrieve accounts types by the given account normal.
   * @param {string} normal 
   */
  static getTypesByNormal(normal: string) {
    return ACCOUNT_TYPES.filter((type) => type.normal === normal);
  }

  /**
   * Determines whether the root type equals the account type. 
   * @param {string} key 
   * @param {string} rootType 
   */
  static isRootTypeEqualsKey(key: string, rootType: string): boolean {
    return ACCOUNT_TYPES.some((type) => {
      const isType = type.key === key;
      const isRootType = type.rootType === rootType;

      return isType && isRootType;
    });
  }

  /**
   * Determines whether the parent account type equals the account type key.
   * @param {string} key - Account type key.
   * @param {string} parentType - Account parent type.
   */
  static isParentTypeEqualsKey(key: string, parentType: string): boolean {
    return ACCOUNT_TYPES.some((type) => {
      const isType = type.key === key;
      const isParentType = type.parentType === parentType;

      return isType && isParentType;
    });
  }

  /**
   * Determines whether account type has balance sheet.
   * @param {string} key - Account type key.
   * 
   */
  static isTypeBalanceSheet(key: string): boolean {
    return ACCOUNT_TYPES.some((type) => {
      const isType = type.key === key;
      return isType && type.balanceSheet;
    });
  }

  /**
   * Determines whether account type has profit/loss sheet.
   * @param {string} key - Account type key.
   */
  static isTypePLSheet(key: string): boolean {
    return ACCOUNT_TYPES.some((type) => {
      const isType = type.key === key;
      return isType && type.incomeSheet;
    });
  }
}