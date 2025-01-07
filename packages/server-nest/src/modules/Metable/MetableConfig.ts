import { get } from 'lodash';

export class MetableConfig {
  public config: any;

  constructor(config: any) {
    this.setConfig(config);
  }

  /**
   * Sets the config.
   */
  setConfig(config: any) {
    this.config = config;
  }

  /**
   * Gets the meta config.
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
   * Gets the meta type.
   * @param {string} key
   * @param {string} group
   * @returns {string}
   */
  getMetaType(key: string, group?: string) {
    return this.getMetaConfig(key, group, 'type');
  }
}
