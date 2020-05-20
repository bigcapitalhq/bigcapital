import TenantModel from '@/models/TenantModel';
import MetableCollection from '@/lib/Metable/MetableCollection';
import definedOptions from '@/data/options';


export default class Option extends TenantModel {
  /**
   * Table name.
   */
  static get tableName() {
    return 'options';
  }

  /**
   * Override the model query.
   * @param  {...any} args -
   */
  static query(...args) {
    return super.query(...args).runAfter((result) => {
      if (result instanceof MetableCollection) {
        result.setModel(this.tenant());
        result.setExtraColumns(['group']);
      }
      return result;
    });
  }

  /**
   * Model collection.
   */
  static get collection() {
    return MetableCollection;
  }

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
