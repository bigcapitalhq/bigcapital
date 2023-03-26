import TenantModel from 'models/TenantModel';
import definedOptions from '@/data/options';


export default class Option extends TenantModel {
  /**
   * Table name.
   */
  static get tableName() {
    return 'options';
  }

  /**
   * Validates the given options is defined or either not.
   * @param {Array} options 
   * @return {Boolean}
   */
  static validateDefined(options) {
    const notDefined = [];

    options.forEach((option) => {
      if (!definedOptions[option.group]) {
        notDefined.push(option);
      } else if (!definedOptions[option.group].some((o) => o.key === option.key)) {
        notDefined.push(option);
      }
    });
    return notDefined;
  }
}
