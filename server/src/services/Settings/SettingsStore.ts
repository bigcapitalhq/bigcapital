import Knex from 'knex';
import MetableStoreDB from 'lib/Metable/MetableStoreDB';
import Setting from 'models/Setting';

export default class SettingsStore extends MetableStoreDB {
  /**
   * Constructor method.
   * @param {number} tenantId 
   */
  constructor(knex: Knex) {
    super();
    this.setExtraColumns(['group']);
    this.setModel(Setting.bindKnex(knex));
  }
}