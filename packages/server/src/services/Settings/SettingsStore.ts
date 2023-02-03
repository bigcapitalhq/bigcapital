import Knex from 'knex';
import MetableStoreDB from '@/lib/Metable/MetableStoreDB';
import Setting from 'models/Setting';

export default class SettingsStore extends MetableStoreDB {
  /**
   * Constructor method.
   * @param {number} tenantId 
   */
  constructor(repository) {
    super();
    this.setExtraColumns(['group']);
    this.setRepository(repository);
  }
}