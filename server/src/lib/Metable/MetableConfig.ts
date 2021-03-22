import { get } from 'lodash';

export default class MetableConfig {
  readonly config: any;

  constructor(config) {
    this.setConfig(config);
  }

  /**
   * Sets config. 
   */
  setConfig(config) {
    this.config = config;
  }
 
  /**
   * 
   * @param {string} key 
   * @param {string} group 
   * @param {string} accessor 
   * @returns {object|string}
   */
  getMetaConfig(key: string, group?: string, accessor?: string) {
    const configGroup = get(this.config, group);
    const config = get(configGroup, key);

    return accessor ? get(config, accessor) : config;
  }

  /**
   * 
   * @param {string} key 
   * @param {string} group 
   * @returns {string}
   */
  getMetaType(key: string, group?: string) {
    return this.getMetaConfig(key, group, 'type');
  }
}