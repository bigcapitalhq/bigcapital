import { ManualJournal } from 'models';
import TenantRepository from '@/repositories/TenantRepository';

export default class JournalRepository extends TenantRepository {
  /**
   * Gets the repository's model.
   */
  get model() {
    return ManualJournal.bindKnex(this.knex);
  }
}